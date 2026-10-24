import { Schema } from "effect";
import { HttpApi, HttpApiEndpoint, HttpApiGroup, HttpApiSchema } from "effect/http-api";

import { ItemNotFound } from "@/contract/errors/ItemNotFound";
import { SectionNotFound } from "@/contract/errors/SectionNotFound";
import { CreateItemPayload, Item, ItemId, UpdateItemPayload } from "@/contract/schemas/Item";
import { Section, SectionId, SectionTitlePayload } from "@/contract/schemas/Section";

const sectionParams = { id: SectionId };

export const SectionsGroup = HttpApiGroup.make("sections")
  .add(HttpApiEndpoint.get("list", "/", { success: Schema.Array(Section) }))
  .add(
    HttpApiEndpoint.post("create", "/", {
      payload: SectionTitlePayload,
      success: Section.pipe(HttpApiSchema.status(201)),
    }),
  )
  .add(
    HttpApiEndpoint.patch("rename", "/:id", {
      params: sectionParams,
      payload: SectionTitlePayload,
      success: Section,
      error: SectionNotFound,
    }),
  )
  .add(HttpApiEndpoint.delete("remove", "/:id", { params: sectionParams, error: SectionNotFound }))
  // Last: `prefix` only applies to the endpoints added before it.
  .prefix("/sections");

const itemParams = { id: ItemId };

export const ItemsGroup = HttpApiGroup.make("items")
  .add(HttpApiEndpoint.get("list", "/items", { success: Schema.Array(Item) }))
  .add(
    HttpApiEndpoint.post("create", "/sections/:id/items", {
      params: sectionParams,
      payload: CreateItemPayload,
      success: Item.pipe(HttpApiSchema.status(201)),
      error: SectionNotFound,
    }),
  )
  .add(
    HttpApiEndpoint.patch("update", "/items/:id", {
      params: itemParams,
      payload: UpdateItemPayload,
      success: Item,
      error: ItemNotFound,
    }),
  )
  .add(HttpApiEndpoint.delete("remove", "/items/:id", { params: itemParams, error: ItemNotFound }));

// Served by the Next.js catch-all route in `src/app/api/[[...path]]/route.ts`: the folder name
// and this prefix must stay the same.
export const Api = HttpApi.make("checkpoint").add(SectionsGroup).add(ItemsGroup).prefix("/api");
