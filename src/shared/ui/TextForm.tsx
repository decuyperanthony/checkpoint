"use client";

import { useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";

import { Button } from "@/shared/ui/Button";
import { Stack } from "@/shared/ui/Stack";
import { TextField } from "@/shared/ui/TextField";

export type TextFormValues = { readonly value: string };

type TextFormProps = {
  readonly label: string;
  readonly submitLabel: string;
  readonly invalidMessage: string;
  // Validation comes from the caller, built from the contract schema of the field.
  readonly resolver: Resolver<TextFormValues>;
  readonly maxLength: number;
  readonly pending: boolean;
  readonly onSubmit: (value: string) => void;
  readonly defaultValue?: string;
  // Keeps keyboard focus in the field when the form is remounted, e.g. after a creation.
  readonly focusOnMount?: boolean;
  // Editing an existing value: focus the field, and Escape or Cancel leave without saving.
  readonly edit?: { readonly cancelLabel: string; readonly onCancel: () => void };
};

// One text field and its buttons: creating and editing a section title or an item text.
// To clear it after a successful creation, the parent remounts it with a new `key`.
export const TextForm = ({
  label,
  submitLabel,
  invalidMessage,
  resolver,
  maxLength,
  pending,
  onSubmit,
  defaultValue = "",
  focusOnMount = false,
  edit,
}: TextFormProps) => {
  const { register, handleSubmit, setFocus, formState } = useForm<TextFormValues>({
    resolver,
    defaultValues: { value: defaultValue },
  });

  const shouldFocus = focusOnMount || edit !== undefined;
  useEffect(() => {
    if (shouldFocus) setFocus("value");
  }, [shouldFocus, setFocus]);

  const submit = handleSubmit(({ value }) => {
    // Saving an unchanged value is the same as cancelling.
    if (edit !== undefined && value === defaultValue) edit.onCancel();
    else onSubmit(value);
  });

  return (
    <form onSubmit={submit}>
      <Stack direction="row">
        <TextField
          {...register("value")}
          label={label}
          labelVisibility="hidden"
          maxLength={maxLength}
          onKeyDown={(event) => {
            if (event.key === "Escape") edit?.onCancel();
          }}
          error={formState.errors.value === undefined ? undefined : invalidMessage}
        />
        <Button type="submit" disabled={pending}>
          {submitLabel}
        </Button>
        {edit === undefined ? null : (
          <Button variant="ghost" onClick={edit.onCancel}>
            {edit.cancelLabel}
          </Button>
        )}
      </Stack>
    </form>
  );
};
