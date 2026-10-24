"use client";

import type { LucideIcon } from "lucide-react";

import { IconButton } from "@/shared/ui/IconButton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/ui/primitives/alert-dialog";

type ConfirmIconButtonProps = {
  readonly icon: LucideIcon;
  readonly label: string;
  readonly title: string;
  readonly description: string;
  readonly confirmLabel: string;
  readonly cancelLabel: string;
  readonly disabled?: boolean;
  readonly onConfirm: () => void;
};

// For destructive actions: the icon button opens a dialog, and only confirming runs the action.
export const ConfirmIconButton = ({
  icon,
  label,
  title,
  description,
  confirmLabel,
  cancelLabel,
  disabled = false,
  onConfirm,
}: ConfirmIconButtonProps) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <IconButton icon={icon} label={label} variant="destructive" disabled={disabled} />
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>{description}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
        <AlertDialogAction variant="destructive" onClick={onConfirm}>
          {confirmLabel}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);
