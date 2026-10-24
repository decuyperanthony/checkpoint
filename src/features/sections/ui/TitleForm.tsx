"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { titleResolver } from "@/features/sections/model/titleForm";
import { Button } from "@/shared/ui/Button";
import { Stack } from "@/shared/ui/Stack";
import { TextField } from "@/shared/ui/TextField";

type TitleFormProps = {
  readonly label: string;
  readonly submitLabel: string;
  readonly defaultTitle?: string;
  readonly pending: boolean;
  // `onSaved` runs only on success; failures are shown by the central error toast.
  readonly onSubmit: (title: string, onSaved: () => void) => void;
  readonly onCancel?: () => void;
};

// Shared by "new section" and "rename section": one title field, validated with the API schema.
export const TitleForm = ({ label, submitLabel, defaultTitle = "", pending, onSubmit, onCancel }: TitleFormProps) => {
  const t = useTranslations("sections");
  const { register, handleSubmit, reset, setFocus, formState } = useForm({
    resolver: titleResolver,
    defaultValues: { title: defaultTitle },
  });

  // Editing an existing title: move focus to the field it replaced.
  const editing = onCancel !== undefined;
  useEffect(() => {
    if (editing) setFocus("title");
  }, [editing, setFocus]);

  const submit = handleSubmit(({ title }) => onSubmit(title, () => reset({ title: defaultTitle })));

  return (
    <form onSubmit={submit}>
      <Stack direction="row">
        <TextField
          {...register("title")}
          label={label}
          labelVisibility="hidden"
          onKeyDown={(event) => {
            if (event.key === "Escape") onCancel?.();
          }}
          error={formState.errors.title === undefined ? undefined : t("titleInvalid")}
        />
        <Button type="submit" disabled={pending}>
          {submitLabel}
        </Button>
        {onCancel === undefined ? null : (
          <Button variant="ghost" onClick={onCancel}>
            {t("cancel")}
          </Button>
        )}
      </Stack>
    </form>
  );
};
