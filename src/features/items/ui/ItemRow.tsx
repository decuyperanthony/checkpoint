"use client";

import { PencilIcon, Trash2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { itemContentMaxLength, type Item } from "@/contract/schemas/Item";
import { useRemoveItem, useUpdateItem } from "@/features/items/api/items";
import { contentResolver } from "@/features/items/model/contentForm";
import { useReturnFocus } from "@/shared/lib/useReturnFocus";
import { Checkbox } from "@/shared/ui/Checkbox";
import { ConfirmIconButton } from "@/shared/ui/ConfirmIconButton";
import { IconButton } from "@/shared/ui/IconButton";
import { Stack } from "@/shared/ui/Stack";
import { TextForm } from "@/shared/ui/TextForm";

type ItemRowProps = {
  readonly item: Item;
};

export const ItemRow = ({ item }: ItemRowProps) => {
  const t = useTranslations("items");
  const [editing, setEditing] = useState(false);
  const update = useUpdateItem();
  const remove = useRemoveItem();
  const editButton = useReturnFocus<HTMLButtonElement>(editing);

  if (editing) {
    return (
      <TextForm
        label={t("content", { content: item.content })}
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
        disabled={update.isPending}
        onCheckedChange={(done) => update.mutate({ id: item.id, changes: { done } })}
      />
      <Stack direction="row" gap="sm">
        <IconButton
          ref={editButton}
          icon={PencilIcon}
          label={t("edit", { content: item.content })}
          onClick={() => setEditing(true)}
        />
        <ConfirmIconButton
          icon={Trash2Icon}
          label={t("remove", { content: item.content })}
          title={t("removeTitle", { content: item.content })}
          description={t("removeDescription")}
          disabled={remove.isPending}
          onConfirm={() => remove.mutate(item.id)}
        />
      </Stack>
    </Stack>
  );
};
