"use client";

import { effectTsResolver } from "@hookform/resolvers/effect-ts";
import type { Schema } from "effect";
import { useTranslations } from "next-intl";
import type { ComponentProps, ReactNode } from "react";
import {
  FormProvider,
  useController,
  useForm as useReactHookForm,
  type FieldPathByValue,
  type DefaultValues,
  type UseFormReturn,
} from "react-hook-form";

import { TextField as PlainTextField } from "@/shared/ui/TextField";

import { fieldFacts, type FormFields } from "./fieldFacts";

// What a bound field sets itself, from the form and the schema.
type BoundProps = "name" | "value" | "onChange" | "onBlur" | "ref" | "error" | "required" | "maxLength";

// One generic message per kind of error, worked out from the value: schemas carry no copy.
const useErrorMessage = ({
  invalid,
  value,
  maxLength,
}: {
  invalid: boolean;
  value: string;
  maxLength: number | undefined;
}) => {
  const t = useTranslations("form.errors");
  if (!invalid) return undefined;
  if (value.trim() === "") return t("required");
  if (maxLength !== undefined && value.length > maxLength) return t("tooLong", { max: maxLength });
  return t("invalid");
};

// A form typed by its schema. Call it once, at module level:
//
//   const SectionForm = createForm(SectionTitlePayload);
//   const form = SectionForm.useForm({ defaultValues: { title: "" } });
//   <SectionForm form={form} onSubmit={({ title }) => …}>
//     <SectionForm.TextField name="title" label={t("title")} />
//   </SectionForm>
//
// Field names come from the schema (`name="titel"` does not compile), `onSubmit` receives the
// decoded values, and `required` / `maxLength` are read from the schema's checks.
export const createForm = <F extends FormFields>(schema: Schema.Struct<F>) => {
  type Input = Schema.Struct<F>["Encoded"];
  type Output = Schema.Struct<F>["Type"];

  const resolver = effectTsResolver(schema);
  const facts = fieldFacts(schema.fields);

  // Every field gets its default value: an empty text is "".
  const useForm = (options: { readonly defaultValues: Input & DefaultValues<Input> }) =>
    useReactHookForm<Input, unknown, Output>({ ...options, resolver });

  type FormProps = {
    readonly form: UseFormReturn<Input, unknown, Output>;
    readonly onSubmit: (values: Output) => void;
    readonly children: ReactNode;
  };

  const Form = ({ form, onSubmit, children }: FormProps) => (
    <FormProvider {...form}>
      {/* `onSubmit` gets the decoded values alone, never React Hook Form's event. */}
      <form noValidate onSubmit={form.handleSubmit((values) => onSubmit(values))}>
        {children}
      </form>
    </FormProvider>
  );

  type TextFieldProps = Omit<ComponentProps<typeof PlainTextField>, BoundProps> & {
    // Only the fields holding a string.
    readonly name: FieldPathByValue<Input, string>;
  };

  const TextField = ({ name, ...props }: TextFieldProps) => {
    const { field, fieldState } = useController<Input>({ name });
    const value = typeof field.value === "string" ? field.value : "";
    const maxLength = facts.maxLength(name);
    const error = useErrorMessage({ invalid: fieldState.invalid, value, maxLength });

    return (
      <PlainTextField
        {...props}
        {...field}
        value={value}
        maxLength={maxLength}
        required={facts.required(name)}
        error={error}
      />
    );
  };

  return Object.assign(Form, { useForm, TextField });
};
