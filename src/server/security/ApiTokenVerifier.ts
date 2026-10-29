import { Context, type Effect, type Redacted } from "effect";

// Whether a bearer token is the right one. Like PinVerifier, services see this interface only.
export class ApiTokenVerifier extends Context.Service<
  ApiTokenVerifier,
  {
    readonly verify: (token: Redacted.Redacted) => Effect.Effect<boolean>;
  }
>()("checkpoint/ApiTokenVerifier") {}
