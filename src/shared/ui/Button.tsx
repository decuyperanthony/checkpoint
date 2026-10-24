import type { ComponentProps } from "react";

import { Button as PrimitiveButton } from "@/shared/ui/primitives/button";
import type { Size } from "@/shared/ui/tokens";

type PrimitiveProps = ComponentProps<typeof PrimitiveButton>;

const variants = {
  primary: "default",
  secondary: "secondary",
  ghost: "ghost",
  destructive: "destructive",
} as const satisfies { [variant: string]: PrimitiveProps["variant"] };

type ButtonVariant = keyof typeof variants;

// The atom stops at `lg`; `xl` extends it with the next steps of the spacing scale.
const sizes = {
  sm: { size: "sm", className: undefined },
  md: { size: "default", className: undefined },
  lg: { size: "lg", className: undefined },
  xl: { size: "lg", className: "h-10 px-4 text-base" },
} as const satisfies { [K in Size]: { size: PrimitiveProps["size"]; className: string | undefined } };

type ButtonProps = Omit<ComponentProps<"button">, "className" | "style"> & {
  readonly variant?: ButtonVariant;
  readonly size?: Size;
};

export const Button = ({ variant = "primary", size = "md", type = "button", ...props }: ButtonProps) => (
  <PrimitiveButton
    {...props}
    type={type}
    variant={variants[variant]}
    size={sizes[size].size}
    className={sizes[size].className}
  />
);
