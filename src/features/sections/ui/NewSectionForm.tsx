"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { sectionTitleMaxLength } from "@/contract/schemas/Section";
import { useCreateSection } from "@/features/sections/api/sections";
import { titleResolver } from "@/features/sections/model/titleForm";
import { TextForm } from "@/shared/ui/TextForm";

export const NewSectionForm = () => {
  const t = useTranslations("sections");
  const create = useCreateSection();
  // A new key remounts the form empty after each created section.
  const [formKey, setFormKey] = useState(0);

  return (
    <TextForm
      key={formKey}
      label={t("newTitle")}
      invalidMessage={t("titleInvalid", { max: sectionTitleMaxLength })}
      resolver={titleResolver}
      maxLength={sectionTitleMaxLength}
      focusOnMount={formKey > 0}
      pending={create.isPending}
      onSubmit={(title) => create.mutate(title, { onSuccess: () => setFormKey((key) => key + 1) })}
    />
  );
};
