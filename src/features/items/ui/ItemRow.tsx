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
import { Reorder } from "@/shared/ui/Reorder";
import { Row, type Leg } from "@/shared/ui/Row";
import { Stack } from "@/shared/ui/Stack";
import type { LineColor } from "@/shared/ui/tokens";

type ItemRowProps = {
  item: Item;
  // Its section's title, so that rows with the same text in two sections have distinct names.
  sectionTitle: Section["title"];
  color: LineColor;
  // The leg arriving at this station: travelled when the station before it is checked.
  arriving: Leg;
};

export const ItemRow = ({ item, sectionTitle, color, arriving }: ItemRowProps) => {
  const t = useTranslations();
  const { editing, triggerRef, open, close } = useInlineEdit();
  const [removing, setRemoving] = useState(false);
  const checkItem = useCheckItem();
  const remove = useRemoveItem();

  if (editing) {
    return <EditItemForm item={item} sectionTitle={sectionTitle} onClose={close} />;
  }

  return (
    <Reorder.Item kind="station" id={item.id} containerId={item.sectionId} label={item.content}>
      <Row
        rail={{ color, in: arriving, out: item.done ? "travelled" : "ahead" }}
        actions={
          <Stack direction="row" gap="sm">
            <Reorder.Handle label={t("items.move", { content: item.content, section: sectionTitle })} />
            <ActionsMenu
              label={t("items.menu", { content: item.content, section: sectionTitle })}
              triggerRef={triggerRef}
            >
              <ActionsMenu.Item icon={PencilIcon} onSelect={open}>
                {t("actions.edit")}
              </ActionsMenu.Item>
              <ActionsMenu.Separator />
              <ActionsMenu.Item icon={Trash2Icon} tone="destructive" onSelect={() => setRemoving(true)}>
                {t("actions.remove")}
              </ActionsMenu.Item>
            </ActionsMenu>
          </Stack>
        }
      >
        <Checkbox
          label={item.content}
          checked={item.done}
          checkedStyle="strikethrough"
          station={color}
          onCheckedChange={(done) => checkItem.mutate({ id: item.id, done })}
        />
        <RemoveDialog
          name={item.content}
          description={t("items.removeDescription")}
          open={removing}
          onOpenChange={setRemoving}
          returnFocusTo={triggerRef}
          onConfirm={() => remove.mutate(item.id)}
        />
      </Row>
    </Reorder.Item>
  );
};
