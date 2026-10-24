import { Array, Data, Effect, Option, Schema } from "effect";

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

// For UPDATE … RETURNING: the updated row, or none when nothing matched.
export const updatedRow =
  <S extends Schema.Top>(schema: S) =>
  (rows: ReadonlyArray<unknown>) =>
    decodeRows(schema)(rows).pipe(Effect.map(Array.head));

// For DELETE … RETURNING id: the deleted id, or none when nothing matched.
export const deletedId =
  <A>(idSchema: Schema.Codec<A, string>) =>
  (rows: ReadonlyArray<unknown>) =>
    decodeRows(Schema.Struct({ id: idSchema }))(rows).pipe(
      Effect.map((decoded) => Array.head(decoded).pipe(Option.map((row) => row.id))),
    );
