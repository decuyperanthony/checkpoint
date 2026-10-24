import type { LucideIcon } from "lucide-react";
import type { ComponentProps } from "react";

import { Button as PrimitiveButton } from "@/shared/ui/primitives/button";

const sizes = {
  sm: "icon-sm",
  md: "icon",
  lg: "icon-lg",
} as const;

type IconButtonProps = Omit<ComponentProps<"button">, "className" | "style" | "children" | "aria-label"> & {
  readonly icon: LucideIcon;
  // Icon-only: the label is what assistive technologies announce.
  readonly label: string;
  readonly variant?: "ghost" | "destructive";
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
  <PrimitiveButton {...props} type={type} variant={variant} size={sizes[size]} aria-label={label} title={label}>
    <Icon aria-hidden />
  </PrimitiveButton>
);
