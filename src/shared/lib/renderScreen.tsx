import { render } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";

import messages from "@/shared/i18n/messages/fr.json";
import { QueryProvider } from "@/shared/ui/QueryProvider";
import { ScreenBoundary } from "@/shared/ui/ScreenBoundary";
import { Toaster } from "@/shared/ui/Toaster";

// Renders a screen with the same providers as the app, for UI tests.
export const renderScreen = (screen: ReactNode) =>
  render(
    <NextIntlClientProvider locale="fr" messages={messages} timeZone="Europe/Paris">
      <QueryProvider>
        <ScreenBoundary>{screen}</ScreenBoundary>
      </QueryProvider>
      <Toaster />
    </NextIntlClientProvider>,
  );
