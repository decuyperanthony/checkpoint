import { Schema } from "effect";
import { HttpApi, HttpApiEndpoint, HttpApiGroup, HttpApiSchema } from "effect/http-api";

import { SectionNotFound } from "@/contract/errors/SectionNotFound";
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

// Served by the Next.js catch-all route in `src/app/api/[[...path]]/route.ts`: the folder name
// and this prefix must stay the same.
export const Api = HttpApi.make("checkpoint").add(SectionsGroup).prefix("/api");
