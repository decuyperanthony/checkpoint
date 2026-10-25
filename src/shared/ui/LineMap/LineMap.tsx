import type { ReactNode } from "react";

type LineMapProps = {
  children: ReactNode;
};

// The lines laid out like a map: one column on phones, two side by side from 1024px, each line
// kept whole in its column.
export const LineMap = ({ children }: LineMapProps) => (
  <div className="gap-x-16 lg:columns-2 *:mb-12 *:break-inside-avoid">{children}</div>
);
