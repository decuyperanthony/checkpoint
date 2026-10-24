import { cva, type VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import type { Size, TokenClasses } from "@/shared/ui/tokens";

const headings = { 2: "h2", 3: "h3", 4: "h4" } as const;

type HeadingLevel = keyof typeof headings;

const title = cva("flex items-center gap-2 font-heading font-semibold", {
  variants: {
    size: { sm: "text-sm", md: "text-base", lg: "text-lg", xl: "text-xl" } satisfies TokenClasses<Size>,
  },
  defaultVariants: { size: "lg" },
});

const icon = cva("shrink-0 text-muted-foreground", {
  variants: {
    size: { sm: "size-4", md: "size-4", lg: "size-5", xl: "size-6" } satisfies TokenClasses<Size>,
  },
  defaultVariants: { size: "lg" },
});

type IconTitleProps = VariantProps<typeof title> & {
  icon: LucideIcon;
  level?: HeadingLevel;
  children: ReactNode;
};

export const IconTitle = ({ icon: Icon, level = 2, size, children }: IconTitleProps) => {
  const Heading = headings[level];

  return (
    <Heading className={title({ size })}>
      <Icon aria-hidden className={icon({ size })} />
      {children}
    </Heading>
  );
};
