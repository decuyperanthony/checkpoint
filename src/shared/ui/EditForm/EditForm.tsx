"use client";

import { useTranslations } from "next-intl";
import { useRef } from "react";

import { Button } from "@/shared/ui/Button";
import { Stack } from "@/shared/ui/Stack";
import { TextField } from "@/shared/ui/TextField";
import { useTextForm, type TextFormField } from "@/shared/ui/textForm";

type EditFormProps = {
  readonly label: string;
  readonly field: TextFormField;
  readonly value: string;
  readonly pending: boolean;
  readonly onSave: (value: string) => void;
  readonly onCancel: () => void;
};

// Edits a value in place: opens focused, Enter saves, Escape or Cancel leave without saving.
export const EditForm = ({ label, field, value, pending, onSave, onCancel }: EditFormProps) => {
  const t = useTranslations("actions");
  const { handleSubmit, fieldProps } = useTextForm(field, value);
  // The user just asked to edit this value: the field takes the focus once, when it appears.
  const focused = useRef(false);
  const focusOnce = (input: HTMLInputElement | null) => {
    fieldProps.ref(input);
    if (input === null || focused.current) return;
    focused.current = true;
    input.focus();
  };

  // Saving an unchanged value is the same as cancelling.
  const save = handleSubmit((values) => (values.value === value ? onCancel() : onSave(values.value)));

  return (
    <form onSubmit={save}>
      <Stack direction="row">
        <TextField
          {...fieldProps}
          label={label}
          labelVisibility="hidden"
          ref={focusOnce}
          onKeyDown={(event) => {
            if (event.key === "Escape") onCancel();
          }}
        />
        <Button type="submit" disabled={pending}>
          {t("save")}
        </Button>
        <Button variant="ghost" onClick={onCancel}>
          {t("cancel")}
        </Button>
      </Stack>
    </form>
  );
};
