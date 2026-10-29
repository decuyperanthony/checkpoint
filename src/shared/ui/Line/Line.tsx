import { cva } from "class-variance-authority";
import { PlusIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Accordion } from "@/shared/ui/Accordion";
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
  color: LineColor;
  children: ReactNode;
};

// The round badge naming a line, like a metro line's number. Decorative: the line's name says it.
export const LineBadge = ({ color, children }: LineBadgeProps) => (
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
  // Names the button that folds the stations away: "Stations de la ligne Courses".
  toggleLabel: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // Its stations.
  children: ReactNode;
};

// A section drawn as a metro line: its badge and name, then its stations along the track. Folded,
// only the badge, the name and its progress remain.
export const Line = ({
  color,
  number,
  header,
  aside,
  actions,
  toggleLabel,
  open,
  onOpenChange,
  children,
}: LineProps) => (
  <section className="flex flex-col">
    <Accordion
      toggleLabel={toggleLabel}
      open={open}
      onOpenChange={onOpenChange}
      title={
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
      }
    >
      {children}
    </Accordion>
  </section>
);

// The control that adds what is being typed: drawn as a dashed outline of the thing it makes,
// with a hit area of at least 44px around it for a thumb.
const adder =
  "relative grid shrink-0 place-items-center rounded-full border-dashed border-input bg-background text-muted-foreground transition-colors outline-none after:absolute hover:border-primary hover:text-primary focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50";

type AddButtonProps = {
  // What it adds, for assistive technologies: "Ajouter la station à la ligne Courses".
  label: string;
  disabled?: boolean;
};

// Where the next station goes: a dashed ring on the track that submits the field beside it.
export const NextStation = ({ label, disabled = false }: AddButtonProps) => (
  <button
    type="submit"
    aria-label={label}
    title={label}
    disabled={disabled}
    className={`${adder} size-5 border-2 after:-inset-3`}
  >
    <PlusIcon aria-hidden className="size-3" />
  </button>
);

type OpenLineProps = AddButtonProps & {
  // The field naming the new line.
  children: ReactNode;
};

// A line not opened yet: the dashed badge, which submits, on the start of a dashed track, then the
// field naming it.
export const OpenLine = ({ label, disabled = false, children }: OpenLineProps) => (
  <div className="flex flex-col">
    <div className="flex min-h-11 items-center gap-3">
      <button
        type="submit"
        aria-label={label}
        title={label}
        disabled={disabled}
        className={`${adder} -ml-1 size-7 border-2 after:-inset-2`}
      >
        <PlusIcon aria-hidden className="size-4" />
      </button>
      {children}
    </div>
    <span aria-hidden className="ml-2 h-8 w-0 border-l-4 border-dashed border-input" />
  </div>
);
