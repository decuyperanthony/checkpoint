import type { HTMLAttributes } from "react";

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

type TextElement = "p" | "span" | "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

// Every native attribute (`id`, `role`, `aria-*`…) except styling, which goes through the tokens.
type TextProps = Omit<HTMLAttributes<HTMLElement>, "className" | "style"> & {
  readonly as?: TextElement;
  readonly size?: Size;
  readonly tone?: keyof typeof tones;
};

// Text with design tokens, so features never write their own `<p>` or typography classes.
export const Text = ({ as: Element = "p", size = "md", tone = "default", ...props }: TextProps) => (
  <Element {...props} className={cn(sizes[size], tones[tone])} />
);
