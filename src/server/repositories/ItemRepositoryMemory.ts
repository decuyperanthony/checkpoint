import { Effect, Layer, Ref } from "effect";

import { ItemId } from "@/contract/schemas/Item";

import { ItemRepository } from "./ItemRepository";
import { lastPosition, newId, removeById, sortByPosition, updateById } from "./memory";
import { MemoryStore } from "./MemoryStore";

// In-memory implementation for tests: same contract as the Drizzle one, no database.
export const ItemRepositoryMemory = Layer.effect(
  ItemRepository,
  Effect.gen(function* () {
    const store = yield* MemoryStore;
    const items = Ref.get(store).pipe(Effect.map((tables) => tables.items));

    return ItemRepository.of({
      list: items.pipe(Effect.map(sortByPosition)),
      lastPosition: (sectionId) =>
        items.pipe(Effect.map((all) => lastPosition(all.filter((item) => item.sectionId === sectionId)))),
      insert: (draft) =>
        Effect.gen(function* () {
          const created = { ...draft, done: false, id: newId(ItemId) };
          yield* Ref.update(store, (tables) => ({ ...tables, items: [...tables.items, created] }));
          return created;
        }),
      update: ({ id, changes }) =>
        Ref.modify(store, (tables) => {
          const [updated, rows] = updateById(tables.items, id, (item) => ({ ...item, ...changes }));
          return [updated, { ...tables, items: rows }];
        }),
      delete: (id) =>
        Ref.modify(store, (tables) => {
          const [deleted, rows] = removeById(tables.items, id);
          return [deleted, { ...tables, items: rows }];
        }),
    });
  }),
);
