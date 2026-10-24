import { Context, Effect, Layer, Option } from "effect";

import { ItemNotFound } from "@/contract/errors/ItemNotFound";
import { SectionNotFound } from "@/contract/errors/SectionNotFound";
import type { Item, ItemId, UpdateItemPayload } from "@/contract/schemas/Item";
import { ItemRepository } from "@/server/repositories/ItemRepository";
import { SectionRepository } from "@/server/repositories/SectionRepository";

const notFound = (id: ItemId) => Effect.fromOption(() => new ItemNotFound({ id }));

const make = Effect.gen(function* () {
  const items = yield* ItemRepository;
  const sections = yield* SectionRepository;

  return {
    list: items.list,

    // New items go last in their section.
    create: ({ sectionId, content }: Pick<Item, "sectionId" | "content">) =>
      Effect.gen(function* () {
        if (!(yield* sections.exists(sectionId))) {
          return yield* new SectionNotFound({ id: sectionId });
        }
        const last = yield* items.lastPosition(sectionId);
        const position = Option.match(last, { onNone: () => 0, onSome: (value) => value + 1 });
        return yield* items.insert({ sectionId, content, position });
      }),

    update: ({ id, changes }: { readonly id: ItemId; readonly changes: UpdateItemPayload }) =>
      items.update({ id, changes }).pipe(Effect.flatMap(notFound(id))),

    remove: (id: ItemId) => items.delete(id).pipe(Effect.flatMap(notFound(id)), Effect.asVoid),
  };
});

export class ItemService extends Context.Service<ItemService, Effect.Success<typeof make>>()(
  "checkpoint/ItemService",
) {}

export const ItemServiceLive = Layer.effect(ItemService, make);
