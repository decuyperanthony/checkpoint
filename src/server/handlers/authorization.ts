import { Effect, Layer } from "effect";

import { Authorization } from "@/contract/Authorization";
import { AuthService } from "@/server/services/AuthService";

// Runs an endpoint only for a valid session; otherwise it answers SessionExpired.
export const SessionAuthorization = Layer.effect(
  Authorization,
  Effect.gen(function* () {
    const auth = yield* AuthService;

    return Authorization.of({
      session: (endpoint, { credential }) => auth.authenticate(credential).pipe(Effect.andThen(endpoint)),
    });
  }),
);
