import { Duration, Effect, Redacted, Schema } from "effect";
import { TestClock } from "effect/testing";
import { describe, expect, it } from "vitest";

import { InvalidPin } from "@/contract/errors/InvalidPin";
import { SessionExpired } from "@/contract/errors/SessionExpired";
import { TooManyAttempts } from "@/contract/errors/TooManyAttempts";
import { Pin } from "@/contract/schemas/Auth";
import { runServices, testPin } from "@/server/testing/fixtures";

import { AuthService, authPolicy } from "./AuthService";

const right = Redacted.make(testPin);
const wrong = Redacted.make(Schema.decodeSync(Pin)("0000"));
const ip = "203.0.113.7";

// On a test clock, so that windows and expiry are crossed without waiting.
const run = <A, E>(program: Effect.Effect<A, E, AuthService>) =>
  runServices(program.pipe(Effect.provide(TestClock.layer())));

const failTimes = (auth: AuthService["Service"], times: number) =>
  Effect.forEach(Array.from({ length: times }), () => auth.login({ pin: wrong, ip }).pipe(Effect.flip), {
    discard: true,
  });

describe("AuthService", () => {
  it("opens a session for the right PIN, which then authenticates", async () => {
    const result = await run(
      Effect.gen(function* () {
        const auth = yield* AuthService;
        const { token } = yield* auth.login({ pin: right, ip });
        return yield* auth.authenticate(token).pipe(Effect.as("authenticated"));
      }),
    );

    expect(result).toBe("authenticated");
  });

  it("refuses a wrong PIN", async () => {
    const error = await run(
      Effect.gen(function* () {
        const auth = yield* AuthService;
        return yield* auth.login({ pin: wrong, ip }).pipe(Effect.flip);
      }),
    );

    expect(error).toBeInstanceOf(InvalidPin);
  });

  it("blocks an address after too many wrong PINs, even with the right one, until the window has passed", async () => {
    const outcomes = await run(
      Effect.gen(function* () {
        const auth = yield* AuthService;
        yield* failTimes(auth, authPolicy.maxFailures);

        const blocked = yield* auth.login({ pin: right, ip }).pipe(Effect.flip);
        const otherAddress = yield* auth.login({ pin: right, ip: "198.51.100.1" }).pipe(Effect.as("logged in"));
        yield* TestClock.adjust(authPolicy.failureWindow);
        const later = yield* auth.login({ pin: right, ip }).pipe(Effect.as("logged in"));

        return { blocked, otherAddress, later };
      }),
    );

    expect(outcomes.blocked).toEqual(new TooManyAttempts({ retryAfterSeconds: 15 * 60 }));
    expect(outcomes.otherAddress).toBe("logged in");
    expect(outcomes.later).toBe("logged in");
  });

  it("counts failures over a sliding window and says when to retry", async () => {
    const error = await run(
      Effect.gen(function* () {
        const auth = yield* AuthService;
        yield* failTimes(auth, 1);
        yield* TestClock.adjust(Duration.minutes(10));
        yield* failTimes(auth, authPolicy.maxFailures - 1);
        return yield* auth.login({ pin: right, ip }).pipe(Effect.flip);
      }),
    );

    // The first failure leaves the window 5 minutes from now.
    expect(error).toEqual(new TooManyAttempts({ retryAfterSeconds: 5 * 60 }));
  });

  it("does not extend the block when the blocked address keeps trying", async () => {
    const result = await run(
      Effect.gen(function* () {
        const auth = yield* AuthService;
        yield* failTimes(auth, authPolicy.maxFailures);
        yield* TestClock.adjust(Duration.minutes(10));
        yield* failTimes(auth, 3);
        yield* TestClock.adjust(Duration.minutes(5));
        return yield* auth.login({ pin: right, ip }).pipe(Effect.as("logged in"));
      }),
    );

    expect(result).toBe("logged in");
  });

  it("ends a session once it expires", async () => {
    const error = await run(
      Effect.gen(function* () {
        const auth = yield* AuthService;
        const { token } = yield* auth.login({ pin: right, ip });
        yield* TestClock.adjust(authPolicy.sessionDuration);
        return yield* auth.authenticate(token).pipe(Effect.flip);
      }),
    );

    expect(error).toBeInstanceOf(SessionExpired);
  });

  it("ends a session on logout, and refuses a token it never issued", async () => {
    const errors = await run(
      Effect.gen(function* () {
        const auth = yield* AuthService;
        const { token } = yield* auth.login({ pin: right, ip });
        yield* auth.logout(token);
        const loggedOut = yield* auth.authenticate(token).pipe(Effect.flip);
        const forged = yield* auth.authenticate(Redacted.make("forged")).pipe(Effect.flip);
        return [loggedOut, forged];
      }),
    );

    expect(errors).toEqual([new SessionExpired(), new SessionExpired()]);
  });
});
