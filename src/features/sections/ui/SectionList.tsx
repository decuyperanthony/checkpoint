"use client";

import { useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";

import { sectionTitleMaxLength, type Section } from "@/contract/schemas/Section";
import { useCreateSection, useSections } from "@/features/sections/api/sections";
import { titleResolver } from "@/features/sections/model/titleForm";
import { SectionCard } from "@/features/sections/ui/SectionCard";
import { Stack } from "@/shared/ui/Stack";
import { TextForm } from "@/shared/ui/TextForm";

type SectionListProps = {
  // Content of each section, provided by the screen (sections do not know about items).
  readonly renderContent?: (section: Section) => ReactNode;
};

export const SectionList = ({ renderContent }: SectionListProps) => {
  const t = useTranslations("sections");
  const { data: sections } = useSections();
  const create = useCreateSection();
  // A new key remounts the form empty after each created section.
  const [formKey, setFormKey] = useState(0);

  return (
    <Stack gap="xl">
      {sections.length === 0 ? <p>{t("empty")}</p> : null}
      {sections.map((section) => (
        <SectionCard key={section.id} section={section}>
          {renderContent?.(section)}
        </SectionCard>
      ))}
      <TextForm
        key={formKey}
        label={t("newTitle")}
        invalidMessage={t("titleInvalid")}
        resolver={titleResolver}
        maxLength={sectionTitleMaxLength}
        focusOnMount={formKey > 0}
        pending={create.isPending}
        onSubmit={(title) => create.mutate(title, { onSuccess: () => setFormKey((key) => key + 1) })}
      />
    </Stack>
  );
};
