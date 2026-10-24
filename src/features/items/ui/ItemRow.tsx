"use client";

import { PencilIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import type { Item } from "@/contract/schemas/Item";
import type { Section } from "@/contract/schemas/Section";
import { useRemoveItem, useUpdateItem } from "@/features/items/api/items";
import { EditItemForm } from "@/features/items/ui/EditItemForm";
import { useInlineEdit } from "@/shared/lib/useInlineEdit";
import { Checkbox } from "@/shared/ui/Checkbox";
import { IconButton } from "@/shared/ui/IconButton";
import { RemoveButton } from "@/shared/ui/RemoveButton";
import { Stack } from "@/shared/ui/Stack";

type ItemRowProps = {
  item: Item;
  // Its section's title, so that rows with the same text in two sections have distinct names.
  sectionTitle: Section["title"];
};

export const ItemRow = ({ item, sectionTitle }: ItemRowProps) => {
  const names = { content: item.content, section: sectionTitle };
  const t = useTranslations("items");
  const { editing, triggerRef, open, close } = useInlineEdit();
  const update = useUpdateItem();
  const remove = useRemoveItem();

  if (editing) {
    return <EditItemForm item={item} sectionTitle={sectionTitle} onClose={close} />;
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
