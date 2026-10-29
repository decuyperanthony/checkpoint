import { Schema } from "effect";

import { SectionId } from "@/contract/schemas/Section";
import { useStoredState } from "@/shared/lib/useStoredState";

const CollapsedIds = Schema.Array(SectionId);

// The same ids with `id` added, or removed if it was there.
export const toggled = (ids: ReadonlyArray<SectionId>, id: SectionId) =>
  ids.includes(id) ? ids.filter((other) => other !== id) : [...ids, id];

const noneCollapsed: ReadonlyArray<SectionId> = [];

// Which lines are folded, remembered on this device. A line is open until folded, so a new one is.
export const useCollapsedSections = () => {
  const [collapsed, setCollapsed] = useStoredState({
    key: "checkpoint.collapsedSections",
    schema: CollapsedIds,
    fallback: noneCollapsed,
  });

  return {
    isOpen: (id: SectionId) => !collapsed.includes(id),
    toggle: (id: SectionId) => setCollapsed(toggled(collapsed, id)),
  };
};
