import { randomUUID } from "node:crypto";

import { Array, Effect, Layer, Option, Order, Ref, Schema } from "effect";

import { ItemId, type Item } from "@/contract/schemas/Item";

import { ItemRepository } from "./ItemRepository";
import { MemoryStore } from "./MemoryStore";

const byPosition = Order.mapInput(Order.Number, (item: Item) => item.position);

// In-memory implementation for tests: same contract as the Drizzle one, no database.
export const ItemRepositoryMemory = Layer.effect(
  ItemRepository,
  Effect.gen(function* () {
    const store = yield* MemoryStore;
    const items = Ref.get(store).pipe(Effect.map((tables) => tables.items));

    return ItemRepository.of({
      list: items.pipe(Effect.map((all) => all.toSorted(byPosition))),
      lastPosition: (sectionId) =>
        items.pipe(
          Effect.map((all) =>
            Array.match(
              all.filter((item) => item.sectionId === sectionId),
              {
                onEmpty: Option.none,
                onNonEmpty: (some) => Option.some(Math.max(...some.map((item) => item.position))),
              },
            ),
          ),
        ),
      insert: (draft) =>
        Effect.gen(function* () {
          const created: Item = { ...draft, done: false, id: Schema.decodeSync(ItemId)(randomUUID()) };
          yield* Ref.update(store, (tables) => ({ ...tables, items: [...tables.items, created] }));
          return created;
        }),
      update: ({ id, changes }) =>
        Ref.modify(store, (tables) => {
          const updated = tables.items.map((item) => (item.id === id ? { ...item, ...changes } : item));
          return [Array.findFirst(updated, (item) => item.id === id), { ...tables, items: updated }];
        }),
      delete: (id) =>
        Ref.modify(store, (tables) => [
          Array.findFirst(tables.items, (item) => item.id === id).pipe(Option.map((item) => item.id)),
          { ...tables, items: tables.items.filter((item) => item.id !== id) },
        ]),
    });
  }),
);
