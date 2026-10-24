"use client";

import { ListChecksIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";

import type { Section } from "@/contract/schemas/Section";
import { useRemoveSection } from "@/features/sections/api/sections";
import { RenameSectionForm } from "@/features/sections/ui/RenameSectionForm";
import { useInlineEdit } from "@/shared/lib/useInlineEdit";
import { ActionsMenu } from "@/shared/ui/ActionsMenu";
import { Card } from "@/shared/ui/Card";
import { IconTitle } from "@/shared/ui/IconTitle";
import { RemoveDialog } from "@/shared/ui/RemoveDialog";
import { Stack } from "@/shared/ui/Stack";

type SectionCardProps = {
  section: Section;
  children?: ReactNode;
};

export const SectionCard = ({ section, children }: SectionCardProps) => {
  const t = useTranslations();
  const { editing, triggerRef, open, close } = useInlineEdit();
  const [removing, setRemoving] = useState(false);
  const remove = useRemoveSection();

  const header = editing ? (
    <RenameSectionForm section={section} onClose={close} />
  ) : (
    <Stack direction="row" justify="between">
      <IconTitle icon={ListChecksIcon}>{section.title}</IconTitle>
      <ActionsMenu label={t("sections.menu", { title: section.title })} triggerRef={triggerRef}>
        <ActionsMenu.Item icon={PencilIcon} onSelect={open}>
          {t("actions.rename")}
        </ActionsMenu.Item>
        <ActionsMenu.Separator />
        <ActionsMenu.Item icon={Trash2Icon} tone="destructive" onSelect={() => setRemoving(true)}>
          {t("actions.remove")}
        </ActionsMenu.Item>
      </ActionsMenu>
    </Stack>
  );

  return (
    <Card header={header}>
      {children}
      <RemoveDialog
        name={section.title}
        description={t("sections.removeDescription")}
        open={removing}
        onOpenChange={setRemoving}
        returnFocusTo={triggerRef}
        onConfirm={() => remove.mutate(section.id)}
      />
    </Card>
  );
};
