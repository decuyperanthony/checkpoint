"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

// The one place notifications are rendered. Styled with tokens, following the active theme.
export const Toaster = () => {
  const { resolvedTheme } = useTheme();

  return (
    <Sonner
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      toastOptions={{
        classNames: {
          toast: "border-border bg-popover text-popover-foreground",
          error: "text-error",
        },
      }}
    />
  );
};

export { toast } from "sonner";
