import { Schema } from "effect";
import { HttpApi, HttpApiEndpoint, HttpApiGroup, HttpApiSchema } from "effect/http-api";

import { Authorization } from "@/contract/Authorization";
import { InvalidPin } from "@/contract/errors/InvalidPin";
import { ItemNotFound } from "@/contract/errors/ItemNotFound";
import { SectionNotFound } from "@/contract/errors/SectionNotFound";
import { TooManyAttempts } from "@/contract/errors/TooManyAttempts";
import { LoginPayload } from "@/contract/schemas/Auth";
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
  // Last: `prefix` and `middleware` only apply to the endpoints added before them.
  .prefix("/sections")
  .middleware(Authorization);

const itemParams = { id: ItemId };

export const ItemsGroup = HttpApiGroup.make("items")
  .add(HttpApiEndpoint.get("list", "/", { success: Schema.Array(Item) }))
  .add(
    HttpApiEndpoint.patch("update", "/:id", {
      params: itemParams,
      payload: UpdateItemPayload,
      success: Item,
      error: ItemNotFound,
    }),
  )
  .add(HttpApiEndpoint.delete("remove", "/:id", { params: itemParams, error: ItemNotFound }))
  // `prefix` only applies to the endpoints added before it: creation lives under its section.
  .prefix("/items")
  .add(
    HttpApiEndpoint.post("create", "/sections/:id/items", {
      params: sectionParams,
      payload: CreateItemPayload,
      success: Item.pipe(HttpApiSchema.status(201)),
      error: SectionNotFound,
    }),
  )
  .middleware(Authorization);

// The only group without Authorization: logging in is how a session starts, and logging out
// must work with an expired one.
export const AuthGroup = HttpApiGroup.make("auth")
  .add(HttpApiEndpoint.post("login", "/login", { payload: LoginPayload, error: [InvalidPin, TooManyAttempts] }))
  .add(HttpApiEndpoint.post("logout", "/logout"))
  .prefix("/auth");

// Served by the Next.js catch-all route in `src/app/api/[[...path]]/route.ts`: the folder name
// and this prefix must stay the same.
export const Api = HttpApi.make("checkpoint").add(SectionsGroup).add(ItemsGroup).add(AuthGroup).prefix("/api");
