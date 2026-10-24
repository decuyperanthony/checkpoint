import { Context, Effect, Layer } from "effect";

import { ItemNotFound } from "@/contract/errors/ItemNotFound";
import { SectionNotFound } from "@/contract/errors/SectionNotFound";
import type { Item, ItemId } from "@/contract/schemas/Item";
import { ItemRepository, type ItemUpdate } from "@/server/repositories/ItemRepository";
import { SectionRepository } from "@/server/repositories/SectionRepository";
import { nextPosition } from "@/server/services/positions";

const notFound = (id: ItemId) => Effect.fromOption(() => new ItemNotFound({ id }));

// Same shape as SectionService: `make` inferred, one span per operation.
export class ItemService extends Context.Service<ItemService>()("checkpoint/ItemService", {
  make: Effect.gen(function* () {
    const items = yield* ItemRepository;
    const sections = yield* SectionRepository;

    return {
      list: items.list.pipe(Effect.withSpan("ItemService.list")),

      create: Effect.fn("ItemService.create")(function* ({ sectionId, content }: Pick<Item, "sectionId" | "content">) {
        if (!(yield* sections.exists(sectionId))) {
          return yield* new SectionNotFound({ id: sectionId });
        }
        const position = nextPosition(yield* items.lastPosition(sectionId));
        return yield* items.insert({ sectionId, content, position });
      }),

      update: Effect.fn("ItemService.update")(function* ({ id, changes }: ItemUpdate) {
        return yield* items.update({ id, changes }).pipe(Effect.flatMap(notFound(id)));
      }),

      remove: Effect.fn("ItemService.remove")(function* (id: ItemId) {
        yield* items.delete(id).pipe(Effect.flatMap(notFound(id)));
      }),
    };
  }),
}) {
  static readonly layer = Layer.effect(this, this.make);
}
