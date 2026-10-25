import { cva } from "class-variance-authority";
import type { ReactNode } from "react";

import type { LineColor, TokenClasses } from "@/shared/ui/tokens";

// A leg of track: already travelled (the station before it is checked), still ahead, or none.
export type Leg = "travelled" | "ahead" | "none";

// Each half of the track is a faint base with the travelled colour laid over it. Checking a
// station draws that colour out of it: the leaving half grows down, then the arriving half of the
// next station follows; unchecking runs the same draw backwards (200ms, instant under reduced
// motion).
const base = cva("absolute left-4 w-1", {
  variants: {
    half: { in: "top-0 h-1/2", out: "top-1/2 h-1/2" },
    color: {
      green: "bg-line-green/25",
      blue: "bg-line-blue/25",
      magenta: "bg-line-magenta/25",
      orange: "bg-line-orange/25",
      yellow: "bg-line-yellow/30",
      sky: "bg-line-sky/30",
    } satisfies TokenClasses<LineColor>,
  },
});

const travelled = cva(
  "absolute left-4 w-1 origin-top transition-transform duration-100 ease-out motion-reduce:transition-none",
  {
    variants: {
      half: { in: "top-0 h-1/2", out: "top-1/2 h-1/2" },
      drawn: { true: "scale-y-100", false: "scale-y-0" },
      color: {
        green: "bg-line-green",
        blue: "bg-line-blue",
        magenta: "bg-line-magenta",
        orange: "bg-line-orange",
        yellow: "bg-line-yellow",
        sky: "bg-line-sky",
      } satisfies TokenClasses<LineColor>,
    },
    // The second half to move waits for the first: drawing runs out of the station then into the
    // next one; clearing runs back from the next station into this one.
    compoundVariants: [
      { half: "in", drawn: true, class: "delay-100" },
      { half: "out", drawn: false, class: "delay-100" },
    ],
  },
);

const Half = ({ color, half, state }: { color: LineColor; half: "in" | "out"; state: Leg }) =>
  state === "none" ? null : (
    <>
      <span aria-hidden className={base({ half, color })} />
      <span aria-hidden className={travelled({ half, color, drawn: state === "travelled" })} />
    </>
  );

type Rail = { color: LineColor; in: Leg; out: Leg };

type RowProps = {
  // The track through the row's station: the leg arriving and the leg leaving.
  rail?: Rail | undefined;
  // Shown on hover or keyboard focus, and always on touch screens, where there is no hover.
  actions?: ReactNode;
  children: ReactNode;
};

// A line of a list: its content, then its actions, kept quiet until needed. On a line, the
// track runs behind its first element, the station.
export const Row = ({ rail, actions, children }: RowProps) => (
  <div className="group/row relative -mx-2 flex min-h-11 items-center gap-2 rounded-lg px-2 transition-colors hover:bg-muted/60">
    {rail === undefined ? null : (
      <>
        <Half color={rail.color} half="in" state={rail.in} />
        <Half color={rail.color} half="out" state={rail.out} />
      </>
    )}
    {children}
    {actions === undefined ? null : (
      <div className="opacity-0 transition-opacity group-hover/row:opacity-100 focus-within:opacity-100 has-data-[state=open]:opacity-100 pointer-coarse:opacity-100">
        {actions}
      </div>
    )}
  </div>
);
