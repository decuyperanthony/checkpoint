import { asc, eq, max } from "drizzle-orm";
import { Effect, Layer, Option } from "effect";

import { Section, SectionId } from "@/contract/schemas/Section";
import { Db } from "@/server/infra/Db";
import { section } from "@/server/infra/db/schema";
import { decodeRows, deletedId, firstRow, makeQuery, updatedRow } from "@/server/infra/query";

import { SectionRepository } from "./SectionRepository";

const columns = { id: section.id, title: section.title, position: section.position };

export const SectionRepositoryDrizzle = Layer.effect(
  SectionRepository,
  Effect.gen(function* () {
    const query = makeQuery(yield* Db);

    return SectionRepository.of({
      list: query((db) => db.select(columns).from(section).orderBy(asc(section.position), asc(section.createdAt))).pipe(
        Effect.flatMap(decodeRows(Section)),
      ),
      exists: (id) =>
        query((db) => db.select({ id: section.id }).from(section).where(eq(section.id, id)).limit(1)).pipe(
          Effect.map((rows) => rows.length > 0),
        ),
      lastPosition: query((db) => db.select({ last: max(section.position) }).from(section)).pipe(
        Effect.map((rows) => Option.fromNullishOr(rows[0]?.last)),
      ),
      insert: (draft) =>
        query((db) => db.insert(section).values(draft).returning(columns)).pipe(
          Effect.flatMap(decodeRows(Section)),
          Effect.flatMap(firstRow),
        ),
      update: ({ id, changes }) =>
        query((db) => db.update(section).set(changes).where(eq(section.id, id)).returning(columns)).pipe(
          Effect.flatMap(updatedRow(Section)),
        ),
      delete: (id) =>
        query((db) => db.delete(section).where(eq(section.id, id)).returning({ id: section.id })).pipe(
          Effect.flatMap(deletedId(SectionId)),
        ),
    });
  }),
);
