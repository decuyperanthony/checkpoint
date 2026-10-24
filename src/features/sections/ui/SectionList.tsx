"use client";

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import type { Section } from "@/contract/schemas/Section";
import { useCreateSection, useSections } from "@/features/sections/api/sections";
import { SectionCard } from "@/features/sections/ui/SectionCard";
import { TitleForm } from "@/features/sections/ui/TitleForm";
import { Stack } from "@/shared/ui/Stack";

type SectionListProps = {
  // Content of each section, provided by the screen (sections do not know about items).
  readonly renderContent?: (section: Section) => ReactNode;
};

export const SectionList = ({ renderContent }: SectionListProps) => {
  const t = useTranslations("sections");
  const { data: sections } = useSections();
  const create = useCreateSection();

  return (
    <Stack gap="xl">
      {sections.length === 0 ? <p>{t("empty")}</p> : null}
      {sections.map((section) => (
        <SectionCard key={section.id} section={section}>
          {renderContent?.(section)}
        </SectionCard>
      ))}
      <TitleForm
        label={t("newTitle")}
        submitLabel={t("add")}
        pending={create.isPending}
        onSubmit={(title, onSaved) => create.mutate(title, { onSuccess: onSaved })}
      />
    </Stack>
  );
};
