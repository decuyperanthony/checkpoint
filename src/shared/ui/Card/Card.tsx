import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";

import { Card as PrimitiveCard, CardContent, CardHeader } from "@/shared/ui/primitives/card";

const card = cva("gap-3 py-5", {
  variants: {
    variant: {
      // A sheet of paper on the desk.
      raised: "shadow-xs ring-border",
      // A place for something not there yet.
      dashed: "bg-transparent py-3 shadow-none ring-0 border-2 border-dashed border-input",
    },
  },
  defaultVariants: { variant: "raised" },
});

type CardProps = VariantProps<typeof card> & {
  header?: ReactNode;
  children: ReactNode;
};

export const Card = ({ header, variant, children }: CardProps) => (
  <PrimitiveCard className={card({ variant })}>
    {header === undefined ? null : <CardHeader className="px-5">{header}</CardHeader>}
    <CardContent className="px-5">{children}</CardContent>
  </PrimitiveCard>
);
