"use client";

import type { ComponentProps } from "react";

import { Field, type FieldProps } from "@/shared/ui/Field";
import { Input } from "@/shared/ui/primitives/input";
import type { Size } from "@/shared/ui/tokens";

const sizes = {
  sm: "h-7 text-sm",
  md: "h-8",
  lg: "h-9",
  xl: "h-10 text-base",
} as const satisfies { [K in Size]: string };

type TextFieldProps = Omit<ComponentProps<"input">, "className" | "style" | "size" | "id"> &
  Omit<FieldProps, "children"> & {
    readonly size?: Size;
  };

export const TextField = ({ label, labelVisibility, error, size = "md", ...props }: TextFieldProps) => (
  <Field label={label} labelVisibility={labelVisibility} error={error}>
    {(control) => <Input {...props} {...control} className={sizes[size]} />}
  </Field>
);
