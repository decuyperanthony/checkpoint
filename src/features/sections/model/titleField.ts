import { useTranslations } from "next-intl";

import { SectionTitle, sectionTitleMaxLength } from "@/contract/schemas/Section";
import { textFormResolver } from "@/shared/lib/textFormResolver";
import type { TextFormField } from "@/shared/ui/textForm";

const resolver = textFormResolver(SectionTitle);

// A section title in a form: validated with the schema the API decodes it with.
export const useTitleField = (): TextFormField => {
  const t = useTranslations("sections");
  return {
    resolver,
    maxLength: sectionTitleMaxLength,
    invalidMessage: t("titleInvalid", { max: sectionTitleMaxLength }),
  };
};
