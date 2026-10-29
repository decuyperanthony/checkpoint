import { createHash, randomBytes } from "node:crypto";

// The token an API client sends: 256 random bits, so a fast hash is enough to keep it (a slow one
// like the PIN's argon2 is for secrets a person can guess).
export const newApiToken = () => `cp_${randomBytes(32).toString("base64url")}`;

// What is stored in `API_TOKEN_HASH`, and what a received token is compared with.
export const hashApiToken = (token: string) => createHash("sha256").update(token).digest("hex");
