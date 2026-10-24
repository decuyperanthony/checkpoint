"use client";

import { PencilIcon, Trash2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { itemContentMaxLength, type Item } from "@/contract/schemas/Item";
import type { Section } from "@/contract/schemas/Section";
import { useRemoveItem, useUpdateItem } from "@/features/items/api/items";
import { contentResolver } from "@/features/items/model/contentForm";
import { useReturnFocus } from "@/shared/lib/useReturnFocus";
import { Checkbox } from "@/shared/ui/Checkbox";
import { ConfirmRemoveButton } from "@/shared/ui/ConfirmRemoveButton";
import { IconButton } from "@/shared/ui/IconButton";
import { Stack } from "@/shared/ui/Stack";
import { TextForm } from "@/shared/ui/TextForm";

type ItemRowProps = {
  readonly item: Item;
  // Its section's title, so that rows with the same text in two sections have distinct names.
  readonly sectionTitle: Section["title"];
};

export const ItemRow = ({ item, sectionTitle }: ItemRowProps) => {
  const names = { content: item.content, section: sectionTitle };
  const t = useTranslations("items");
  const [editing, setEditing] = useState(false);
  const update = useUpdateItem();
  const remove = useRemoveItem();
  const editButton = useReturnFocus<HTMLButtonElement>(editing);

  if (editing) {
    return (
      <TextForm
        label={t("content", names)}
        invalidMessage={t("contentInvalid", { max: itemContentMaxLength })}
        resolver={contentResolver}
        maxLength={itemContentMaxLength}
        defaultValue={item.content}
        pending={update.isPending}
        onSubmit={(content) =>
          update.mutate({ id: item.id, changes: { content } }, { onSuccess: () => setEditing(false) })
        }
        edit={{ onCancel: () => setEditing(false) }}
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
        <IconButton ref={editButton} icon={PencilIcon} label={t("edit", names)} onClick={() => setEditing(true)} />
        <ConfirmRemoveButton
          icon={Trash2Icon}
          label={t("remove", names)}
          title={t("removeTitle", { content: item.content })}
          description={t("removeDescription")}
          disabled={remove.isPending}
          onConfirm={() => remove.mutate(item.id)}
        />
      </Stack>
    </Stack>
  );
};
