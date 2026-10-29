// Makes a bearer token for `Authorization: Bearer <token>` and prints it once, with its SHA-256
// digest for `API_TOKEN_HASH`: only the digest is ever stored on the server. Run it again to
// replace the token (set the new digest, and the old token stops working).
//
//   pnpm hash-api-token

// A relative path with its extension: Node runs this file as is, without the `@/` alias.
import { hashApiToken, newApiToken } from "../src/server/security/apiToken.ts";

const token = newApiToken();

console.log(`Token, to give to the client (shown once, keep it in a password manager):\n${token}`);
console.log(`\nVercel (Settings → Environment Variables), value of API_TOKEN_HASH:\n${hashApiToken(token)}`);
console.log(`\n.env.local:\nAPI_TOKEN_HASH=${hashApiToken(token)}`);
