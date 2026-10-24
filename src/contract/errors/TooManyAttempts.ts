import { Schema } from "effect";

// Too many wrong PINs from one address: logging in is refused until the oldest failures
// leave the window, `retryAfterSeconds` from now.
export class TooManyAttempts extends Schema.TaggedError<TooManyAttempts>()(
  "TooManyAttempts",
  { retryAfterSeconds: Schema.Int.check(Schema.isGreaterThanOrEqualTo(0)) },
  { httpApiStatus: 429 },
) {}
