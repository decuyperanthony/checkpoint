import { Schema } from "effect";

import { ItemId } from "@/contract/schemas/Item";

export class ItemNotFound extends Schema.TaggedError<ItemNotFound>()(
  "ItemNotFound",
  { id: ItemId },
  { httpApiStatus: 404 },
) {}
