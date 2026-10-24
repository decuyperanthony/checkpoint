"use client";

import { useTranslations } from "next-intl";

import { SectionTitlePayload } from "@/contract/schemas/Section";
import { useCreateSection } from "@/features/sections/api/sections";
import { createForm } from "@/shared/form";
import { Button } from "@/shared/ui/Button";
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
    <SectionForm form={form} onSubmit={add}>
      <Stack direction="row">
        <SectionForm.TextField name="title" label={t("sections.newTitle")} labelVisibility="hidden" />
        <Button type="submit" disabled={create.isPending}>
          {t("actions.add")}
        </Button>
      </Stack>
    </SectionForm>
  );
};
