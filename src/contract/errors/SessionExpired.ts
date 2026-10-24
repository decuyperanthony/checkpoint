import { Schema } from "effect";

// No session, an unknown one or an expired one: the user has to enter the PIN again.
export class SessionExpired extends Schema.TaggedError<SessionExpired>()(
  "SessionExpired",
  {},
  { httpApiStatus: 401 },
) {}
