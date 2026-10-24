import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";
import type { Size } from "@/shared/ui/tokens";

const headings = { 2: "h2", 3: "h3", 4: "h4" } as const;

type HeadingLevel = keyof typeof headings;

const sizes = {
  sm: { text: "text-sm", icon: "size-4" },
  md: { text: "text-base", icon: "size-4" },
  lg: { text: "text-lg", icon: "size-5" },
  xl: { text: "text-xl", icon: "size-6" },
} as const satisfies { [K in Size]: { text: string; icon: string } };

type IconTitleProps = {
  readonly icon: LucideIcon;
  readonly level?: HeadingLevel;
  readonly size?: Size;
  readonly children: ReactNode;
};

export const IconTitle = ({ icon: Icon, level = 2, size = "lg", children }: IconTitleProps) => {
  const Heading = headings[level];

  return (
    <Heading className={cn("flex items-center gap-2 font-heading font-semibold", sizes[size].text)}>
      <Icon aria-hidden className={cn("shrink-0 text-muted-foreground", sizes[size].icon)} />
      {children}
    </Heading>
  );
};
