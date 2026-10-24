import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Geist } from "next/font/google";

import { cn } from "@/shared/lib/cn";

import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "checkpoint",
  description: "A single-page checklist, organised in sections.",
};

type RootLayoutProps = {
  readonly children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProps) => (
  <html lang="fr" className={cn("font-sans", geist.variable)}>
    <body>{children}</body>
  </html>
);

export default RootLayout;
