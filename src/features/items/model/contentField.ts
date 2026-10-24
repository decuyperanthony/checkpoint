import { useTranslations } from "next-intl";

import { ItemContent, itemContentMaxLength } from "@/contract/schemas/Item";
import { textFormResolver } from "@/shared/lib/textFormResolver";
import type { TextFormField } from "@/shared/ui/textForm";

const resolver = textFormResolver(ItemContent);

// An item text in a form: validated with the schema the API decodes it with.
export const useContentField = (): TextFormField => {
  const t = useTranslations("items");
  return {
    resolver,
    maxLength: itemContentMaxLength,
    invalidMessage: t("contentInvalid", { max: itemContentMaxLength }),
  };
};
