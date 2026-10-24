import { Effect, Redacted } from "effect";
import { HttpServerRequest } from "effect/http";
import { HttpApiBuilder } from "effect/http-api";

import { Api } from "@/contract/api";
import { sessionCookie } from "@/contract/Authorization";
import { AuthService } from "@/server/services/AuthService";

// Vercel sets `x-forwarded-for` itself, overwriting what the client sent: its first entry is
// the client's address. Elsewhere (local dev) every request shares one address.
const clientIp = (request: HttpServerRequest.HttpServerRequest) =>
  request.headers["x-forwarded-for"]?.split(",")[0]?.trim() || "unknown";

// `__Host-` cookies need Path=/; `sameSite: "lax"` keeps it off cross-site POSTs.
const cookieOptions = { path: "/", sameSite: "lax" } as const;

export const AuthHandlers = HttpApiBuilder.group(
  Api,
  "auth",
  Effect.fnUntraced(function* (handlers) {
    const auth = yield* AuthService;

    return handlers
      .handle("login", ({ payload }) =>
        Effect.gen(function* () {
          const request = yield* HttpServerRequest.HttpServerRequest;
          const { token, expiresAt } = yield* auth.login({ pin: Redacted.make(payload.pin), ip: clientIp(request) });
          yield* HttpApiBuilder.securitySetCookie(sessionCookie, token, { ...cookieOptions, expires: expiresAt });
        }),
      )
      .handle("logout", () =>
        Effect.gen(function* () {
          yield* auth.logout(yield* HttpApiBuilder.securityDecode(sessionCookie));
          yield* HttpApiBuilder.securitySetCookie(sessionCookie, "", { ...cookieOptions, maxAge: 0 });
        }),
      );
  }),
);
