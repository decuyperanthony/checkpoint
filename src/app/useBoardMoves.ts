import { useItems, useMoveItem } from "@/features/items/api/items";
import { useMoveSection, useSections } from "@/features/sections/api/sections";
import type { Move } from "@/shared/ui/Reorder";

// What the board does when a line or a station is dropped: asks for the move of the section or of
// the item, the ids coming back from the drag being looked up among the ones the board holds.
export const useBoardMoves = () => {
  const { data: sections } = useSections();
  const { data: items } = useItems();
  const moveSection = useMoveSection();
  const moveItem = useMoveItem();

  return ({ id, kind, containerId, index }: Move) => {
    if (kind === "line") {
      const section = sections.find((other) => other.id === id);
      if (section !== undefined) moveSection.mutate({ id: section.id, position: index });
      return;
    }
    const item = items.find((other) => other.id === id);
    const target = sections.find((other) => other.id === containerId);
    if (item !== undefined && target !== undefined) {
      moveItem.mutate({ id: item.id, sectionId: target.id, position: index });
    }
  };
};
