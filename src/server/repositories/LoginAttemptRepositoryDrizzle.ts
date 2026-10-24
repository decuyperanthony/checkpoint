import { and, eq, gt } from "drizzle-orm";
import { Effect, Layer } from "effect";

import { Db } from "@/server/infra/Db";
import { loginAttempt } from "@/server/infra/db/schema";
import { makeQuery } from "@/server/infra/query";

import { LoginAttemptRepository } from "./LoginAttemptRepository";

export const LoginAttemptRepositoryDrizzle = Layer.effect(
  LoginAttemptRepository,
  Effect.gen(function* () {
    const query = makeQuery(yield* Db);

    return LoginAttemptRepository.of({
      insert: (attempt) => query((db) => db.insert(loginAttempt).values(attempt)).pipe(Effect.asVoid),
      // Served by the (ip, attempted_at) index.
      failuresAfter: ({ ip, after }) =>
        query((db) =>
          db
            .select({ attemptedAt: loginAttempt.attemptedAt })
            .from(loginAttempt)
            .where(and(eq(loginAttempt.ip, ip), eq(loginAttempt.success, false), gt(loginAttempt.attemptedAt, after))),
        ).pipe(Effect.map((rows) => rows.map((row) => row.attemptedAt))),
    });
  }),
);
