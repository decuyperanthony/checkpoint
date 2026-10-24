"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

// The one place notifications are rendered, following the active theme (colours: globals.css).
export const Toaster = () => {
  const { resolvedTheme } = useTheme();

  return <Sonner theme={resolvedTheme === "dark" ? "dark" : "light"} />;
};

export { toast } from "sonner";
