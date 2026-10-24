import { Context, type Effect, type Redacted } from "effect";

import type { Pin } from "@/contract/schemas/Auth";

// Whether a PIN is the right one. Services see this interface only; the argon2 Layer reads
// the hash from the configuration.
export class PinVerifier extends Context.Service<
  PinVerifier,
  {
    readonly verify: (pin: Redacted.Redacted<Pin>) => Effect.Effect<boolean>;
  }
>()("checkpoint/PinVerifier") {}
