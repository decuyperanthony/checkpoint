import { asc, eq, max } from "drizzle-orm";
import { Array, Effect, Layer, Option, Schema } from "effect";

import { Item, ItemId } from "@/contract/schemas/Item";
import { Db } from "@/server/infra/Db";
import { item } from "@/server/infra/db/schema";
import { decodeRows, firstRow, makeQuery } from "@/server/infra/query";

import { ItemRepository } from "./ItemRepository";

const columns = {
  id: item.id,
  sectionId: item.sectionId,
  content: item.content,
  done: item.done,
  position: item.position,
};

export const ItemRepositoryDrizzle = Layer.effect(
  ItemRepository,
  Effect.gen(function* () {
    const query = makeQuery(yield* Db);

    return ItemRepository.of({
      list: query((db) => db.select(columns).from(item).orderBy(asc(item.position), asc(item.createdAt))).pipe(
        Effect.flatMap(decodeRows(Item)),
      ),
      lastPosition: (sectionId) =>
        query((db) =>
          db
            .select({ last: max(item.position) })
            .from(item)
            .where(eq(item.sectionId, sectionId)),
        ).pipe(Effect.map((rows) => Option.fromNullishOr(rows[0]?.last))),
      insert: (draft) =>
        query((db) => db.insert(item).values(draft).returning(columns)).pipe(
          Effect.flatMap(decodeRows(Item)),
          Effect.flatMap(firstRow),
        ),
      update: ({ id, changes }) =>
        query((db) => db.update(item).set(changes).where(eq(item.id, id)).returning(columns)).pipe(
          Effect.flatMap(decodeRows(Item)),
          Effect.map(Array.head),
        ),
      delete: (id) =>
        query((db) => db.delete(item).where(eq(item.id, id)).returning({ id: item.id })).pipe(
          Effect.flatMap(decodeRows(Schema.Struct({ id: ItemId }))),
          Effect.map((rows) => Array.head(rows).pipe(Option.map((row) => row.id))),
        ),
    });
  }),
);
