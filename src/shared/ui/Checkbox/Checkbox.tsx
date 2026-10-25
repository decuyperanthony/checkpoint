"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { useId, type ReactNode } from "react";

import { Checkbox as PrimitiveCheckbox } from "@/shared/ui/primitives/checkbox";
import { Label } from "@/shared/ui/primitives/label";

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
  label: ReactNode;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
};

export const Checkbox = ({ label, checked, onCheckedChange, checkedStyle, disabled = false }: CheckboxProps) => {
  const id = useId();

  return (
    <div className="flex min-w-0 flex-1 items-center gap-3">
      <PrimitiveCheckbox
        id={id}
        className="size-5 rounded-full"
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
