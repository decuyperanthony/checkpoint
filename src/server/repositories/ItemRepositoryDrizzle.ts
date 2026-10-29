import { asc, eq, max } from "drizzle-orm";
import { Effect, Layer, Option } from "effect";

import { Item, ItemId } from "@/contract/schemas/Item";
import { Db } from "@/server/infra/Db";
import { item } from "@/server/infra/db/schema";
import { decodeRows, deletedId, firstRow, makeQuery, updatedRow } from "@/server/infra/query";

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
          Effect.flatMap(updatedRow(Item)),
        ),
      arrange: ({ sectionId, ids }) =>
        query((db) =>
          db.transaction(async (tx) => {
            for (const [position, id] of ids.entries()) {
              await tx.update(item).set({ sectionId, position }).where(eq(item.id, id));
            }
          }),
        ),
      delete: (id) =>
        query((db) => db.delete(item).where(eq(item.id, id)).returning({ id: item.id })).pipe(
          Effect.flatMap(deletedId(ItemId)),
        ),
    });
  }),
);
