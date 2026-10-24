import { Schema } from "effect";

import { SectionId } from "@/contract/schemas/Section";

export const ItemId = Schema.String.check(Schema.isUUID()).pipe(Schema.brand("ItemId"));
export type ItemId = typeof ItemId.Type;

export const ItemContent = Schema.Trim.check(Schema.isNonEmpty(), Schema.isMaxLength(500));

export const Item = Schema.Struct({
  id: ItemId,
  sectionId: SectionId,
  content: ItemContent,
  done: Schema.Boolean,
  position: Schema.Int,
});
export type Item = typeof Item.Type;

export const CreateItemPayload = Schema.Struct({ content: ItemContent });

// Partial update: edit the text, check or uncheck, or both — but at least one of them.
export const UpdateItemPayload = Schema.Struct({
  content: Schema.optionalKey(ItemContent),
  done: Schema.optionalKey(Schema.Boolean),
}).check(Schema.makeFilter((changes) => changes.content !== undefined || changes.done !== undefined));
export type UpdateItemPayload = typeof UpdateItemPayload.Type;
