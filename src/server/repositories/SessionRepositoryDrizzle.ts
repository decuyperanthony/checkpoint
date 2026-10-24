import { eq } from "drizzle-orm";
import { Array, Effect, Layer, Option } from "effect";

import { Db } from "@/server/infra/Db";
import { session } from "@/server/infra/db/schema";
import { makeQuery } from "@/server/infra/query";

import { SessionRepository } from "./SessionRepository";

export const SessionRepositoryDrizzle = Layer.effect(
  SessionRepository,
  Effect.gen(function* () {
    const query = makeQuery(yield* Db);

    return SessionRepository.of({
      insert: (draft) => query((db) => db.insert(session).values(draft)).pipe(Effect.asVoid),
      findExpiry: (tokenHash) =>
        query((db) =>
          db.select({ expiresAt: session.expiresAt }).from(session).where(eq(session.tokenHash, tokenHash)).limit(1),
        ).pipe(Effect.map((rows) => Array.head(rows).pipe(Option.map((row) => row.expiresAt)))),
      delete: (tokenHash) =>
        query((db) => db.delete(session).where(eq(session.tokenHash, tokenHash))).pipe(Effect.asVoid),
    });
  }),
);
