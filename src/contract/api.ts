import { Schema } from "effect";
import { HttpApi, HttpApiEndpoint, HttpApiGroup, HttpApiSchema } from "effect/http-api";

import { Authorization } from "@/contract/Authorization";
import { InvalidPin } from "@/contract/errors/InvalidPin";
import { ItemNotFound } from "@/contract/errors/ItemNotFound";
import { SectionNotFound } from "@/contract/errors/SectionNotFound";
import { TooManyAttempts } from "@/contract/errors/TooManyAttempts";
import { LoginPayload } from "@/contract/schemas/Auth";
import { CreateItemPayload, Item, ItemId, MoveItemPayload, UpdateItemPayload } from "@/contract/schemas/Item";
import { MoveSectionPayload, Section, SectionId, SectionTitlePayload } from "@/contract/schemas/Section";

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
  // Answers the sections in their new order.
  .add(
    HttpApiEndpoint.patch("move", "/:id/position", {
      params: sectionParams,
      payload: MoveSectionPayload,
      success: Schema.Array(Section),
      error: SectionNotFound,
    }),
  )
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
  // Answers every item in its new order.
  .add(
    HttpApiEndpoint.patch("move", "/:id/position", {
      params: itemParams,
      payload: MoveItemPayload,
      success: Schema.Array(Item),
      error: [ItemNotFound, SectionNotFound],
    }),
  )
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

// Logging in is how a session starts and logging out must work with an expired one: only
// `session`, added before `middleware`, requires one. It answers whether the session is valid.
export const AuthGroup = HttpApiGroup.make("auth")
  .add(HttpApiEndpoint.get("session", "/session"))
  .middleware(Authorization)
  .add(HttpApiEndpoint.post("login", "/login", { payload: LoginPayload, error: [InvalidPin, TooManyAttempts] }))
  .add(HttpApiEndpoint.post("logout", "/logout"))
  .prefix("/auth");

// Served by the Next.js catch-all route in `src/app/api/[[...path]]/route.ts`: the folder name
// and this prefix must stay the same.
export const Api = HttpApi.make("checkpoint").add(SectionsGroup).add(ItemsGroup).add(AuthGroup).prefix("/api");
