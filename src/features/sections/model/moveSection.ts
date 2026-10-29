import { placeAt } from "@/contract/ordering";
import type { Section } from "@/contract/schemas/Section";

// The sections once `id` is moved to `position`, numbered again: what the server will answer,
// shown before it does.
export const movedSections = (sections: ReadonlyArray<Section>, { id, position }: Pick<Section, "id" | "position">) => {
  const moved = sections.find((section) => section.id === id);
  if (moved === undefined) return sections;
  return placeAt({ list: sections, item: moved, index: position }).map((section, index) => ({
    ...section,
    position: index,
  }));
};
