"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/shared/ui/Button";

type EditActionsProps = {
  readonly pending: boolean;
  readonly onCancel: () => void;
};

// Save and Cancel, after a value edited in place. Save submits the surrounding form.
export const EditActions = ({ pending, onCancel }: EditActionsProps) => {
  const t = useTranslations("actions");

  return (
    <>
      <Button type="submit" disabled={pending}>
        {t("save")}
      </Button>
      <Button variant="ghost" onClick={onCancel}>
        {t("cancel")}
      </Button>
    </>
  );
};
