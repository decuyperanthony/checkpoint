"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { useId, type ReactNode } from "react";

import { Checkbox as PrimitiveCheckbox } from "@/shared/ui/primitives/checkbox";
import { Label } from "@/shared/ui/primitives/label";

const labelStyle = cva("", {
  variants: {
    checkedStyle: {
      plain: "",
      strikethrough: "peer-data-[state=checked]:text-muted-foreground peer-data-[state=checked]:line-through",
    },
  },
  defaultVariants: { checkedStyle: "plain" },
});

type CheckboxProps = VariantProps<typeof labelStyle> & {
  label: ReactNode;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  // While a change is being saved: further changes are ignored, but unlike `disabled` the
  // checkbox keeps keyboard focus.
  pending?: boolean;
};

export const Checkbox = ({
  label,
  checked,
  onCheckedChange,
  checkedStyle,
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
      <Label htmlFor={id} className={labelStyle({ checkedStyle })}>
        {label}
      </Label>
    </div>
  );
};
