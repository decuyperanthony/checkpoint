"use client";

import { useTranslations } from "next-intl";

import { CreateItemPayload } from "@/contract/schemas/Item";
import type { Section } from "@/contract/schemas/Section";
import { useCreateItem } from "@/features/items/api/items";
import { createForm } from "@/shared/form";
import { PlusIcon } from "lucide-react";

import { IconButton } from "@/shared/ui/IconButton";
import { Stack } from "@/shared/ui/Stack";

const ItemForm = createForm(CreateItemPayload);

type NewItemFormProps = {
  section: Pick<Section, "id" | "title">;
};

export const NewItemForm = ({ section }: NewItemFormProps) => {
  const t = useTranslations();
  const create = useCreateItem();
  const form = ItemForm.useForm({ defaultValues: { content: "" } });

  // Items are added one after the other: the field empties and keeps the focus.
  const add = ({ content }: CreateItemPayload) =>
    create.mutate(
      { sectionId: section.id, content },
      {
        onSuccess: () => {
          form.reset();
          form.setFocus("content");
        },
      },
    );

  return (
    <ItemForm form={form} onSubmit={add}>
      <Stack direction="row" gap="sm">
        <IconButton type="submit" icon={PlusIcon} label={t("actions.add")} size="sm" disabled={create.isPending} />
        <ItemForm.TextField
          name="content"
          label={t("items.newContent", { section: section.title })}
          labelVisibility="hidden"
          placeholder={t("items.newPlaceholder")}
          appearance="ghost"
        />
      </Stack>
    </ItemForm>
  );
};
