"use client";

import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";

import { ConfirmDialog } from "@/shared/ui/ConfirmDialog";

type RemoveDialogProps = Omit<ComponentProps<typeof ConfirmDialog>, "title" | "confirmLabel" | "destructive"> & {
  // What is removed, as the user knows it: "Supprimer « {name} » ?".
  name: string;
};

// The confirmation of every removal, worded the same way everywhere.
export const RemoveDialog = ({ name, ...props }: RemoveDialogProps) => {
  const t = useTranslations("actions");

  return <ConfirmDialog {...props} title={t("removeTitle", { name })} confirmLabel={t("remove")} destructive />;
};
