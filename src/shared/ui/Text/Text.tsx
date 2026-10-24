import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";

import { tones, type Size, type TokenClasses } from "@/shared/ui/tokens";

// Text adds two tones to the shared ones: its container's colour, and a quieter one.
export const textTones = ["default", "muted", ...tones] as const;
export type TextTone = (typeof textTones)[number];

const text = cva("", {
  variants: {
    size: { sm: "text-sm", md: "text-base", lg: "text-lg", xl: "text-xl" } satisfies TokenClasses<Size>,
    tone: {
      // Inherits the colour of its container (a card, a button…).
      default: "",
      muted: "text-muted-foreground",
      info: "text-info",
      success: "text-success",
      warning: "text-warning",
      error: "text-error",
    } satisfies TokenClasses<TextTone>,
  },
  defaultVariants: { size: "md", tone: "default" },
});

type TextElement = "p" | "span" | "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

// Every native attribute (`id`, `role`, `aria-*`…) except styling, which goes through the tokens.
type TextProps = Omit<HTMLAttributes<HTMLElement>, "className" | "style"> &
  VariantProps<typeof text> & {
    readonly as?: TextElement;
  };

// Text with design tokens, so features never write their own `<p>` or typography classes.
export const Text = ({ as: Element = "p", size, tone, ...props }: TextProps) => (
  <Element {...props} className={text({ size, tone })} />
);
