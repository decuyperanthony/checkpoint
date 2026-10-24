"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { itemContentMaxLength } from "@/contract/schemas/Item";
import type { Section } from "@/contract/schemas/Section";
import { useCreateItem, useItems } from "@/features/items/api/items";
import { contentResolver } from "@/features/items/model/contentForm";
import { ItemRow } from "@/features/items/ui/ItemRow";
import { Stack } from "@/shared/ui/Stack";
import { TextForm } from "@/shared/ui/TextForm";

type ItemListProps = {
  readonly section: Pick<Section, "id" | "title">;
};

export const ItemList = ({ section }: ItemListProps) => {
  const t = useTranslations("items");
  const { data: items } = useItems();
  const create = useCreateItem();
  // A new key remounts the form empty after each created item.
  const [formKey, setFormKey] = useState(0);

  return (
    <Stack>
      {items
        .filter((item) => item.sectionId === section.id)
        .map((item) => (
          <ItemRow key={item.id} item={item} />
        ))}
      <TextForm
        key={formKey}
        label={t("newContent", { section: section.title })}
        invalidMessage={t("contentInvalid", { max: itemContentMaxLength })}
        resolver={contentResolver}
        maxLength={itemContentMaxLength}
        focusOnMount={formKey > 0}
        pending={create.isPending}
        onSubmit={(content) =>
          create.mutate({ sectionId: section.id, content }, { onSuccess: () => setFormKey((key) => key + 1) })
        }
      />
    </Stack>
  );
};
