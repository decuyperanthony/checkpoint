import { Context, Effect, Layer } from "effect";

import { ItemNotFound } from "@/contract/errors/ItemNotFound";
import { SectionNotFound } from "@/contract/errors/SectionNotFound";
import type { Item, ItemId } from "@/contract/schemas/Item";
import { ItemRepository, type ItemUpdate } from "@/server/repositories/ItemRepository";
import { SectionRepository } from "@/server/repositories/SectionRepository";
import { nextPosition } from "@/server/services/positions";

const notFound = (id: ItemId) => Effect.fromOption(() => new ItemNotFound({ id }));

const make = Effect.gen(function* () {
  const items = yield* ItemRepository;
  const sections = yield* SectionRepository;

  return {
    list: items.list,

    create: ({ sectionId, content }: Pick<Item, "sectionId" | "content">) =>
      Effect.gen(function* () {
        if (!(yield* sections.exists(sectionId))) {
          return yield* new SectionNotFound({ id: sectionId });
        }
        const position = nextPosition(yield* items.lastPosition(sectionId));
        return yield* items.insert({ sectionId, content, position });
      }),

    update: ({ id, changes }: ItemUpdate) => items.update({ id, changes }).pipe(Effect.flatMap(notFound(id))),

    remove: (id: ItemId) => items.delete(id).pipe(Effect.flatMap(notFound(id)), Effect.asVoid),
  };
});

export class ItemService extends Context.Service<ItemService, Effect.Success<typeof make>>()(
  "checkpoint/ItemService",
) {}

export const ItemServiceLive = Layer.effect(ItemService, make);
