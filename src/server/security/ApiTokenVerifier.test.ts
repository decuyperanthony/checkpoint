import { Effect, Layer, Option, Redacted } from "effect";
import { describe, expect, it } from "vitest";

import { ApiTokenConfig } from "@/server/infra/Config";

import { hashApiToken, newApiToken } from "./apiToken";
import { ApiTokenVerifier } from "./ApiTokenVerifier";
import { ApiTokenVerifierSha256 } from "./ApiTokenVerifierSha256";

const verify = (tokenHash: Option.Option<string>, token: string) =>
  Effect.runPromise(
    ApiTokenVerifier.use((verifier) => verifier.verify(Redacted.make(token))).pipe(
      Effect.provide(
        ApiTokenVerifierSha256.pipe(
          Layer.provide(Layer.succeed(ApiTokenConfig, { tokenHash: Option.map(tokenHash, Redacted.make) })),
        ),
      ),
    ),
  );

describe("ApiTokenVerifierSha256", () => {
  const token = newApiToken();

  it("accepts the token the hash was made from", async () => {
    expect(await verify(Option.some(hashApiToken(token)), token)).toBe(true);
  });

  it("refuses another token", async () => {
    expect(await verify(Option.some(hashApiToken(token)), newApiToken())).toBe(false);
  });

  it("refuses every token when none is configured", async () => {
    expect(await verify(Option.none(), token)).toBe(false);
  });
});

describe("newApiToken", () => {
  it("makes a different token each time, with a hash that is a SHA-256 digest", () => {
    expect(newApiToken()).not.toBe(newApiToken());
    expect(hashApiToken("x")).toMatch(/^[0-9a-f]{64}$/);
  });
});
