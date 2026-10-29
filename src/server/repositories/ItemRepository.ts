import { Context, type Effect, type Option } from "effect";

import type { Item, ItemId, UpdateItemPayload } from "@/contract/schemas/Item";
import type { SectionId } from "@/contract/schemas/Section";

export type ItemDraft = Pick<Item, "sectionId" | "content" | "position">;

// Puts the items of `ids` in that section, in that order.
export type ItemArrangement = { readonly sectionId: SectionId; readonly ids: ReadonlyArray<ItemId> };

export type ItemUpdate = { readonly id: ItemId; readonly changes: UpdateItemPayload };

export class ItemRepository extends Context.Service<
  ItemRepository,
  {
    readonly list: Effect.Effect<ReadonlyArray<Item>>;
    readonly lastPosition: (sectionId: SectionId) => Effect.Effect<Option.Option<number>>;
    readonly insert: (draft: ItemDraft) => Effect.Effect<Item>;
    readonly update: (input: ItemUpdate) => Effect.Effect<Option.Option<Item>>;
    // Moves and numbers the items after the order of `ids`, all or none.
    readonly arrange: (arrangement: ItemArrangement) => Effect.Effect<void>;
    readonly delete: (id: ItemId) => Effect.Effect<Option.Option<ItemId>>;
  }
>()("checkpoint/ItemRepository") {}
