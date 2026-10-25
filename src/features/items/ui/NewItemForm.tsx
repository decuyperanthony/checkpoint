"use client";

import { useTranslations } from "next-intl";

import { CreateItemPayload } from "@/contract/schemas/Item";
import type { Section } from "@/contract/schemas/Section";
import { useCreateItem } from "@/features/items/api/items";
import { createForm } from "@/shared/form";
import { NextStation } from "@/shared/ui/Line";
import { Row, type Leg } from "@/shared/ui/Row";
import type { LineColor } from "@/shared/ui/tokens";

const ItemForm = createForm(CreateItemPayload);

type NewItemFormProps = {
  section: Pick<Section, "id" | "title">;
  color: LineColor;
  // The leg arriving from the line's last station.
  arriving: Leg;
};

export const NewItemForm = ({ section, color, arriving }: NewItemFormProps) => {
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
      <Row rail={{ color, in: arriving, out: "none" }}>
        <NextStation label={t("items.addButton", { section: section.title })} disabled={create.isPending} />
        <ItemForm.TextField
          name="content"
          label={t("items.newContent", { section: section.title })}
          labelVisibility="hidden"
          placeholder={t("items.newPlaceholder")}
          appearance="ghost"
          enterKeyHint="done"
        />
      </Row>
    </ItemForm>
  );
};
