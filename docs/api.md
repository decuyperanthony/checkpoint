# API for scripts and agents

Everything the app does goes through an HTTP API under `/api`. A script or an agent uses it with a
bearer token instead of the PIN session.

The reference, generated from the contract (OpenAPI, shown with Scalar), is at **`/api/docs`**.

## Set it up

1. `pnpm hash-api-token` prints a token (`cp_…`) and its SHA-256 digest. The token is shown once:
   keep it in a password manager, never in the repo.
2. Put the **digest** in `API_TOKEN_HASH` (Vercel: Settings → Environment Variables, Production and
   Preview; locally `.env.local`). The server never holds the token itself.
3. Redeploy. Without `API_TOKEN_HASH` the API takes no token at all.

Running the script again makes a new token: set the new digest and the old token stops working.

## Use it

```sh
curl https://<your-app>/api/sections -H "Authorization: Bearer $CHECKPOINT_TOKEN"

curl -X POST https://<your-app>/api/sections \
  -H "Authorization: Bearer $CHECKPOINT_TOKEN" -H "content-type: application/json" \
  -d '{"title":"Courses"}'

curl -X POST https://<your-app>/api/sections/<section-id>/items \
  -H "Authorization: Bearer $CHECKPOINT_TOKEN" -H "content-type: application/json" \
  -d '{"content":"Lait"}'
```

A missing or wrong token answers `401` with `{"_tag":"SessionExpired"}`. A token has the same reach
as the PIN: read, create, rename, check and delete everything. Treat it like the PIN.
