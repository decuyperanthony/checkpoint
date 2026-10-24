import type { ReactNode } from "react";

import { Card as PrimitiveCard, CardContent, CardHeader } from "@/shared/ui/primitives/card";

type CardProps = {
  header?: ReactNode;
  children: ReactNode;
};

export const Card = ({ header, children }: CardProps) => (
  <PrimitiveCard>
    {header === undefined ? null : <CardHeader>{header}</CardHeader>}
    <CardContent>{children}</CardContent>
  </PrimitiveCard>
);
