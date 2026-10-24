"use client";

import { useTranslations } from "next-intl";

import { CreateItemPayload } from "@/contract/schemas/Item";
import type { Section } from "@/contract/schemas/Section";
import { useCreateItem } from "@/features/items/api/items";
import { createForm } from "@/shared/form";
import { Button } from "@/shared/ui/Button";
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
      <Stack direction="row">
        <ItemForm.TextField
          name="content"
          label={t("items.newContent", { section: section.title })}
          labelVisibility="hidden"
        />
        <Button type="submit" disabled={create.isPending}>
          {t("actions.add")}
        </Button>
      </Stack>
    </ItemForm>
  );
};
