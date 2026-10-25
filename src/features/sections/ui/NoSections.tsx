"use client";

import { useTranslations } from "next-intl";

import { Stack } from "@/shared/ui/Stack";
import { Text } from "@/shared/ui/Text";
import { Title } from "@/shared/ui/Title";

export const NoSections = () => {
  const t = useTranslations("sections");

  return (
    <Stack gap="sm">
      <Title size="lg">{t("empty")}</Title>
      <Text tone="muted">{t("emptyHint")}</Text>
    </Stack>
  );
};
