import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";
import type { Size } from "@/shared/ui/tokens";

const directions = { column: "flex-col", row: "flex-row items-center" } as const;

const justifications = { start: "justify-start", between: "justify-between" } as const;

const gaps = { sm: "gap-1", md: "gap-2", lg: "gap-4", xl: "gap-6" } as const satisfies { [K in Size]: string };

type StackProps = {
  readonly direction?: keyof typeof directions;
  readonly gap?: Size;
  readonly justify?: keyof typeof justifications;
  readonly children: ReactNode;
};

// Layout for features, which never write their own spacing classes.
export const Stack = ({ direction = "column", gap = "md", justify = "start", children }: StackProps) => (
  <div className={cn("flex", directions[direction], gaps[gap], justifications[justify])}>{children}</div>
);
