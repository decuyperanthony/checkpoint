import { placeAt } from "@/contract/ordering";
import type { Item } from "@/contract/schemas/Item";

// The items once `id` is moved to `position` among those of `sectionId`, numbered again there:
// what the server will answer, shown before it does.
export const movedItems = (
  items: ReadonlyArray<Item>,
  { id, sectionId, position }: Pick<Item, "id" | "sectionId" | "position">,
) => {
  const moved = items.find((item) => item.id === id);
  if (moved === undefined) return items;

  const target = items.filter((item) => item.sectionId === sectionId && item.id !== id);
  const placed = placeAt({ list: target, item: { ...moved, sectionId }, index: position });
  const untouched = items.filter((item) => item.id !== id && item.sectionId !== sectionId);
  return [...untouched, ...placed.map((item, index) => ({ ...item, position: index }))];
};
