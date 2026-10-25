"use client";

import { useTranslations } from "next-intl";

import type { Section } from "@/contract/schemas/Section";
import { useItems } from "@/features/items/api/items";
import { Progress } from "@/shared/ui/Progress";

type SectionProgressProps = {
  section: Pick<Section, "id" | "title">;
};

// How much of a section is done; nothing for an empty one.
export const SectionProgress = ({ section }: SectionProgressProps) => {
  const t = useTranslations("items");
  const { data: items } = useItems();
  const inSection = items.filter((item) => item.sectionId === section.id);
  const done = inSection.filter((item) => item.done).length;
  const total = inSection.length;

  if (total === 0) return null;

  return (
    <Progress
      label={t("progressLabel", { done, total, section: section.title })}
      summary={t("progress", { done, total })}
    />
  );
};
