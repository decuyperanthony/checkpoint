# Best practices

How this codebase is written, and why. Each rule points to a file that shows it. Most of them are
enforced: by TypeScript, by the linter (`oxlint.config.ts`, `lint/checkpoint-plugin.ts`) or by a test.
What is enforced says so.

## Architecture

```
src/
  app/           Next routes only: compose screens, no logic
  contract/      Shared by front and back: schemas, errors, the HttpApi definition
  server/
    services/      Business logic, on repository interfaces only
    repositories/  Storage: one interface, a Drizzle Layer and an in-memory Layer
    infra/         Config, database, query helpers
    security/      PIN verification: an interface and its argon2 Layer
    handlers/      HttpApi implementation: maps endpoints to services, nothing else
  features/      One folder per domain (sections, items): api/ (query hooks) and ui/
  shared/
    ui/            Design system; shadcn atoms in ui/primitives are private to it
    form/          The form kit
    lib/           API client, query helpers, small hooks
    i18n/          Messages and next-intl setup
    testing/       Render helpers and fixtures for UI tests
```

Boundaries, enforced by the linter:

- A feature never imports another feature. Screens in `src/app` compose them.
- Services never import the database, only repository interfaces.
- UI code never imports Effect: it talks to the server through the typed client in `src/shared/lib/api.ts`.
- shadcn atoms (`shared/ui/primitives`) are imported only inside `shared/ui`.
- React Hook Form is imported only inside `shared/form`.
- No `../` imports in features and services: `@/` paths say where a module lives.

**Why:** each folder can be read, changed and tested on its own, and a wrong dependency fails
the build instead of a review.

## TypeScript

Enforced by the linter or the compiler:

- Strict mode with `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`.
- No `any`, no `as` (except `as const`), no `!`, no `@ts-ignore` / `@ts-expect-error`.
- No `Record<…>`: a union of literal keys with a mapped type, or a type derived from a schema.
- `type`, never `interface` (except module augmentation, which requires one).
- Arrow functions only (`checkpoint/arrow-functions`).

By convention:

- Types are derived, never written twice: `typeof Section.Type`, `ComponentProps<typeof X>`.
- Type guards instead of casts: see `hasMaxLength` in [`fieldFacts.ts`](../src/shared/form/fieldFacts.ts).
- No `readonly` on front-end types: props are never mutated in place, the modifier is noise. Contract
  and server types keep it, as Effect does.

## The contract

[`src/contract`](../src/contract) is the single source of truth between front and back.

- **One schema per value**, Effect Schema only (no Zod). Types, validation, HTTP decoding and form
  rules all come from it: [`Section.ts`](../src/contract/schemas/Section.ts).
- **The API is declared once** with `HttpApi`; paths go through `HttpApiGroup.prefix`, never repeated
  as strings: [`api.ts`](../src/contract/api.ts).
- **Errors are schemas too** (`Schema.TaggedError` with an HTTP status). `ContractError` lists them
  all, and a compile-time check fails if an endpoint declares one that is missing:
  [`ContractError.ts`](../src/contract/errors/ContractError.ts). The front maps each `_tag` to a message,
  and that map fails to compile until a new error has one: [`errorMessage.ts`](../src/shared/lib/errorMessage.ts).

## Server (Effect 4)

- **Services** are `Context.Service` with a `make` effect and a `static readonly layer`. The shape is
  inferred, not written again: [`SectionService.ts`](../src/server/services/SectionService.ts).
- **One span per operation**: `Effect.fn("SectionService.rename")`, or `Effect.withSpan` for values.
  Traces and error stack traces name the operation.
- **Domain verbs above, storage verbs below**: services and handlers `create` / `rename` / `remove`;
  repositories `insert` / `update` / `delete`.
- **A Layer is named after what it provides** (`SectionRepositoryDrizzle`, `RepositoriesMemory`), with
  no `Live` suffix.
- **Handlers only map** an endpoint to a service call: [`handlers/sections.ts`](../src/server/handlers/sections.ts).
- **Configuration is read only through `Config`** in [`server/infra/Config.ts`](../src/server/infra/Config.ts),
  never from `process.env` elsewhere. Secrets live in `.env.local` and are never committed or logged.
- Effect 4 imports: `effect/http-api` and `effect/http`, not `@effect/platform` (Effect 3 only).

## Security

- **One login, everything else behind a middleware**: `Authorization` (`HttpApiMiddleware` with a
  cookie security scheme) is attached to every group but `auth`, in the contract, so a new endpoint
  is protected by default: [`Authorization.ts`](../src/contract/Authorization.ts).
- **The session cookie is `__Host-`, `httpOnly`, `Secure`, `SameSite=Lax`**: scripts cannot read it,
  it never leaves HTTPS or crosses sites on a POST.
- **Secrets never sit in clear**: the PIN as an argon2id hash in `PIN_HASH`, session tokens as their
  sha256 in the database, both as `Redacted` in memory so they cannot reach a log.
- **Attempts are limited per address** over a sliding window, checked before the PIN, and refused
  attempts are not recorded: [`AuthService.ts`](../src/server/services/AuthService.ts).
- **Errors say no more than needed**: an unknown and an expired session are the same `SessionExpired`;
  a server failure is an empty 500, its cause only in the logs.

## React

- **Real components, no render props.** A slot is a `ReactNode` or a compound component
  (`ActionsMenu.Item`, `Form.TextField`), never a function that returns JSX.
- **No `useEffect` to sync state.** Focus is moved where it is caused: a ref callback for a field that
  opens focused ([`TextField`](../src/shared/ui/TextField/TextField.tsx)), `flushSync` then `focus()`
  when an editor closes ([`useInlineEdit`](../src/shared/lib/useInlineEdit.ts)).
- **Focus never gets lost.** Closing an editor, a menu or a dialog gives focus back to the button that
  opened it; a modal opened from a menu is told where to return (`returnFocusTo`).
- **Optimistic where the user expects instant feedback**: `useOptimistic` in a transition that lasts
  until the change is saved and refetched, so failure rolls back on its own:
  [`useCheckItem`](../src/features/items/api/items.ts).
- **Data**: `useSuspenseQuery` under a boundary, prefetch what a screen will need
  (`usePrefetchItems`), mutations invalidate the queries they change. Mutation errors reach the user
  in one place, the mutation cache: [`QueryProvider`](../src/shared/ui/QueryProvider/QueryProvider.tsx).
- **Hooks are named after what they do for the screen** (`useCheckItem`, `useInlineEdit`), and a
  component reads like markup.

## Forms

One kit, [`createForm(schema)`](../src/shared/form/createForm.tsx), declared next to the component that
uses it:

```tsx
const SectionForm = createForm(SectionTitlePayload);

const form = SectionForm.useForm({ defaultValues: { title: "" } });

<SectionForm form={form} onSubmit={({ title }) => create.mutate(title)}>
  <SectionForm.TextField name="title" label={t("sections.newTitle")} />
</SectionForm>;
```

- Field names come from the schema: a typo does not compile.
- `onSubmit` receives the decoded values (trimmed, branded), never the raw input.
- `required` and `maxLength` are read from the schema's checks, not written again.
- **Errors are worded after the check that failed**, through Effect's own hook
  ([`useSchemaResolver`](../src/shared/form/useSchemaResolver.ts)): one message per kind of check
  (`form.errors.isMaxLength`), none per field. A new field needs nothing; a new kind of check needs
  one line of copy.

## Design system

[`src/shared/ui`](../src/shared/ui):

- **One folder per component**: `X/X.tsx`, `X/X.test.tsx` when it has behaviour, `X/index.ts`.
- **Variants with cva**, typed against the token scales in [`tokens.ts`](../src/shared/ui/tokens.ts)
  (`satisfies TokenClasses<Size>`): a size that is not a token does not compile.
- **Design tokens only** (enforced by `checkpoint/design-tokens`): no raw colours, palette shades or
  arbitrary values. Light and dark themes come for free.
- **No raw text elements in features**: `Text`, `Stack`, `Title`, `Line`… carry the styles and the
  semantics (`as`, roles).

## i18n

Every user-facing string goes through next-intl messages ([`fr.json`](../src/shared/i18n/messages/fr.json));
literals in JSX fail the linter outside tests. Accessible names include what they act on
("Actions de la section Courses"), so two rows never share a name.

## Tests

- **Behaviour only**: what a user or a caller sees. No snapshots, no implementation details.
- **Services** run on in-memory Layers: [`SectionService.test.ts`](../src/server/services/SectionService.test.ts).
- **Screens** run against the real API handlers on an in-memory store, called as `fetch`
  ([`fakeApi.ts`](../src/server/testing/fakeApi.ts)), and are queried by role and accessible name:
  [`Board.test.tsx`](../src/app/Board.test.tsx).
- **Never test a library** (React, Radix, React Hook Form): test our code around it.
- **A test must fail without the code it covers**: remove the line, watch it go red, put it back.

## Workflow

- `pnpm typecheck`, `pnpm lint`, `pnpm format:check` and `pnpm test` pass on **every commit**, checked
  by exit code.
- Stacked PRs of about 400 lines (lockfile and generated files aside), one subject each, described
  with the PR template: scope, what to review first, choices and rejected alternatives.
- Conventional commits, in English.
