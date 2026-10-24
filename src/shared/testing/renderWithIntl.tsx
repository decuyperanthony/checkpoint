import { render } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";

import messages from "@/shared/i18n/messages/fr.json";

// The app's French messages around a component, for design-system tests.
export const TestIntl = ({ children }: { readonly children: ReactNode }) => (
  <NextIntlClientProvider locale="fr" messages={messages} timeZone="Europe/Paris">
    {children}
  </NextIntlClientProvider>
);

export const renderWithIntl = (ui: ReactNode) => render(<TestIntl>{ui}</TestIntl>);
