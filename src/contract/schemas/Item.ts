import { Schema } from "effect";

import { Position } from "@/contract/schemas/Position";
import { SectionId } from "@/contract/schemas/Section";

export const ItemId = Schema.String.check(Schema.isUUID()).pipe(Schema.brand("ItemId"));
export type ItemId = typeof ItemId.Type;

const itemContentMaxLength = 500;

export const ItemContent = Schema.Trim.check(Schema.isNonEmpty(), Schema.isMaxLength(itemContentMaxLength));

export const Item = Schema.Struct({
  id: ItemId,
  sectionId: SectionId,
  content: ItemContent,
  done: Schema.Boolean,
  position: Schema.Int,
});
export type Item = typeof Item.Type;

export const CreateItemPayload = Schema.Struct({ content: ItemContent });
export type CreateItemPayload = typeof CreateItemPayload.Type;

// Partial update: edit the text, check or uncheck, or both. The union rules out `{}`, in the
// type as well as at runtime.
export const UpdateItemPayload = Schema.Union([
  Schema.Struct({ content: ItemContent, done: Schema.optionalKey(Schema.Boolean) }),
  Schema.Struct({ content: Schema.optionalKey(ItemContent), done: Schema.Boolean }),
]);
export type UpdateItemPayload = typeof UpdateItemPayload.Type;

// Moving an item says its section, which may be another one, and where it goes among that
// section's items.
export const MoveItemPayload = Schema.Struct({ sectionId: SectionId, position: Position });
export type MoveItemPayload = typeof MoveItemPayload.Type;
