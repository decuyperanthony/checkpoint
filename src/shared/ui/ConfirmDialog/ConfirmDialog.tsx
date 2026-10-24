"use client";

import { useTranslations } from "next-intl";
import type { RefObject } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/primitives/alert-dialog";

type ConfirmDialogProps = {
  // Opened by its owner, e.g. from a menu: the dialog has no button of its own.
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // Where keyboard focus goes back once closed, usually the menu that opened it: the menu item
  // itself is gone by then.
  returnFocusTo?: RefObject<HTMLElement | null>;
  title: string;
  description: string;
  confirmLabel: string;
  destructive?: boolean;
  onConfirm: () => void;
};

// A modal that asks before an action: only confirming runs it, Cancel or Escape close it.
export const ConfirmDialog = ({
  open,
  onOpenChange,
  returnFocusTo,
  title,
  description,
  confirmLabel,
  destructive = false,
  onConfirm,
}: ConfirmDialogProps) => {
  const t = useTranslations("actions");

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        onCloseAutoFocus={(event) => {
          const target = returnFocusTo?.current;
          if (!target) return;
          event.preventDefault();
          target.focus();
        }}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
          <AlertDialogAction variant={destructive ? "destructive" : "default"} onClick={onConfirm}>
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
