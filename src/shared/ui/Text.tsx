import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";
import type { Size, Tone } from "@/shared/ui/tokens";

const sizes = { sm: "text-sm", md: "text-base", lg: "text-lg", xl: "text-xl" } as const satisfies {
  [K in Size]: string;
};

// `default` inherits the colour of its container (a card, a button…).
const tones = {
  default: undefined,
  muted: "text-muted-foreground",
  info: "text-info",
  success: "text-success",
  warning: "text-warning",
  error: "text-error",
} as const satisfies { [K in "default" | "muted" | Tone]: string | undefined };

type TextProps = {
  readonly size?: Size;
  readonly tone?: keyof typeof tones;
  // `alert` makes screen readers announce the text as soon as it appears.
  readonly role?: "alert";
  readonly id?: string;
  readonly children: ReactNode;
};

// A paragraph, so features never write their own `<p>` or typography classes.
export const Text = ({ size = "md", tone = "default", role, id, children }: TextProps) => (
  <p id={id} role={role} className={cn(sizes[size], tones[tone])}>
    {children}
  </p>
);
