"use client";

import { ListChecksIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { sectionTitleMaxLength, type Section } from "@/contract/schemas/Section";
import { useRemoveSection, useRenameSection } from "@/features/sections/api/sections";
import { titleResolver } from "@/features/sections/model/titleForm";
import { useInlineEdit } from "@/shared/lib/useInlineEdit";
import { Card } from "@/shared/ui/Card";
import { ConfirmRemoveButton } from "@/shared/ui/ConfirmRemoveButton";
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
  const { editing, triggerRef, open, close } = useInlineEdit();
  const rename = useRenameSection();
  const remove = useRemoveSection();

  const header = editing ? (
    <TextForm
      label={t("title", { title: section.title })}
      invalidMessage={t("titleInvalid", { max: sectionTitleMaxLength })}
      resolver={titleResolver}
      maxLength={sectionTitleMaxLength}
      defaultValue={section.title}
      pending={rename.isPending}
      onSubmit={(title) => rename.mutate({ id: section.id, title }, { onSuccess: close })}
      edit={{ onCancel: close }}
    />
  ) : (
    <Stack direction="row" justify="between">
      <IconTitle icon={ListChecksIcon}>{section.title}</IconTitle>
      <Stack direction="row" gap="sm">
        <IconButton ref={triggerRef} icon={PencilIcon} label={t("rename", { title: section.title })} onClick={open} />
        <ConfirmRemoveButton
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
