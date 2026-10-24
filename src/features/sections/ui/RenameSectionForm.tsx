"use client";

import { useTranslations } from "next-intl";

import { SectionTitlePayload, type Section } from "@/contract/schemas/Section";
import { useRenameSection } from "@/features/sections/api/sections";
import { createForm } from "@/shared/form";
import { EditActions } from "@/shared/ui/EditActions";
import { Stack } from "@/shared/ui/Stack";

const SectionForm = createForm(SectionTitlePayload);

type RenameSectionFormProps = {
  readonly section: Section;
  readonly onClose: () => void;
};

// The section title edited in place: Enter saves, Escape or Cancel leave without saving.
export const RenameSectionForm = ({ section, onClose }: RenameSectionFormProps) => {
  const t = useTranslations();
  const rename = useRenameSection();
  const form = SectionForm.useForm({ defaultValues: { title: section.title } });

  const save = ({ title }: SectionTitlePayload) =>
    title === section.title ? onClose() : rename.mutate({ id: section.id, title }, { onSuccess: onClose });

  return (
    <SectionForm form={form} onSubmit={save}>
      <Stack direction="row">
        <SectionForm.TextField
          name="title"
          label={t("sections.title", { title: section.title })}
          labelVisibility="hidden"
          focusOnMount
          onKeyDown={(event) => {
            if (event.key === "Escape") onClose();
          }}
        />
        <EditActions pending={rename.isPending} onCancel={onClose} />
      </Stack>
    </SectionForm>
  );
};
