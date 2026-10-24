import { useId, type ReactNode } from "react";

import { Label } from "@/shared/ui/primitives/label";
import { Text } from "@/shared/ui/Text";

type LabelVisibility = "visible" | "hidden";

// Ids linking a field's label and error to its control, and the attributes the control needs.
export const useField = (error: string | undefined) => {
  const id = useId();
  const errorId = `${id}-error`;

  return {
    field: { id, errorId },
    control: {
      id,
      "aria-invalid": error !== undefined,
      "aria-describedby": error === undefined ? undefined : errorId,
    },
  };
};

export type FieldProps = {
  readonly label: ReactNode;
  readonly labelVisibility?: LabelVisibility | undefined;
  readonly error?: string | undefined;
};

type FieldLayoutProps = FieldProps &
  ReturnType<typeof useField>["field"] & {
    // The control, spread with `useField`'s `control` attributes.
    readonly children: ReactNode;
  };

// A label, a control and its error, stacked.
export const Field = ({ id, errorId, label, labelVisibility = "visible", error, children }: FieldLayoutProps) => (
  <div className="flex flex-col gap-2">
    <Label htmlFor={id} className={labelVisibility === "hidden" ? "sr-only" : undefined}>
      {label}
    </Label>
    {children}
    {error === undefined ? null : (
      <Text id={errorId} role="alert" size="sm" tone="error">
        {error}
      </Text>
    )}
  </div>
);
