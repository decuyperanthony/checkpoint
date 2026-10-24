import { Array, Effect, Layer, Option, Ref } from "effect";

import { MemoryStore } from "./MemoryStore";
import { SessionRepository } from "./SessionRepository";

// In-memory implementation for tests: same contract as the Drizzle one, no database.
export const SessionRepositoryMemory = Layer.effect(
  SessionRepository,
  Effect.gen(function* () {
    const store = yield* MemoryStore;

    return SessionRepository.of({
      insert: (draft) => Ref.update(store, (tables) => ({ ...tables, sessions: [...tables.sessions, draft] })),
      findExpiry: (tokenHash) =>
        Ref.get(store).pipe(
          Effect.map((tables) =>
            Array.findFirst(tables.sessions, (session) => session.tokenHash === tokenHash).pipe(
              Option.map((session) => session.expiresAt),
            ),
          ),
        ),
      delete: (tokenHash) =>
        Ref.update(store, (tables) => ({
          ...tables,
          sessions: tables.sessions.filter((session) => session.tokenHash !== tokenHash),
        })),
    });
  }),
);
