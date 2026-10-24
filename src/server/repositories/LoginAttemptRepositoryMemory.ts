import { Effect, Layer, Ref } from "effect";

import { LoginAttemptRepository } from "./LoginAttemptRepository";
import { MemoryStore } from "./MemoryStore";

// In-memory implementation for tests: same contract as the Drizzle one, no database.
export const LoginAttemptRepositoryMemory = Layer.effect(
  LoginAttemptRepository,
  Effect.gen(function* () {
    const store = yield* MemoryStore;

    return LoginAttemptRepository.of({
      insert: (attempt) =>
        Ref.update(store, (tables) => ({ ...tables, loginAttempts: [...tables.loginAttempts, attempt] })),
      failuresAfter: ({ ip, after }) =>
        Ref.get(store).pipe(
          Effect.map((tables) =>
            tables.loginAttempts
              .filter((attempt) => attempt.ip === ip && !attempt.success && attempt.attemptedAt > after)
              .map((attempt) => attempt.attemptedAt),
          ),
        ),
    });
  }),
);
