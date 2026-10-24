import { Context, type Effect } from "effect";

export type LoginAttempt = { readonly ip: string; readonly success: boolean; readonly attemptedAt: Date };

export class LoginAttemptRepository extends Context.Service<
  LoginAttemptRepository,
  {
    readonly insert: (attempt: LoginAttempt) => Effect.Effect<void>;
    // When each failed attempt from this address happened, strictly after the given date.
    readonly failuresAfter: (input: {
      readonly ip: string;
      readonly after: Date;
    }) => Effect.Effect<ReadonlyArray<Date>>;
  }
>()("checkpoint/LoginAttemptRepository") {}
