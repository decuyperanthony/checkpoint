"use client";

import { ListChecksIcon, PencilIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import type { Section } from "@/contract/schemas/Section";
import { useRemoveSection, useRenameSection } from "@/features/sections/api/sections";
import { useTitleField } from "@/features/sections/model/titleField";
import { useInlineEdit } from "@/shared/lib/useInlineEdit";
import { Card } from "@/shared/ui/Card";
import { EditForm } from "@/shared/ui/EditForm";
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
  const field = useTitleField();
  const rename = useRenameSection();
  const remove = useRemoveSection();

  const header = editing ? (
    <EditForm
      label={t("title", { title: section.title })}
      field={field}
      value={section.title}
      pending={rename.isPending}
      onSave={(title) => rename.mutate({ id: section.id, title }, { onSuccess: close })}
      onCancel={close}
    />
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
