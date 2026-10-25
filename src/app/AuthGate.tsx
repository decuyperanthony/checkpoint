"use client";

import { useTranslations } from "next-intl";

import { useSession } from "@/features/auth/api/auth";
import { PinForm } from "@/features/auth/ui/PinForm";
import { Panel } from "@/shared/ui/Panel";
import { ScreenBoundary } from "@/shared/ui/ScreenBoundary";

import Board from "./Board";

const PinScreen = () => {
  const t = useTranslations("auth");

  return (
    <Panel title={t("title")} description={t("description")}>
      <PinForm />
    </Panel>
  );
};

// The PIN until the session is open; back to the PIN as soon as it ends, from anywhere.
const Gate = () => {
  const { data: session } = useSession();

  return session === "open" ? <Board /> : <PinScreen />;
};

const AuthGate = () => (
  <ScreenBoundary>
    <Gate />
  </ScreenBoundary>
);

export default AuthGate;
