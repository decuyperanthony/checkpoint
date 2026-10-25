import type { Metadata } from "next";
import { Geist, Instrument_Serif } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";
import { QueryProvider } from "@/shared/ui/QueryProvider";
import { ThemeProvider } from "@/shared/ui/ThemeProvider";
import { Toaster } from "@/shared/ui/Toaster";

import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
// Titles only: the app's name, sections, the PIN screen.
const instrumentSerif = Instrument_Serif({ subsets: ["latin"], weight: "400", variable: "--font-serif" });

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations("app");
  return { title: t("title"), description: t("description") };
};

type RootLayoutProps = {
  children: ReactNode;
};

const RootLayout = async ({ children }: RootLayoutProps) => {
  const locale = await getLocale();

  return (
    // next-themes sets the theme class before hydration, which React would otherwise report.
    <html lang={locale} className={cn("font-sans", geist.variable, instrumentSerif.variable)} suppressHydrationWarning>
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
