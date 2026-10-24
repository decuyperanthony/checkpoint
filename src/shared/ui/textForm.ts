import { useForm, type Resolver } from "react-hook-form";

export type TextFormValues = { readonly value: string };

// Everything a text form needs to validate its field, built by each feature from the
// contract schema of that field.
export type TextFormField = {
  readonly resolver: Resolver<TextFormValues>;
  readonly maxLength: number;
  readonly invalidMessage: string;
};

// The form state shared by `AddForm` and `EditForm`, and the props of their `TextField`.
export const useTextForm = (field: TextFormField, value: string) => {
  const form = useForm<TextFormValues>({ resolver: field.resolver, defaultValues: { value } });

  return {
    ...form,
    fieldProps: {
      ...form.register("value"),
      maxLength: field.maxLength,
      error: form.formState.errors.value === undefined ? undefined : field.invalidMessage,
    },
  };
};
