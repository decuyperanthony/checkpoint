import { Schema } from "effect";

export const SectionId = Schema.String.check(Schema.isUUID()).pipe(Schema.brand("SectionId"));
export type SectionId = typeof SectionId.Type;

const sectionTitleMaxLength = 200;

export const SectionTitle = Schema.Trim.check(Schema.isNonEmpty(), Schema.isMaxLength(sectionTitleMaxLength));

export const Section = Schema.Struct({
  id: SectionId,
  title: SectionTitle,
  position: Schema.Int,
});
export type Section = typeof Section.Type;

// Creating and renaming both carry only a title.
export const SectionTitlePayload = Schema.Struct({ title: SectionTitle });
export type SectionTitlePayload = typeof SectionTitlePayload.Type;
