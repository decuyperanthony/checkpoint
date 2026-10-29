import { Effect, Layer } from "effect";

import { Authorization } from "@/contract/Authorization";
import { SessionExpired } from "@/contract/errors/SessionExpired";
import { ApiTokenVerifier } from "@/server/security/ApiTokenVerifier";
import { AuthService } from "@/server/services/AuthService";

// Runs an endpoint only for a valid bearer token or a valid session; otherwise it answers
// SessionExpired.
export const ApiAuthorization = Layer.effect(
  Authorization,
  Effect.gen(function* () {
    const auth = yield* AuthService;
    const tokens = yield* ApiTokenVerifier;

    return Authorization.of({
      token: (endpoint, { credential }) =>
        tokens.verify(credential).pipe(
          Effect.filterOrFail(
            (valid) => valid,
            () => new SessionExpired(),
          ),
          Effect.andThen(endpoint),
        ),
      session: (endpoint, { credential }) => auth.authenticate(credential).pipe(Effect.andThen(endpoint)),
    });
  }),
);
