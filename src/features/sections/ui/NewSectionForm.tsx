"use client";

import { useTranslations } from "next-intl";

import { SectionTitlePayload } from "@/contract/schemas/Section";
import { useCreateSection } from "@/features/sections/api/sections";
import { createForm } from "@/shared/form";
import { PlusIcon } from "lucide-react";

import { Card } from "@/shared/ui/Card";
import { IconButton } from "@/shared/ui/IconButton";
import { Stack } from "@/shared/ui/Stack";

const SectionForm = createForm(SectionTitlePayload);

export const NewSectionForm = () => {
  const t = useTranslations();
  const create = useCreateSection();
  const form = SectionForm.useForm({ defaultValues: { title: "" } });

  // Sections are added one after the other: the field empties and keeps the focus.
  const add = ({ title }: SectionTitlePayload) =>
    create.mutate(title, {
      onSuccess: () => {
        form.reset();
        form.setFocus("title");
      },
    });

  return (
    <Card variant="dashed">
      <SectionForm form={form} onSubmit={add}>
        <Stack direction="row" gap="sm">
          <IconButton type="submit" icon={PlusIcon} label={t("actions.add")} size="sm" disabled={create.isPending} />
          <SectionForm.TextField
            name="title"
            label={t("sections.newTitle")}
            labelVisibility="hidden"
            placeholder={t("sections.newPlaceholder")}
            appearance="ghost"
          />
        </Stack>
      </SectionForm>
    </Card>
  );
};
