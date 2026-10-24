"use client";

import { useSession } from "@/features/auth/api/auth";
import { PinForm } from "@/features/auth/ui/PinForm";
import { ScreenBoundary } from "@/shared/ui/ScreenBoundary";

import Board from "./Board";

// The PIN until the session is open; back to the PIN as soon as it ends, from anywhere.
const Gate = () => {
  const { data: session } = useSession();

  return session === "open" ? <Board /> : <PinForm />;
};

const AuthGate = () => (
  <ScreenBoundary>
    <Gate />
  </ScreenBoundary>
);

export default AuthGate;
