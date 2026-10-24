import type { LucideIcon } from "lucide-react";
import type { ComponentProps } from "react";

import { Button as PrimitiveButton } from "@/shared/ui/primitives/button";
import type { Size } from "@/shared/ui/tokens";

const variants = { ghost: "ghost", destructive: "destructive" } as const satisfies {
  [variant: string]: ComponentProps<typeof PrimitiveButton>["variant"];
};

// Tied to the size tokens; the atom has no icon size beyond `lg`.
const sizes = {
  sm: "icon-sm",
  md: "icon",
  lg: "icon-lg",
} as const satisfies { readonly [K in Exclude<Size, "xl">]: ComponentProps<typeof PrimitiveButton>["size"] };

type IconButtonProps = Omit<ComponentProps<"button">, "className" | "style" | "children" | "aria-label"> & {
  readonly icon: LucideIcon;
  // Icon-only: the label is what assistive technologies announce.
  readonly label: string;
  readonly variant?: keyof typeof variants;
  readonly size?: keyof typeof sizes;
};

export const IconButton = ({
  icon: Icon,
  label,
  variant = "ghost",
  size = "md",
  type = "button",
  ...props
}: IconButtonProps) => (
  <PrimitiveButton
    {...props}
    type={type}
    variant={variants[variant]}
    size={sizes[size]}
    aria-label={label}
    title={label}
  >
    <Icon aria-hidden />
  </PrimitiveButton>
);
