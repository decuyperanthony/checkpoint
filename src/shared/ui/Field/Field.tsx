import { useId, type ReactNode } from "react";

import { Label } from "@/shared/ui/primitives/label";
import { Text } from "@/shared/ui/Text";

type LabelVisibility = "visible" | "hidden";

// Ids linking a field's label, hint and error to its control, and the attributes the control needs.
export const useField = ({ hint, error }: Pick<FieldProps, "hint" | "error">) => {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint === undefined ? [] : [hintId], error === undefined ? [] : [errorId]].flat();

  return {
    field: { id, hintId, errorId },
    control: {
      id,
      "aria-invalid": error !== undefined,
      "aria-describedby": describedBy.length === 0 ? undefined : describedBy.join(" "),
    },
  };
};

export type FieldProps = {
  label: ReactNode;
  labelVisibility?: LabelVisibility | undefined;
  // What the value must look like, always shown under the control.
  hint?: string | undefined;
  error?: string | undefined;
};

type FieldLayoutProps = FieldProps &
  ReturnType<typeof useField>["field"] & {
    // The control, spread with `useField`'s `control` attributes.
    children: ReactNode;
  };

// A label, a control, its hint and its error, stacked.
export const Field = ({
  id,
  hintId,
  errorId,
  label,
  labelVisibility = "visible",
  hint,
  error,
  children,
}: FieldLayoutProps) => (
  <div className="flex flex-col gap-2">
    <Label htmlFor={id} className={labelVisibility === "hidden" ? "sr-only" : undefined}>
      {label}
    </Label>
    {children}
    {hint === undefined ? null : (
      <Text id={hintId} size="sm" tone="muted">
        {hint}
      </Text>
    )}
    {error === undefined ? null : (
      <Text id={errorId} role="alert" size="sm" tone="error">
        {error}
      </Text>
    )}
  </div>
);
