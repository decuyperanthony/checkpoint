"use client";

import { ListChecksIcon, PencilIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import type { Section } from "@/contract/schemas/Section";
import { useRemoveSection } from "@/features/sections/api/sections";
import { RenameSectionForm } from "@/features/sections/ui/RenameSectionForm";
import { useInlineEdit } from "@/shared/lib/useInlineEdit";
import { Card } from "@/shared/ui/Card";
import { IconButton } from "@/shared/ui/IconButton";
import { IconTitle } from "@/shared/ui/IconTitle";
import { RemoveButton } from "@/shared/ui/RemoveButton";
import { Stack } from "@/shared/ui/Stack";

type SectionCardProps = {
  readonly section: Section;
  readonly children?: ReactNode;
};

export const SectionCard = ({ section, children }: SectionCardProps) => {
  const t = useTranslations("sections");
  const { editing, triggerRef, open, close } = useInlineEdit();
  const remove = useRemoveSection();

  const header = editing ? (
    <RenameSectionForm section={section} onClose={close} />
  ) : (
    <Stack direction="row" justify="between">
      <IconTitle icon={ListChecksIcon}>{section.title}</IconTitle>
      <Stack direction="row" gap="sm">
        <IconButton ref={triggerRef} icon={PencilIcon} label={t("rename", { title: section.title })} onClick={open} />
        <RemoveButton
          name={section.title}
          label={t("remove", { title: section.title })}
          description={t("removeDescription")}
          disabled={remove.isPending}
          onConfirm={() => remove.mutate(section.id)}
        />
      </Stack>
    </Stack>
  );

  return <Card header={header}>{children}</Card>;
};
