"use client";

import { useTranslations } from "next-intl";

import { Text } from "@/shared/ui/Text";

export const NoSections = () => {
  const t = useTranslations("sections");

  return <Text>{t("empty")}</Text>;
};
