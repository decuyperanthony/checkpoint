import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { Field, useField, type FieldProps } from "@/shared/ui/Field";
import { Input } from "@/shared/ui/primitives/input";
import type { Size, TokenClasses } from "@/shared/ui/tokens";

// Text size stays the atom's (16px on mobile so iOS does not zoom on focus).
const input = cva("", {
  variants: {
    size: { sm: "h-7", md: "h-8", lg: "h-9", xl: "h-10 md:text-base" } satisfies TokenClasses<Size>,
  },
  defaultVariants: { size: "md" },
});

type TextFieldProps = Omit<
  ComponentProps<"input">,
  "className" | "style" | "size" | "id" | "aria-invalid" | "aria-describedby"
> &
  FieldProps &
  VariantProps<typeof input>;

export const TextField = ({ label, labelVisibility, error, size, ...props }: TextFieldProps) => {
  const { field, control } = useField(error);

  return (
    <Field {...field} label={label} labelVisibility={labelVisibility} error={error}>
      <Input {...props} {...control} className={input({ size })} />
    </Field>
  );
};
