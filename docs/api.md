# API for scripts and agents

Everything the app does goes through an HTTP API under `/api`. A script or an agent uses it with a
bearer token instead of the PIN session. This page is meant to be enough for an agent to use it.

The live reference, generated from the contract (OpenAPI, shown with Scalar), is at **`/api/docs`**:
it lists the same endpoints and holds no data.

## Set it up

1. `pnpm hash-api-token` prints a token (`cp_…`) and its SHA-256 digest. The token is shown once:
   keep it in a password manager, never in the repo.
2. Put the **digest** in `API_TOKEN_HASH` (Vercel: Settings → Environment Variables, Production and
   Preview; locally `.env.local`). The server never holds the token itself.
3. Redeploy. Without `API_TOKEN_HASH` the API takes no token at all.

Running the script again makes a new token: set the new digest and the old token stops working.

## Talk to it

- **Base URL**: the app's own, `https://<your-app>/api`.
- **Authentication**: `Authorization: Bearer <token>` on every request.
- **Bodies**: JSON, with `content-type: application/json`.
- **Ids**: UUIDs, returned when something is created.

The vocabulary of the screen and of the API differ: what the screen calls a **line** is a
**section** in the API, and a **station** is an **item**.

| Method and path                | Body                          | Does                                               |
| ------------------------------ | ----------------------------- | -------------------------------------------------- |
| `GET /sections`                |                               | Lists the lines, in order                          |
| `POST /sections`               | `{ "title": "Courses" }`      | Creates a line, last. Answers `201` with it        |
| `PATCH /sections/:id`          | `{ "title": "Épicerie" }`     | Renames a line                                     |
| `DELETE /sections/:id`         |                               | Deletes a line **and all its stations**            |
| `PATCH /sections/:id/position` | `{ "position": 0 }`           | Moves a line to that place (from 0). Answers all   |
| `GET /items`                   |                               | Lists the stations of every line                   |
| `POST /sections/:id/items`     | `{ "content": "Lait" }`       | Adds a station to the end of a line. Answers `201` |
| `PATCH /items/:id`             | `{ "done": true }`            | Checks it, or edits `content`, or both             |
| `DELETE /items/:id`            |                               | Deletes a station                                  |
| `PATCH /items/:id/position`    | `{ "sectionId", "position" }` | Moves a station, within its line or to another one |

A title is 1 to 200 characters and a station's text 1 to 500, trimmed. A `position` is a whole number
from 0; past the end means last.

## Examples

```sh
curl https://<your-app>/api/sections -H "Authorization: Bearer $CHECKPOINT_TOKEN"

curl -X POST https://<your-app>/api/sections \
  -H "Authorization: Bearer $CHECKPOINT_TOKEN" -H "content-type: application/json" \
  -d '{"title":"Courses"}'

curl -X POST https://<your-app>/api/sections/<section-id>/items \
  -H "Authorization: Bearer $CHECKPOINT_TOKEN" -H "content-type: application/json" \
  -d '{"content":"Lait"}'
```

## Errors

| Status | Body                                | Means                                                   |
| ------ | ----------------------------------- | ------------------------------------------------------- |
| `401`  | `{"_tag":"SessionExpired"}`         | No token, or a wrong one                                |
| `404`  | `{"_tag":"SectionNotFound","id":…}` | That line does not exist (`ItemNotFound` for a station) |
| `400`  |                                     | The body is not valid (empty text, negative position…)  |

A token has the same reach as the PIN: read, create, rename, check, move and delete everything. Treat
it like the PIN, and never print it back in a log or a message.
