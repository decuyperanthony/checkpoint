import { Schema } from "effect";

import { SectionId } from "@/contract/schemas/Section";

export class SectionNotFound extends Schema.TaggedError<SectionNotFound>()(
  "SectionNotFound",
  { id: SectionId },
  { httpApiStatus: 404 },
) {}
