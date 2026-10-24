"use client";

import { useTranslations } from "next-intl";

import { useCreateSection } from "@/features/sections/api/sections";
import { useTitleField } from "@/features/sections/model/titleField";
import { AddForm } from "@/shared/ui/AddForm";

export const NewSectionForm = () => {
  const t = useTranslations("sections");
  const field = useTitleField();
  const create = useCreateSection();

  return (
    <AddForm
      label={t("newTitle")}
      field={field}
      pending={create.isPending}
      onAdd={(title, options) => create.mutate(title, options)}
    />
  );
};
