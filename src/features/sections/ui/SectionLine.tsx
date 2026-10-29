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
import { Reorder } from "@/shared/ui/Reorder";
import { RemoveDialog } from "@/shared/ui/RemoveDialog";
import { Stack } from "@/shared/ui/Stack";
import { Title } from "@/shared/ui/Title";
import type { LineColor } from "@/shared/ui/tokens";

// The one list the lines belong to.
export const linesId = "lines";

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
    <Reorder.Item kind="line" id={section.id} containerId={linesId} label={section.title}>
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
            <Stack direction="row" gap="sm">
              <Reorder.Handle label={t("sections.move", { title: section.title })} />
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
    </Reorder.Item>
  );
};
