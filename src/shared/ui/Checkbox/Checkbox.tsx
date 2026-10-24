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
};

export const Checkbox = ({ label, checked, onCheckedChange, checkedStyle, disabled = false }: CheckboxProps) => {
  const id = useId();

  return (
    <div className="flex items-center gap-3">
      <PrimitiveCheckbox
        id={id}
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
