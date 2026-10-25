"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { useId, type ReactNode } from "react";

import { Checkbox as PrimitiveCheckbox } from "@/shared/ui/primitives/checkbox";
import { Label } from "@/shared/ui/primitives/label";
import type { LineColor, TokenClasses } from "@/shared/ui/tokens";

// On a line, the box is a station: a ring in the line's colour that fills once checked. Its ground
// hides the track running behind it.
const box = cva("size-5 rounded-full", {
  variants: {
    station: {
      green:
        "border-4 border-line-green bg-background text-line-green-foreground data-checked:border-line-green data-checked:bg-line-green dark:bg-background dark:data-checked:bg-line-green",
      blue: "border-4 border-line-blue bg-background text-line-blue-foreground data-checked:border-line-blue data-checked:bg-line-blue dark:bg-background dark:data-checked:bg-line-blue",
      magenta:
        "border-4 border-line-magenta bg-background text-line-magenta-foreground data-checked:border-line-magenta data-checked:bg-line-magenta dark:bg-background dark:data-checked:bg-line-magenta",
      orange:
        "border-4 border-line-orange bg-background text-line-orange-foreground data-checked:border-line-orange data-checked:bg-line-orange dark:bg-background dark:data-checked:bg-line-orange",
      yellow:
        "border-4 border-line-yellow bg-background text-line-yellow-foreground data-checked:border-line-yellow data-checked:bg-line-yellow dark:bg-background dark:data-checked:bg-line-yellow",
      sky: "border-4 border-line-sky bg-background text-line-sky-foreground data-checked:border-line-sky data-checked:bg-line-sky dark:bg-background dark:data-checked:bg-line-sky",
    } satisfies TokenClasses<LineColor>,
  },
});

// The whole line is the label, so the text toggles too.
const labelStyle = cva("min-w-0 flex-1 cursor-pointer py-2 text-base leading-snug font-normal transition-colors", {
  variants: {
    checkedStyle: {
      plain: "",
      strikethrough:
        "peer-data-[state=checked]:text-muted-foreground peer-data-[state=checked]:line-through peer-data-[state=checked]:decoration-muted-foreground/60",
    },
  },
  defaultVariants: { checkedStyle: "plain" },
});

type CheckboxProps = VariantProps<typeof labelStyle> & {
  // Drawn as a station of this line.
  station?: LineColor | undefined;
  label: ReactNode;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
};

export const Checkbox = ({
  label,
  checked,
  onCheckedChange,
  checkedStyle,
  station,
  disabled = false,
}: CheckboxProps) => {
  const id = useId();

  return (
    <div className="flex min-w-0 flex-1 items-center gap-3">
      <PrimitiveCheckbox
        id={id}
        className={box({ station })}
        checked={checked}
        disabled={disabled}
        onCheckedChange={(state) => onCheckedChange(state === true)}
      />
      <Label htmlFor={id} className={labelStyle({ checkedStyle })}>
        {label}
      </Label>
    </div>
  );
};
