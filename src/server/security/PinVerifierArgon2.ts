import { verify } from "@node-rs/argon2";
import { Effect, Layer, Redacted } from "effect";

import { AuthConfig } from "@/server/infra/Config";

import { PinVerifier } from "./PinVerifier";

// Checks a PIN against the argon2id hash from `PIN_HASH`. A hash argon2 cannot read is a
// configuration defect, not a wrong PIN.
export const PinVerifierArgon2 = Layer.effect(
  PinVerifier,
  Effect.gen(function* () {
    const { pinHash } = yield* AuthConfig;

    return PinVerifier.of({
      verify: (pin) =>
        Effect.promise(() => verify(Redacted.value(pinHash), Redacted.value(pin))).pipe(
          Effect.withSpan("PinVerifier.verify"),
        ),
    });
  }),
);
