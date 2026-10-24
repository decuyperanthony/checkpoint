"use client";

import { useId, type ReactNode } from "react";

import { Checkbox as PrimitiveCheckbox } from "@/shared/ui/primitives/checkbox";
import { Label } from "@/shared/ui/primitives/label";

type CheckedStyle = "plain" | "strikethrough";

const labelStyles = {
  plain: undefined,
  strikethrough: "peer-data-[state=checked]:text-muted-foreground peer-data-[state=checked]:line-through",
} as const satisfies { [K in CheckedStyle]: string | undefined };

type CheckboxProps = {
  readonly label: ReactNode;
  readonly checked: boolean;
  readonly onCheckedChange: (checked: boolean) => void;
  readonly checkedStyle?: CheckedStyle;
  readonly disabled?: boolean;
};

export const Checkbox = ({
  label,
  checked,
  onCheckedChange,
  checkedStyle = "plain",
  disabled = false,
}: CheckboxProps) => {
  const id = useId();

  return (
    <div className="flex items-center gap-3">
      <PrimitiveCheckbox
        id={id}
        checked={checked}
        disabled={disabled}
        onCheckedChange={(state) => onCheckedChange(state === true)}
      />
      <Label htmlFor={id} className={labelStyles[checkedStyle]}>
        {label}
      </Label>
    </div>
  );
};
