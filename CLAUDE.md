# checkpoint

Single-page checklist (sections of checkable items) behind a PIN. Next.js App Router + Effect 4 on the server, Neon Postgres via Drizzle.

**Read [docs/best-practices.md](docs/best-practices.md) before writing code**: it holds the conventions, the reasons and an example file for each. This file only lists what is easy to get wrong.

## Commands

`pnpm dev` · `pnpm typecheck` · `pnpm lint` · `pnpm format` · `pnpm format:check` · `pnpm test` · `pnpm build`

All four checks (typecheck, lint, format:check, test) pass on **every commit** of a PR. Judge them by exit code, never by grepping their output: oxlint error lines carry no marker you can rely on.

## Easy to get wrong

- **Effect Schema only, no Zod.** Types are derived from schemas, never rewritten.
- **Effect 4**: `HttpApi` from `effect/http-api`, `HttpRouter` from `effect/http`. `@effect/platform` and `@effect/sql-drizzle` are Effect 3 only. Check APIs in `node_modules/effect/dist/**/*.d.ts`, not from memory.
- **No `any`, `as` (except `as const`), `!`, `@ts-ignore`, `Record<…>`, `interface`, `function`.** Lint fails on each.
- **No `readonly` on front-end types**; contract and server types keep it.
- **No `useEffect`** to sync state or move focus, **no render props**: see the React section of the best practices.
- **Forms go through `createForm`** (`@/shared/form`); React Hook Form is imported nowhere else (lint).
- **Design tokens only**, variants with cva typed by `tokens.ts`. One folder per component with `index.ts`, and a test when it has behaviour.
- **Every user-facing string in `src/shared/i18n/messages/fr.json`.** Both themes must work.
- **Environment variables only through `Config`** in `src/server/infra/`. Never print `DATABASE_URL` or any secret; never commit `.env*`.
- **Tests cover behaviour**: services on in-memory Layers, screens on `fakeApi` by role and name. Never test a library. A new test must fail without the code it covers.

## PR workflow

Stacked PRs, each branched from the previous one, ~400 lines max excluding lockfile and generated files. Conventional commits in English. Fill in `.github/pull_request_template.md`. The owner squash-merges and may rebase the stack: `git fetch` and compare with `origin/<branch>` before touching a branch.
