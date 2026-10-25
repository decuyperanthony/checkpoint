import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible_Next } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";
import { QueryProvider } from "@/shared/ui/QueryProvider";
import { ThemeProvider } from "@/shared/ui/ThemeProvider";
import { Toaster } from "@/shared/ui/Toaster";

import "./globals.css";

// Signage type: drawn for legibility, one face at every level.
const atkinson = Atkinson_Hyperlegible_Next({ subsets: ["latin", "latin-ext"], variable: "--font-sans" });

// The browser chrome takes the ground of the current theme (signage white, night map).
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fcfcfd" },
    { media: "(prefers-color-scheme: dark)", color: "#0c1016" },
  ],
};

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations("app");
  return { title: t("title"), description: t("description"), appleWebApp: { title: t("title"), capable: true } };
};

type RootLayoutProps = {
  children: ReactNode;
};

const RootLayout = async ({ children }: RootLayoutProps) => {
  const locale = await getLocale();

  return (
    // next-themes sets the theme class before hydration, which React would otherwise report.
    <html lang={locale} className={cn("font-sans", atkinson.variable)} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider>
          <ThemeProvider>
            <QueryProvider>{children}</QueryProvider>
            <Toaster />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

export default RootLayout;
