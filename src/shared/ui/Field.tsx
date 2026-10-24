"use client";

import { useId, type ReactNode } from "react";

import { Label } from "@/shared/ui/primitives/label";

// Props a control needs to be labelled and described by its field.
export type FieldControlProps = {
  readonly id: string;
  readonly "aria-invalid": boolean;
  readonly "aria-describedby": string | undefined;
};

type LabelVisibility = "visible" | "hidden";

export type FieldProps = {
  readonly label: ReactNode;
  readonly labelVisibility?: LabelVisibility | undefined;
  readonly error?: string | undefined;
  readonly children: (control: FieldControlProps) => ReactNode;
};

export const Field = ({ label, labelVisibility = "visible", error, children }: FieldProps) => {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} className={labelVisibility === "hidden" ? "sr-only" : undefined}>
        {label}
      </Label>
      {children({
        id,
        "aria-invalid": error !== undefined,
        "aria-describedby": error === undefined ? undefined : errorId,
      })}
      {error === undefined ? null : (
        <p id={errorId} className="text-sm text-error">
          {error}
        </p>
      )}
    </div>
  );
};
