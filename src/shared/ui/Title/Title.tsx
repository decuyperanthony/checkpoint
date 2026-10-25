import { cva, type VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import type { Size, TokenClasses } from "@/shared/ui/tokens";

const headings = { 2: "h2", 3: "h3", 4: "h4" } as const;

type HeadingLevel = keyof typeof headings;

const title = cva("flex min-w-0 items-center gap-2 font-heading leading-tight font-bold tracking-tight", {
  variants: {
    size: { sm: "text-base", md: "text-lg", lg: "text-xl", xl: "text-2xl" } satisfies TokenClasses<Size>,
  },
  defaultVariants: { size: "lg" },
});

const icon = cva("shrink-0 text-muted-foreground", {
  variants: {
    size: { sm: "size-4", md: "size-4", lg: "size-5", xl: "size-6" } satisfies TokenClasses<Size>,
  },
  defaultVariants: { size: "lg" },
});

type TitleProps = VariantProps<typeof title> & {
  // Decorative, before the text.
  icon?: LucideIcon | undefined;
  level?: HeadingLevel;
  children: ReactNode;
};

export const Title = ({ icon: Icon, level = 2, size, children }: TitleProps) => {
  const Heading = headings[level];

  return (
    <Heading className={title({ size })}>
      {Icon === undefined ? null : <Icon aria-hidden className={icon({ size })} />}
      {children}
    </Heading>
  );
};
