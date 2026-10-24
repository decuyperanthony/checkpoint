import { cva, type VariantProps } from "class-variance-authority";
import { useRef, type ComponentProps } from "react";

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
  VariantProps<typeof input> & {
    // Takes the focus once, when it appears: for a value the user just asked to edit.
    focusOnMount?: boolean;
  };

export const TextField = ({
  label,
  labelVisibility,
  error,
  size,
  focusOnMount = false,
  ref,
  ...props
}: TextFieldProps) => {
  const { field, control } = useField(error);
  const focused = useRef(false);
  const inputRef = (element: HTMLInputElement | null) => {
    if (typeof ref === "function") ref(element);
    else if (ref) ref.current = element;
    if (element === null || !focusOnMount || focused.current) return;
    focused.current = true;
    element.focus();
  };

  return (
    <Field {...field} label={label} labelVisibility={labelVisibility} error={error}>
      <Input {...props} {...control} ref={inputRef} className={input({ size })} />
    </Field>
  );
};
