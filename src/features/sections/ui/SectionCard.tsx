"use client";

import { ListChecksIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";

import type { Section } from "@/contract/schemas/Section";
import { useRemoveSection, useRenameSection } from "@/features/sections/api/sections";
import { TitleForm } from "@/features/sections/ui/TitleForm";
import { Card } from "@/shared/ui/Card";
import { IconButton } from "@/shared/ui/IconButton";
import { IconTitle } from "@/shared/ui/IconTitle";
import { Stack } from "@/shared/ui/Stack";

type SectionCardProps = {
  readonly section: Section;
  readonly children?: ReactNode;
};

export const SectionCard = ({ section, children }: SectionCardProps) => {
  const t = useTranslations("sections");
  const [editing, setEditing] = useState(false);
  const rename = useRenameSection();
  const remove = useRemoveSection();

  const header = editing ? (
    <TitleForm
      label={t("title")}
      submitLabel={t("save")}
      defaultTitle={section.title}
      pending={rename.isPending}
      onSubmit={(title, onSaved) =>
        rename.mutate(
          { id: section.id, title },
          {
            onSuccess: () => {
              onSaved();
              setEditing(false);
            },
          },
        )
      }
      onCancel={() => setEditing(false)}
    />
  ) : (
    <Stack direction="row" justify="between">
      <IconTitle icon={ListChecksIcon}>{section.title}</IconTitle>
      <Stack direction="row" gap="sm">
        <IconButton icon={PencilIcon} label={t("rename")} onClick={() => setEditing(true)} />
        <IconButton
          icon={Trash2Icon}
          label={t("remove")}
          variant="destructive"
          disabled={remove.isPending}
          onClick={() => remove.mutate(section.id)}
        />
      </Stack>
    </Stack>
  );

  return <Card header={header}>{children}</Card>;
};
