"use client";

import { PencilIcon, Trash2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";

import type { Section } from "@/contract/schemas/Section";
import { useRemoveSection } from "@/features/sections/api/sections";
import { useCollapsedSections } from "@/features/sections/model/collapsedSections";
import { RenameSectionForm } from "@/features/sections/ui/RenameSectionForm";
import { useInlineEdit } from "@/shared/lib/useInlineEdit";
import { ActionsMenu } from "@/shared/ui/ActionsMenu";
import { Line } from "@/shared/ui/Line";
import { RemoveDialog } from "@/shared/ui/RemoveDialog";
import { Title } from "@/shared/ui/Title";
import type { LineColor } from "@/shared/ui/tokens";

type SectionLineProps = {
  section: Section;
  color: LineColor;
  // Its place on the board, shown in the line's badge.
  number: number;
  // Next to the name, before the menu: what the board knows about the section (its progress).
  aside?: ReactNode;
  // Its stations.
  children: ReactNode;
};

// A section drawn as a metro line.
export const SectionLine = ({ section, color, number, aside, children }: SectionLineProps) => {
  const t = useTranslations();
  const { editing, triggerRef, open, close } = useInlineEdit();
  const [removing, setRemoving] = useState(false);
  const remove = useRemoveSection();
  const { isOpen, toggle } = useCollapsedSections();

  return (
    <Line
      color={color}
      number={number}
      header={
        editing ? <RenameSectionForm section={section} onClose={close} /> : <Title size="md">{section.title}</Title>
      }
      aside={editing ? null : aside}
      toggleLabel={t("sections.stations", { title: section.title })}
      open={isOpen(section.id)}
      onOpenChange={() => toggle(section.id)}
      actions={
        editing ? undefined : (
          <ActionsMenu label={t("sections.menu", { title: section.title })} triggerRef={triggerRef}>
            <ActionsMenu.Item icon={PencilIcon} onSelect={open}>
              {t("actions.rename")}
            </ActionsMenu.Item>
            <ActionsMenu.Separator />
            <ActionsMenu.Item icon={Trash2Icon} tone="destructive" onSelect={() => setRemoving(true)}>
              {t("actions.remove")}
            </ActionsMenu.Item>
          </ActionsMenu>
        )
      }
    >
      {children}
      <RemoveDialog
        name={section.title}
        description={t("sections.removeDescription")}
        open={removing}
        onOpenChange={setRemoving}
        returnFocusTo={triggerRef}
        onConfirm={() => remove.mutate(section.id)}
      />
    </Line>
  );
};
