# checkpoint

A single-page checklist: titled sections containing checkable items, behind a PIN code. Built as a reference codebase for [Effect](https://effect.website) on a Next.js server.

## Stack

- **Next.js** (App Router, TypeScript strict), deployed on Vercel
- **Effect 4** on the server: `HttpApi`, `Schema`, `Config`, services and Layers
- **Neon Postgres** through **Drizzle**
- **Tailwind CSS + shadcn/ui**, **TanStack Query**, **React Hook Form** behind a small form kit, **next-intl**
- **oxlint + oxfmt**, **Vitest**

## Architecture

```
src/
  app/            Next routes only: compose screens, no logic
  contract/       Shared by front and back: schemas, errors, HttpApi definition
  server/
    services/     Business logic, on repository interfaces only
    repositories/ Storage, provided by Layers (Drizzle, or in-memory in tests)
    infra/        Config, database, query helpers
    security/     PIN verification (interface + argon2 Layer)
    handlers/     HttpApi implementation
  features/       sections, items: api/ (query hooks) and ui/
  shared/
    ui/           Design system; shadcn atoms in ui/primitives are private to it
    form/         createForm, the form kit typed by its schema
    lib/          API client, query helpers, small hooks
    i18n/         Messages (French) and next-intl setup
    testing/      Render helpers and fixtures for UI tests
```

Boundaries are enforced by the linter (`oxlint.config.ts`): a feature never imports another feature, services never touch the database directly, and UI components never use Effect.

**How the code is written, and why: [docs/best-practices.md](docs/best-practices.md).**

## Getting started

Requirements: Node 24+, pnpm.

```sh
pnpm install
pnpm dev
```

Environment, in `.env.local` (never committed) and on Vercel:

| Variable       | Value                                                |
| -------------- | ---------------------------------------------------- |
| `DATABASE_URL` | Neon pooled connection string                        |
| `PIN_HASH`     | argon2id hash of the PIN, printed by `pnpm hash-pin` |

## Scripts

| Script              | Purpose                   |
| ------------------- | ------------------------- |
| `pnpm dev`          | Start the dev server      |
| `pnpm build`        | Production build          |
| `pnpm typecheck`    | TypeScript                |
| `pnpm lint`         | oxlint                    |
| `pnpm format`       | Format with oxfmt         |
| `pnpm format:check` | Check formatting          |
| `pnpm test`         | Vitest                    |
| `pnpm hash-pin`     | Hash a PIN for `PIN_HASH` |

## License

[MIT](LICENSE)
