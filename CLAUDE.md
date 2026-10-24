# checkpoint

Single-page checklist (sections of checkable items) behind a PIN. Next.js App Router + Effect 4 on the server, Neon Postgres via Drizzle.

## Commands

`pnpm dev` · `pnpm typecheck` · `pnpm lint` · `pnpm format` · `pnpm test` — all four checks must pass before a PR.

## Rules specific to this repo

- **Effect Schema is the only schema library.** No Zod. API contract, errors, config and forms all use it. Types are derived from schemas, never rewritten.
- Effect 4: `HttpApi` comes from `effect/http-api`, not `@effect/platform` (v3 only). Follow the official docs.
- No `Record<…>` (lint): use literal-key unions with mapped types, or schema-derived types.
- Environment variables are read only through `Config` in `src/server/infra/`.
- shadcn atoms live in `src/shared/ui/primitives` and are imported only inside `src/shared/ui`.
- Styling uses design tokens only: no raw colours (`bg-white`, `text-black`, palette shades), no arbitrary values.
- Every user-facing string goes through i18n messages. Light and dark themes are both supported.
- Boundaries (enforced by `oxlint.config.ts`): feature ↛ feature, service ↛ Drizzle, no Effect in UI components, no `../` imports in features and services. Repo-specific rules live in `lint/checkpoint-plugin.ts`.
- Tests cover behaviour only (services on in-memory Layers, screens by role and text). No snapshots.

## PR workflow

Stacked PRs, each branched from the previous one, ~400 lines max excluding lockfile and generated files. Fill in `.github/pull_request_template.md`.
