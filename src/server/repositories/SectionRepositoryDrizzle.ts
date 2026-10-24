import { asc, eq, max } from "drizzle-orm";
import { Array, Effect, Layer, Option, Schema } from "effect";

import { Section, SectionId } from "@/contract/schemas/Section";
import { Db } from "@/server/infra/Db";
import { section } from "@/server/infra/db/schema";
import { makeQuery } from "@/server/infra/query";

import { SectionRepository } from "./SectionRepository";

const columns = { id: section.id, title: section.title, position: section.position };

// Rows are decoded rather than cast: a row that no longer matches the contract is a defect.
const decodeRows =
  <S extends Schema.Top>(schema: S) =>
  (rows: ReadonlyArray<unknown>) =>
    Schema.decodeUnknownEffect(Schema.Array(schema))(rows).pipe(Effect.orDie);

const firstRow = <A>(rows: ReadonlyArray<A>) => Effect.fromOption(Array.head(rows)).pipe(Effect.orDie);

export const SectionRepositoryDrizzle = Layer.effect(
  SectionRepository,
  Effect.gen(function* () {
    const query = makeQuery(yield* Db);

    return SectionRepository.of({
      list: query((db) => db.select(columns).from(section).orderBy(asc(section.position), asc(section.createdAt))).pipe(
        Effect.flatMap(decodeRows(Section)),
      ),
      lastPosition: query((db) => db.select({ last: max(section.position) }).from(section)).pipe(
        Effect.map((rows) => Option.fromNullishOr(rows[0]?.last)),
      ),
      insert: (draft) =>
        query((db) => db.insert(section).values(draft).returning(columns)).pipe(
          Effect.flatMap(decodeRows(Section)),
          Effect.flatMap(firstRow),
        ),
      updateTitle: ({ id, title }) =>
        query((db) => db.update(section).set({ title }).where(eq(section.id, id)).returning(columns)).pipe(
          Effect.flatMap(decodeRows(Section)),
          Effect.map(Array.head),
        ),
      delete: (id) =>
        query((db) => db.delete(section).where(eq(section.id, id)).returning({ id: section.id })).pipe(
          Effect.flatMap(decodeRows(Schema.Struct({ id: SectionId }))),
          Effect.map((rows) => Array.head(rows).pipe(Option.map((row) => row.id))),
        ),
    });
  }),
);
