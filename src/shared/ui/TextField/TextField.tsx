import { cva, type VariantProps } from "class-variance-authority";
import { useRef, type ComponentProps } from "react";

import { Field, useField, type FieldProps } from "@/shared/ui/Field";
import { Input } from "@/shared/ui/primitives/input";
import type { Size, TokenClasses } from "@/shared/ui/tokens";

// Text size stays the atom's (16px on mobile so iOS does not zoom on focus).
const input = cva("", {
  variants: {
    size: { sm: "h-7", md: "h-9", lg: "h-10", xl: "h-12 text-lg md:text-lg" } satisfies TokenClasses<Size>,
    align: {
      start: "",
      // For a short code typed at once: centred and spaced, like the dots of a lock screen.
      center: "text-center tracking-widest",
    },
    appearance: {
      outline: "bg-card",
      // Blends into its row until hovered or focused: for quick, repeated entry.
      ghost:
        "border-transparent bg-transparent shadow-none hover:bg-muted/60 focus-visible:bg-card dark:bg-transparent",
    },
  },
  defaultVariants: { size: "md", align: "start", appearance: "outline" },
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
  hint,
  error,
  size,
  appearance,
  align,
  focusOnMount = false,
  ref,
  ...props
}: TextFieldProps) => {
  const { field, control } = useField({ hint, error });
  const focused = useRef(false);
  const inputRef = (element: HTMLInputElement | null) => {
    if (typeof ref === "function") ref(element);
    else if (ref) ref.current = element;
    if (element === null || !focusOnMount || focused.current) return;
    focused.current = true;
    element.focus();
  };

  return (
    <Field {...field} label={label} labelVisibility={labelVisibility} hint={hint} error={error}>
      <Input {...props} {...control} ref={inputRef} className={input({ size, appearance, align })} />
    </Field>
  );
};
