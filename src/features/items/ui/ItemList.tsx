"use client";

import type { Section } from "@/contract/schemas/Section";
import { useItems } from "@/features/items/api/items";
import { ItemRow } from "@/features/items/ui/ItemRow";
import { NewItemForm } from "@/features/items/ui/NewItemForm";
import { Stack } from "@/shared/ui/Stack";

type ItemListProps = {
  section: Pick<Section, "id" | "title">;
};

export const ItemList = ({ section }: ItemListProps) => {
  const { data: items } = useItems();

  return (
    <Stack>
      {items
        .filter((item) => item.sectionId === section.id)
        .map((item) => (
          <ItemRow key={item.id} item={item} sectionTitle={section.title} />
        ))}
      <NewItemForm section={section} />
    </Stack>
  );
};
