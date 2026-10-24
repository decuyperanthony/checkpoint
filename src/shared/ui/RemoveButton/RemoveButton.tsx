"use client";

import { Trash2Icon } from "lucide-react";
import { useTranslations } from "next-intl";

import { ConfirmDialog } from "@/shared/ui/ConfirmDialog";
import { IconButton } from "@/shared/ui/IconButton";

type RemoveButtonProps = {
  // What is removed, as the user knows it: "Supprimer « {name} » ?".
  readonly name: string;
  readonly label: string;
  readonly description: string;
  readonly disabled?: boolean;
  readonly onConfirm: () => void;
};

// The trash button of every removable thing, behind a confirmation.
export const RemoveButton = ({ name, label, description, disabled = false, onConfirm }: RemoveButtonProps) => {
  const t = useTranslations("actions");

  return (
    <ConfirmDialog
      trigger={<IconButton icon={Trash2Icon} label={label} variant="destructive" disabled={disabled} />}
      title={t("removeTitle", { name })}
      description={description}
      confirmLabel={t("remove")}
      destructive
      onConfirm={onConfirm}
    />
  );
};
