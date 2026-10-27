"use client";

import type { Schema } from "effect";
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
import { useSchemaResolver } from "./useSchemaResolver";

// What a bound field sets itself, from the form and the schema.
type BoundProps = "name" | "value" | "onChange" | "onBlur" | "ref" | "error" | "required" | "maxLength";

// A form typed by its schema. Call it once, at module level:
//
//   const SectionForm = createForm(SectionTitlePayload);
//   const form = SectionForm.useForm({ defaultValues: { title: "" } });
//   <SectionForm form={form} onSubmit={({ title }) => …}>
//     <SectionForm.TextField name="title" label={t("title")} />
//   </SectionForm>
//
// Field names come from the schema (`name="titel"` does not compile), `onSubmit` receives the
// decoded values, `required` / `maxLength` are read from the schema's checks, and each error
// is worded after the check that failed (see useSchemaResolver).
export const createForm = <F extends FormFields>(schema: Schema.Struct<F>) => {
  type Input = Schema.Struct<F>["Encoded"];
  type Output = Schema.Struct<F>["Type"];

  const facts = fieldFacts(schema.fields);

  // Every field gets its default value: an empty text is "".
  const useForm = (options: { defaultValues: Input & DefaultValues<Input> }) =>
    useReactHookForm<Input, unknown, Output>({ ...options, resolver: useSchemaResolver(schema) });

  type FormProps = {
    form: UseFormReturn<Input, unknown, Output>;
    onSubmit: (values: Output) => void;
    // A form that adds something: "ignore" lets an empty submit pass in silence, with no error.
    emptySubmit?: "validate" | "ignore";
    children: ReactNode;
  };

  const Form = ({ form, onSubmit, emptySubmit = "validate", children }: FormProps) => {
    const submit = form.handleSubmit((values) => onSubmit(values));
    const isEmpty = () => Object.values(form.getValues()).every((value) => value === "");

    return (
      <FormProvider {...form}>
        {/* `onSubmit` gets the decoded values alone, never React Hook Form's event. */}
        <form
          noValidate
          onSubmit={(event) => {
            if (emptySubmit === "ignore" && isEmpty()) {
              event.preventDefault();
              event.currentTarget.querySelector("input")?.focus();
              return;
            }
            void submit(event);
          }}
        >
          {children}
        </form>
      </FormProvider>
    );
  };

  type TextFieldProps = Omit<ComponentProps<typeof PlainTextField>, BoundProps> & {
    // Only the fields holding a string.
    name: FieldPathByValue<Input, string>;
  };

  const TextField = ({ name, ...props }: TextFieldProps) => {
    const { field, fieldState } = useController<Input>({ name });
    const value = typeof field.value === "string" ? field.value : "";

    return (
      <PlainTextField
        {...props}
        {...field}
        value={value}
        maxLength={facts.maxLength(name)}
        required={facts.required(name)}
        error={fieldState.error?.message}
      />
    );
  };

  return Object.assign(Form, { useForm, TextField });
};
