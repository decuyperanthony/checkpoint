import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";

import type { Size, TokenClasses } from "@/shared/ui/tokens";

const stack = cva("flex", {
  variants: {
    direction: { column: "flex-col", row: "flex-row items-center" },
    gap: { sm: "gap-1", md: "gap-2", lg: "gap-4", xl: "gap-6" } satisfies TokenClasses<Size>,
    justify: { start: "justify-start", between: "justify-between" },
  },
  defaultVariants: { direction: "column", gap: "md", justify: "start" },
});

type StackProps = VariantProps<typeof stack> & {
  readonly children: ReactNode;
};

// Layout for features, which never write their own spacing classes.
export const Stack = ({ direction, gap, justify, children }: StackProps) => (
  <div className={stack({ direction, gap, justify })}>{children}</div>
);
