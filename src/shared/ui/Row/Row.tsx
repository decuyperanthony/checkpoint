import type { ReactNode } from "react";

type RowProps = {
  // Shown on hover or keyboard focus, and always on touch screens, where there is no hover.
  actions?: ReactNode;
  children: ReactNode;
};

// A line of a list: its content, then its actions, kept quiet until needed.
export const Row = ({ actions, children }: RowProps) => (
  <div className="group/row -mx-2 flex min-h-11 items-center gap-2 rounded-lg px-2 transition-colors hover:bg-muted/60">
    {children}
    {actions === undefined ? null : (
      <div className="opacity-0 transition-opacity group-hover/row:opacity-100 focus-within:opacity-100 has-data-[state=open]:opacity-100 pointer-coarse:opacity-100">
        {actions}
      </div>
    )}
  </div>
);
