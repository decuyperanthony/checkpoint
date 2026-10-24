import { Clock, Context, Duration, Effect, Layer, Option, type Redacted } from "effect";

import { InvalidPin } from "@/contract/errors/InvalidPin";
import { SessionExpired } from "@/contract/errors/SessionExpired";
import { TooManyAttempts } from "@/contract/errors/TooManyAttempts";
import type { Pin } from "@/contract/schemas/Auth";
import { PinVerifier } from "@/server/security/PinVerifier";
import { LoginAttemptRepository } from "@/server/repositories/LoginAttemptRepository";
import { SessionRepository } from "@/server/repositories/SessionRepository";
import { hashSessionToken, newSessionToken, type SessionToken } from "@/server/services/sessionToken";

export const authPolicy = {
  // Wrong PINs allowed from one address within the window; the next attempt is refused.
  maxFailures: 5,
  failureWindow: Duration.minutes(15),
  sessionDuration: Duration.days(30),
} as const;

const windowMillis = Duration.toMillis(authPolicy.failureWindow);

// Logging in becomes possible again once enough failures have left the window: the one that
// would still make `maxFailures` is the oldest to wait for.
const retryAfterSeconds = (failures: ReadonlyArray<Date>, now: number) => {
  const sorted = failures.map((date) => date.getTime()).toSorted((a, b) => a - b);
  const blocking = sorted[sorted.length - authPolicy.maxFailures] ?? now;
  return Math.max(0, Math.ceil((blocking + windowMillis - now) / 1000));
};

// The service's shape is inferred from `make`. Each operation has a span named after it.
export class AuthService extends Context.Service<AuthService>()("checkpoint/AuthService", {
  make: Effect.gen(function* () {
    const pins = yield* PinVerifier;
    const sessions = yield* SessionRepository;
    const attempts = yield* LoginAttemptRepository;

    return {
      // Refused attempts are not recorded: retrying while blocked does not extend the block.
      login: Effect.fn("AuthService.login")(function* ({ pin, ip }: { pin: Redacted.Redacted<Pin>; ip: string }) {
        const now = yield* Clock.currentTimeMillis;
        const failures = yield* attempts.failuresAfter({ ip, after: new Date(now - windowMillis) });
        if (failures.length >= authPolicy.maxFailures) {
          return yield* new TooManyAttempts({ retryAfterSeconds: retryAfterSeconds(failures, now) });
        }

        const valid = yield* pins.verify(pin);
        yield* attempts.insert({ ip, success: valid, attemptedAt: new Date(now) });
        if (!valid) return yield* new InvalidPin();

        const token = newSessionToken();
        const expiresAt = new Date(now + Duration.toMillis(authPolicy.sessionDuration));
        yield* sessions.insert({ tokenHash: hashSessionToken(token), expiresAt });
        return { token, expiresAt };
      }),

      // Unknown and expired sessions look the same to the caller.
      authenticate: Effect.fn("AuthService.authenticate")(function* (token: SessionToken) {
        const now = yield* Clock.currentTimeMillis;
        const expiresAt = yield* sessions.findExpiry(hashSessionToken(token));
        if (Option.isNone(expiresAt) || expiresAt.value.getTime() <= now) {
          return yield* new SessionExpired();
        }
      }),

      logout: Effect.fn("AuthService.logout")(function* (token: SessionToken) {
        yield* sessions.delete(hashSessionToken(token));
      }),
    };
  }),
}) {
  static readonly layer = Layer.effect(this, this.make);
}
