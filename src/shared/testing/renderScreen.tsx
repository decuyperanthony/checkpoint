import { render } from "@testing-library/react";
import type { ReactNode } from "react";

import { TestIntl } from "@/shared/testing/renderWithIntl";
import { QueryProvider } from "@/shared/ui/QueryProvider";
import { ScreenBoundary } from "@/shared/ui/ScreenBoundary";
import { Toaster } from "@/shared/ui/Toaster";

// Renders a screen with the same providers as the app, for UI tests.
export const renderScreen = (screen: ReactNode) =>
  render(
    <TestIntl>
      <QueryProvider>
        <ScreenBoundary>{screen}</ScreenBoundary>
      </QueryProvider>
      <Toaster />
    </TestIntl>,
  );
