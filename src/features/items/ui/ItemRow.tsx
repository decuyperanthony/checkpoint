"use client";

import { PencilIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import type { Item } from "@/contract/schemas/Item";
import type { Section } from "@/contract/schemas/Section";
import { useRemoveItem, useUpdateItem } from "@/features/items/api/items";
import { useContentField } from "@/features/items/model/contentField";
import { useInlineEdit } from "@/shared/lib/useInlineEdit";
import { Checkbox } from "@/shared/ui/Checkbox";
import { EditForm } from "@/shared/ui/EditForm";
import { IconButton } from "@/shared/ui/IconButton";
import { RemoveButton } from "@/shared/ui/RemoveButton";
import { Stack } from "@/shared/ui/Stack";

type ItemRowProps = {
  readonly item: Item;
  // Its section's title, so that rows with the same text in two sections have distinct names.
  readonly sectionTitle: Section["title"];
};

export const ItemRow = ({ item, sectionTitle }: ItemRowProps) => {
  const names = { content: item.content, section: sectionTitle };
  const t = useTranslations("items");
  const { editing, triggerRef, open, close } = useInlineEdit();
  const field = useContentField();
  const update = useUpdateItem();
  const remove = useRemoveItem();

  if (editing) {
    return (
      <EditForm
        label={t("content", names)}
        field={field}
        value={item.content}
        pending={update.isPending}
        onSave={(content) => update.mutate({ id: item.id, changes: { content } }, { onSuccess: close })}
        onCancel={close}
      />
    );
  }

  return (
    <Stack direction="row" justify="between">
      <Checkbox
        label={item.content}
        checked={item.done}
        checkedStyle="strikethrough"
        pending={update.isPending}
        onCheckedChange={(done) => update.mutate({ id: item.id, changes: { done } })}
      />
      <Stack direction="row" gap="sm">
        <IconButton ref={triggerRef} icon={PencilIcon} label={t("edit", names)} onClick={open} />
        <RemoveButton
          name={item.content}
          label={t("remove", names)}
          description={t("removeDescription")}
          disabled={remove.isPending}
          onConfirm={() => remove.mutate(item.id)}
        />
      </Stack>
    </Stack>
  );
};
