import { Context, type Effect, type Option } from "effect";

import type { Item, ItemId, UpdateItemPayload } from "@/contract/schemas/Item";
import type { SectionId } from "@/contract/schemas/Section";

export type ItemDraft = Pick<Item, "sectionId" | "content" | "position">;

export type ItemUpdate = { readonly id: ItemId; readonly changes: UpdateItemPayload };

export class ItemRepository extends Context.Service<
  ItemRepository,
  {
    readonly list: Effect.Effect<ReadonlyArray<Item>>;
    readonly lastPosition: (sectionId: SectionId) => Effect.Effect<Option.Option<number>>;
    readonly insert: (draft: ItemDraft) => Effect.Effect<Item>;
    readonly update: (input: ItemUpdate) => Effect.Effect<Option.Option<Item>>;
    readonly delete: (id: ItemId) => Effect.Effect<Option.Option<ItemId>>;
  }
>()("checkpoint/ItemRepository") {}
