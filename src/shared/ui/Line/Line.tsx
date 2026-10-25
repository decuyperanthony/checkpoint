import { cva } from "class-variance-authority";
import { PlusIcon } from "lucide-react";
import type { ReactNode } from "react";

import type { LineColor, TokenClasses } from "@/shared/ui/tokens";

const badge = cva("-ml-1 grid size-7 shrink-0 place-items-center rounded-full text-sm font-bold tabular-nums", {
  variants: {
    color: {
      green: "bg-line-green text-line-green-foreground",
      blue: "bg-line-blue text-line-blue-foreground",
      magenta: "bg-line-magenta text-line-magenta-foreground",
      orange: "bg-line-orange text-line-orange-foreground",
      yellow: "bg-line-yellow text-line-yellow-foreground",
      sky: "bg-line-sky text-line-sky-foreground",
    } satisfies TokenClasses<LineColor>,
  },
});

type LineBadgeProps = {
  // Without a colour, the badge of a line not opened yet: dashed, with a plus.
  color?: LineColor | undefined;
  children?: ReactNode;
};

// The round badge naming a line, like a metro line's number. Decorative: the line's name says it.
export const LineBadge = ({ color, children }: LineBadgeProps) =>
  color === undefined ? (
    <span
      aria-hidden
      className="-ml-1 grid size-7 shrink-0 place-items-center rounded-full border-2 border-dashed border-input text-muted-foreground"
    >
      <PlusIcon className="size-4" />
    </span>
  ) : (
    <span aria-hidden className={badge({ color })}>
      {children}
    </span>
  );

type LineProps = {
  color: LineColor;
  // Its place on the map, shown in the badge.
  number: number;
  // The line's name, or the field renaming it.
  header: ReactNode;
  // After the name: what the line knows about itself (its progress).
  aside?: ReactNode;
  // Its menu: shown on hover or keyboard focus, and always on touch screens.
  actions?: ReactNode;
  // Its stations.
  children: ReactNode;
};

// A section drawn as a metro line: its badge and name, then its stations along the track.
export const Line = ({ color, number, header, aside, actions, children }: LineProps) => (
  <section className="flex flex-col">
    <div className="group/line flex min-h-11 items-center gap-3">
      <LineBadge color={color}>{number}</LineBadge>
      <div className="min-w-0 flex-1">{header}</div>
      {aside}
      {actions === undefined ? null : (
        <div className="opacity-0 transition-opacity group-hover/line:opacity-100 focus-within:opacity-100 has-data-[state=open]:opacity-100 pointer-coarse:opacity-100">
          {actions}
        </div>
      )}
    </div>
    {children}
  </section>
);

// Where the next station goes: a dashed ring on the track, in front of the field that adds it.
export const NextStation = () => (
  <span
    aria-hidden
    className="relative grid size-5 shrink-0 place-items-center rounded-full border-2 border-dashed border-input bg-background text-muted-foreground"
  >
    <PlusIcon className="size-3" />
  </span>
);

// A line not opened yet: the dashed badge on the start of a dashed track, then the field naming it.
export const OpenLine = ({ children }: { children: ReactNode }) => (
  <div className="flex flex-col">
    <div className="flex min-h-11 items-center gap-3">
      <LineBadge />
      {children}
    </div>
    <span aria-hidden className="ml-2 h-8 w-0 border-l-4 border-dashed border-input" />
  </div>
);
