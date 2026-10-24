"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/shared/ui/Button";
import { Stack } from "@/shared/ui/Stack";
import { TextField } from "@/shared/ui/TextField";
import { useTextForm, type TextFormField } from "@/shared/ui/textForm";

type AddFormProps = {
  readonly label: string;
  readonly field: TextFormField;
  readonly pending: boolean;
  // Same shape as a TanStack mutation's `mutate`: the form clears itself on success.
  readonly onAdd: (value: string, options: { readonly onSuccess: () => void }) => void;
};

// Adds values one after the other: after each success the field is emptied and keeps the focus.
export const AddForm = ({ label, field, pending, onAdd }: AddFormProps) => {
  const t = useTranslations("actions");
  const { handleSubmit, reset, setFocus, fieldProps } = useTextForm(field, "");

  const add = handleSubmit(({ value }) =>
    onAdd(value, {
      onSuccess: () => {
        reset();
        setFocus("value");
      },
    }),
  );

  return (
    <form onSubmit={add}>
      <Stack direction="row">
        <TextField {...fieldProps} label={label} labelVisibility="hidden" />
        <Button type="submit" disabled={pending}>
          {t("add")}
        </Button>
      </Stack>
    </form>
  );
};
