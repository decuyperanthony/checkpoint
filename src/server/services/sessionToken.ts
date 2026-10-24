import { createHash, randomBytes } from "node:crypto";

import { Redacted } from "effect";

export type SessionToken = Redacted.Redacted<string>;

// 256 random bits: the cookie's value, never stored.
export const newSessionToken = (): SessionToken => Redacted.make(randomBytes(32).toString("base64url"));

// What the database keeps instead. A fast hash is enough: the token is random, there is
// nothing to guess.
export const hashSessionToken = (token: SessionToken) =>
  createHash("sha256").update(Redacted.value(token)).digest("hex");
