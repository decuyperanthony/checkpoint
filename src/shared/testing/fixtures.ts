import { Schema } from "effect";

import { SectionNotFound } from "@/contract/errors/SectionNotFound";
import { SectionId } from "@/contract/schemas/Section";
import { textFormResolver } from "@/shared/lib/textFormResolver";

// Test data for UI tests, which cannot import Effect themselves.

export const sectionId = Schema.decodeSync(SectionId)("6f1c2a52-6a35-4d7e-9b51-0b8f0f1c9f3a");

export const sectionNotFound = () => new SectionNotFound({ id: sectionId });

// A required text of at most 20 characters, for AddForm and EditForm tests.
export const requiredText = {
  resolver: textFormResolver(Schema.Trim.check(Schema.isNonEmpty())),
  maxLength: 20,
  invalidMessage: "Required",
};
