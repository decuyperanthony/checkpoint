"use client";

import { useId, type ReactNode } from "react";

import { Checkbox as PrimitiveCheckbox } from "@/shared/ui/primitives/checkbox";
import { Label } from "@/shared/ui/primitives/label";

const labelStyles = {
  plain: undefined,
  strikethrough: "peer-data-[state=checked]:text-muted-foreground peer-data-[state=checked]:line-through",
} as const;

type CheckedStyle = keyof typeof labelStyles;

type CheckboxProps = {
  readonly label: ReactNode;
  readonly checked: boolean;
  readonly onCheckedChange: (checked: boolean) => void;
  readonly checkedStyle?: CheckedStyle;
  readonly disabled?: boolean;
  // While a change is being saved: further changes are ignored, but unlike `disabled` the
  // checkbox keeps keyboard focus.
  readonly pending?: boolean;
};

export const Checkbox = ({
  label,
  checked,
  onCheckedChange,
  checkedStyle = "plain",
  disabled = false,
  pending = false,
}: CheckboxProps) => {
  const id = useId();

  return (
    <div className="flex items-center gap-3">
      <PrimitiveCheckbox
        id={id}
        checked={checked}
        disabled={disabled}
        aria-disabled={pending}
        onCheckedChange={(state) => {
          if (!pending) onCheckedChange(state === true);
        }}
      />
      <Label htmlFor={id} className={labelStyles[checkedStyle]}>
        {label}
      </Label>
    </div>
  );
};
