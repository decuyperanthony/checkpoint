"use client";

import { LogOutIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { useLogout, useSessionOpen } from "@/features/auth/api/auth";
import { IconButton } from "@/shared/ui/IconButton";

// Only once logged in: before that, there is nothing to leave.
export const LogoutButton = () => {
  const t = useTranslations("auth");
  const open = useSessionOpen();
  const logout = useLogout();

  if (!open) return null;

  return (
    <IconButton icon={LogOutIcon} label={t("logout")} disabled={logout.isPending} onClick={() => logout.mutate()} />
  );
};
