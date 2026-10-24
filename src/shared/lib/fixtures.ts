import { Schema } from "effect";

import { SectionNotFound } from "@/contract/errors/SectionNotFound";
import { SectionId } from "@/contract/schemas/Section";

// Test data for UI tests, which cannot import Effect themselves.

export const sectionId = Schema.decodeSync(SectionId)("6f1c2a52-6a35-4d7e-9b51-0b8f0f1c9f3a");

export const sectionNotFound = () => new SectionNotFound({ id: sectionId });
