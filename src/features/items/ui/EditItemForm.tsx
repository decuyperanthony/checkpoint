"use client";

import { useTranslations } from "next-intl";

import { CreateItemPayload, type Item } from "@/contract/schemas/Item";
import type { Section } from "@/contract/schemas/Section";
import { useUpdateItem } from "@/features/items/api/items";
import { createForm } from "@/shared/form";
import { EditActions } from "@/shared/ui/EditActions";
import { Stack } from "@/shared/ui/Stack";

// Editing changes the text only, which is exactly what creating an item takes.
const ItemForm = createForm(CreateItemPayload);

type EditItemFormProps = {
  readonly item: Item;
  readonly sectionTitle: Section["title"];
  readonly onClose: () => void;
};

// The item text edited in place: Enter saves, Escape or Cancel leave without saving.
export const EditItemForm = ({ item, sectionTitle, onClose }: EditItemFormProps) => {
  const t = useTranslations();
  const update = useUpdateItem();
  const form = ItemForm.useForm({ defaultValues: { content: item.content } });

  const save = ({ content }: CreateItemPayload) =>
    content === item.content ? onClose() : update.mutate({ id: item.id, changes: { content } }, { onSuccess: onClose });

  return (
    <ItemForm form={form} onSubmit={save}>
      <Stack direction="row">
        <ItemForm.TextField
          name="content"
          label={t("items.content", { content: item.content, section: sectionTitle })}
          labelVisibility="hidden"
          focusOnMount
          onKeyDown={(event) => {
            if (event.key === "Escape") onClose();
          }}
        />
        <EditActions pending={update.isPending} onCancel={onClose} />
      </Stack>
    </ItemForm>
  );
};
