import { Schema } from "effect";
import { HttpApi, HttpApiEndpoint, HttpApiGroup, HttpApiSchema } from "effect/http-api";

import { SectionNotFound } from "@/contract/errors/SectionNotFound";
import { CreateSectionPayload, RenameSectionPayload, Section, SectionId } from "@/contract/schemas/Section";

const sectionParams = { id: SectionId };

export const SectionsGroup = HttpApiGroup.make("sections")
  .add(HttpApiEndpoint.get("list", "/sections", { success: Schema.Array(Section) }))
  .add(
    HttpApiEndpoint.post("create", "/sections", {
      payload: CreateSectionPayload,
      success: Section.pipe(HttpApiSchema.status(201)),
    }),
  )
  .add(
    HttpApiEndpoint.patch("rename", "/sections/:id", {
      params: sectionParams,
      payload: RenameSectionPayload,
      success: Section,
      error: SectionNotFound,
    }),
  )
  .add(HttpApiEndpoint.delete("remove", "/sections/:id", { params: sectionParams, error: SectionNotFound }));

export const Api = HttpApi.make("checkpoint").add(SectionsGroup).prefix("/api");
