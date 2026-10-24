"use client";

import { useTranslations } from "next-intl";

import type { Section } from "@/contract/schemas/Section";
import { useCreateItem, useItems } from "@/features/items/api/items";
import { useContentField } from "@/features/items/model/contentField";
import { ItemRow } from "@/features/items/ui/ItemRow";
import { AddForm } from "@/shared/ui/AddForm";
import { Stack } from "@/shared/ui/Stack";

type ItemListProps = {
  readonly section: Pick<Section, "id" | "title">;
};

export const ItemList = ({ section }: ItemListProps) => {
  const t = useTranslations("items");
  const { data: items } = useItems();
  const field = useContentField();
  const create = useCreateItem();

  return (
    <Stack>
      {items
        .filter((item) => item.sectionId === section.id)
        .map((item) => (
          <ItemRow key={item.id} item={item} sectionTitle={section.title} />
        ))}
      <AddForm
        label={t("newContent", { section: section.title })}
        field={field}
        pending={create.isPending}
        onAdd={(content, options) => create.mutate({ sectionId: section.id, content }, options)}
      />
    </Stack>
  );
};
