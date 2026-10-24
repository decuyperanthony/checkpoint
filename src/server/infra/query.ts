import { Array, Data, Effect, Schema } from "effect";

import type { Db } from "./Db";

class DatabaseError extends Data.TaggedError("DatabaseError")<{ readonly cause: unknown }> {}

type Database = typeof Db.Service;

// A failing query is not something a caller can handle: it becomes a defect, logged with its
// cause and answered with a generic 500, never with the database message.
export const makeQuery =
  (db: Database) =>
  <A>(run: (database: Database) => Promise<A>) =>
    Effect.tryPromise({ try: () => run(db), catch: (cause) => new DatabaseError({ cause }) }).pipe(Effect.orDie);

// Rows are decoded rather than cast: a row that no longer matches the contract is a defect.
export const decodeRows =
  <S extends Schema.Top>(schema: S) =>
  (rows: ReadonlyArray<unknown>) =>
    Schema.decodeUnknownEffect(Schema.Array(schema))(rows).pipe(Effect.orDie);

export const firstRow = <A>(rows: ReadonlyArray<A>) => Effect.fromOption(Array.head(rows)).pipe(Effect.orDie);
