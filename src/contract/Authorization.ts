import { HttpApiMiddleware, HttpApiSecurity } from "effect/http-api";

import { SessionExpired } from "@/contract/errors/SessionExpired";

// The session token travels in this cookie only: `httpOnly`, so page scripts never see it.
// `__Host-` makes the browser require Secure, Path=/ and no Domain.
export const sessionCookie = HttpApiSecurity.apiKey({ in: "cookie", key: "__Host-checkpoint_session" });

// Every endpoint but logging in requires a session; without one it answers SessionExpired.
export class Authorization extends HttpApiMiddleware.Service<Authorization>()("checkpoint/Authorization", {
  error: SessionExpired,
  security: { session: sessionCookie },
}) {}
