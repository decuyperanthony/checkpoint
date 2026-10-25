"use client";

import type { Section } from "@/contract/schemas/Section";
import { useItems } from "@/features/items/api/items";
import { ItemRow } from "@/features/items/ui/ItemRow";
import { NewItemForm } from "@/features/items/ui/NewItemForm";
import type { Leg } from "@/shared/ui/Row";
import type { LineColor } from "@/shared/ui/tokens";

type ItemListProps = {
  section: Pick<Section, "id" | "title">;
  color: LineColor;
};

// The leg leaving a station is travelled once it is checked, so it arrives travelled at the next.
const legAfter = (item: { done: boolean } | undefined): Leg =>
  item === undefined ? "ahead" : item.done ? "travelled" : "ahead";

export const ItemList = ({ section, color }: ItemListProps) => {
  const { data: items } = useItems();

  const stations = items.filter((item) => item.sectionId === section.id);

  return (
    <>
      {stations.map((item, index) => (
        <ItemRow
          key={item.id}
          item={item}
          sectionTitle={section.title}
          color={color}
          arriving={index === 0 ? "ahead" : legAfter(stations[index - 1])}
        />
      ))}
      <NewItemForm section={section} color={color} arriving={legAfter(stations.at(-1))} />
    </>
  );
};
