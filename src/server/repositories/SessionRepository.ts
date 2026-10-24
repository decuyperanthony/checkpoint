import { Context, type Effect, type Option } from "effect";

// Only the token's hash is stored: a leaked table opens no session.
export type SessionDraft = { readonly tokenHash: string; readonly expiresAt: Date };

export class SessionRepository extends Context.Service<
  SessionRepository,
  {
    readonly insert: (draft: SessionDraft) => Effect.Effect<void>;
    // When the session ends, if one has this token hash.
    readonly findExpiry: (tokenHash: string) => Effect.Effect<Option.Option<Date>>;
    readonly delete: (tokenHash: string) => Effect.Effect<void>;
  }
>()("checkpoint/SessionRepository") {}
