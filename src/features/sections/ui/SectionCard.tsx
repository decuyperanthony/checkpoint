"use client";

import { ListChecksIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";

import { sectionTitleMaxLength, type Section } from "@/contract/schemas/Section";
import { useRemoveSection, useRenameSection } from "@/features/sections/api/sections";
import { titleResolver } from "@/features/sections/model/titleForm";
import { useReturnFocus } from "@/shared/lib/useReturnFocus";
import { Card } from "@/shared/ui/Card";
import { ConfirmIconButton } from "@/shared/ui/ConfirmIconButton";
import { IconButton } from "@/shared/ui/IconButton";
import { IconTitle } from "@/shared/ui/IconTitle";
import { Stack } from "@/shared/ui/Stack";
import { TextForm } from "@/shared/ui/TextForm";

type SectionCardProps = {
  readonly section: Section;
  readonly children?: ReactNode;
};

export const SectionCard = ({ section, children }: SectionCardProps) => {
  const t = useTranslations("sections");
  const [editing, setEditing] = useState(false);
  const rename = useRenameSection();
  const remove = useRemoveSection();

  const renameButton = useReturnFocus<HTMLButtonElement>(editing);

  const header = editing ? (
    <TextForm
      label={t("title", { title: section.title })}
      invalidMessage={t("titleInvalid", { max: sectionTitleMaxLength })}
      resolver={titleResolver}
      maxLength={sectionTitleMaxLength}
      defaultValue={section.title}
      pending={rename.isPending}
      onSubmit={(title) => rename.mutate({ id: section.id, title }, { onSuccess: () => setEditing(false) })}
      edit={{ onCancel: () => setEditing(false) }}
    />
  ) : (
    <Stack direction="row" justify="between">
      <IconTitle icon={ListChecksIcon}>{section.title}</IconTitle>
      <Stack direction="row" gap="sm">
        <IconButton
          ref={renameButton}
          icon={PencilIcon}
          label={t("rename", { title: section.title })}
          onClick={() => setEditing(true)}
        />
        <ConfirmIconButton
          icon={Trash2Icon}
          label={t("remove", { title: section.title })}
          title={t("removeTitle", { title: section.title })}
          description={t("removeDescription")}
          disabled={remove.isPending}
          onConfirm={() => remove.mutate(section.id)}
        />
      </Stack>
    </Stack>
  );

  return <Card header={header}>{children}</Card>;
};
