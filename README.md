# checkpoint

A single-page checklist: titled sections containing checkable items, behind a PIN code. Built as a reference codebase for [Effect](https://effect.website) on a Next.js server.

## Stack

- **Next.js** (App Router, TypeScript strict), deployed on Vercel
- **Effect 4** on the server: `HttpApi`, `Schema`, `Config`, services and Layers
- **Neon Postgres** through **Drizzle**
- **Tailwind CSS + shadcn/ui**, **TanStack Query**, **React Hook Form**
- **oxlint + oxfmt**, **Vitest**

## Architecture

```
src/
  app/            Next routes only — thin, no logic
  contract/       Shared by front and back: schemas, errors, HttpApi definition
  server/
    services/     Business logic, depends on repository interfaces only
    repositories/ Database access, provided by Layers (Drizzle, or in-memory in tests)
    infra/        Config, database Layer, logger
    handlers/     HttpApi implementation
  features/       sections, items, auth — each with ui/, api/ (query hooks), model/
  shared/
    ui/           Design system; shadcn atoms in ui/primitives are private to it
    lib/          API client, query client, utilities
```

Boundaries are enforced by the linter (`oxlint.config.ts`): a feature never imports another feature, services never touch the database directly, and UI components never use Effect.

## Getting started

Requirements: Node 24+, pnpm.

```sh
pnpm install
pnpm dev
```

## Scripts

| Script              | Purpose              |
| ------------------- | -------------------- |
| `pnpm dev`          | Start the dev server |
| `pnpm build`        | Production build     |
| `pnpm typecheck`    | TypeScript           |
| `pnpm lint`         | oxlint               |
| `pnpm format`       | Format with oxfmt    |
| `pnpm format:check` | Check formatting     |
| `pnpm test`         | Vitest               |

## License

[MIT](LICENSE)
