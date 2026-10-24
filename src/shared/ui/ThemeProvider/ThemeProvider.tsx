"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

type ThemeProviderProps = {
  children: ReactNode;
};

// Follows the system theme until the user picks one; the `.dark` class drives the dark tokens.
export const ThemeProvider = ({ children }: ThemeProviderProps) => (
  <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
    {children}
  </NextThemesProvider>
);
