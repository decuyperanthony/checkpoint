"use client";

import { useTranslations } from "next-intl";

import { Stack } from "@/shared/ui/Stack";
import { Text } from "@/shared/ui/Text";

export const NoSections = () => {
  const t = useTranslations("sections");

  return (
    <Stack gap="sm">
      <Text as="h2" size="xl">
        {t("empty")}
      </Text>
      <Text tone="muted">{t("emptyHint")}</Text>
    </Stack>
  );
};
