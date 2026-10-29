import { timingSafeEqual } from "node:crypto";

import { Effect, Layer, Option, Redacted } from "effect";

import { ApiTokenConfig } from "@/server/infra/Config";

import { hashApiToken } from "./apiToken";
import { ApiTokenVerifier } from "./ApiTokenVerifier";

// Checks a token against the SHA-256 digest from `API_TOKEN_HASH`, in constant time. Without that
// variable no token is accepted: only the PIN opens the API.
export const ApiTokenVerifierSha256 = Layer.effect(
  ApiTokenVerifier,
  Effect.gen(function* () {
    const { tokenHash } = yield* ApiTokenConfig;
    const expected = Option.map(tokenHash, (hash) => Buffer.from(Redacted.value(hash), "hex"));

    return ApiTokenVerifier.of({
      verify: (token) =>
        Effect.sync(() =>
          Option.match(expected, {
            onNone: () => false,
            onSome: (digest) => timingSafeEqual(digest, Buffer.from(hashApiToken(Redacted.value(token)), "hex")),
          }),
        ).pipe(Effect.withSpan("ApiTokenVerifier.verify")),
    });
  }),
);
