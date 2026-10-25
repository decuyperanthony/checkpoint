"use client";

import { PencilIcon, Trash2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import type { Item } from "@/contract/schemas/Item";
import type { Section } from "@/contract/schemas/Section";
import { useCheckItem, useRemoveItem } from "@/features/items/api/items";
import { EditItemForm } from "@/features/items/ui/EditItemForm";
import { useInlineEdit } from "@/shared/lib/useInlineEdit";
import { ActionsMenu } from "@/shared/ui/ActionsMenu";
import { Checkbox } from "@/shared/ui/Checkbox";
import { RemoveDialog } from "@/shared/ui/RemoveDialog";
import { Row } from "@/shared/ui/Row";

type ItemRowProps = {
  item: Item;
  // Its section's title, so that rows with the same text in two sections have distinct names.
  sectionTitle: Section["title"];
};

export const ItemRow = ({ item, sectionTitle }: ItemRowProps) => {
  const t = useTranslations();
  const { editing, triggerRef, open, close } = useInlineEdit();
  const [removing, setRemoving] = useState(false);
  const { done, check } = useCheckItem(item);
  const remove = useRemoveItem();

  if (editing) {
    return <EditItemForm item={item} sectionTitle={sectionTitle} onClose={close} />;
  }

  return (
    <Row
      actions={
        <ActionsMenu label={t("items.menu", { content: item.content, section: sectionTitle })} triggerRef={triggerRef}>
          <ActionsMenu.Item icon={PencilIcon} onSelect={open}>
            {t("actions.edit")}
          </ActionsMenu.Item>
          <ActionsMenu.Separator />
          <ActionsMenu.Item icon={Trash2Icon} tone="destructive" onSelect={() => setRemoving(true)}>
            {t("actions.remove")}
          </ActionsMenu.Item>
        </ActionsMenu>
      }
    >
      <Checkbox label={item.content} checked={done} checkedStyle="strikethrough" onCheckedChange={check} />
      <RemoveDialog
        name={item.content}
        description={t("items.removeDescription")}
        open={removing}
        onOpenChange={setRemoving}
        returnFocusTo={triggerRef}
        onConfirm={() => remove.mutate(item.id)}
      />
    </Row>
  );
};
