"use client";

import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Suspense, type ReactNode } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";

import { Button } from "@/shared/ui/Button";
import { ErrorMessage } from "@/shared/ui/ErrorMessage";
import { Stack } from "@/shared/ui/Stack";

const ScreenError = ({ error, resetErrorBoundary }: FallbackProps) => {
  const t = useTranslations();

  return (
    <Stack gap="lg">
      <p role="alert">
        <ErrorMessage error={error} />
      </p>
      <Button variant="secondary" onClick={resetErrorBoundary}>
        {t("screen.retry")}
      </Button>
    </Stack>
  );
};

export const ScreenLoading = () => {
  const t = useTranslations("screen");

  return <output>{t("loading")}</output>;
};

type ScreenBoundaryProps = {
  readonly children: ReactNode;
};

// Loading and failure states for a whole screen, so components below never handle
// `isLoading` or `isError` themselves.
export const ScreenBoundary = ({ children }: ScreenBoundaryProps) => (
  <QueryErrorResetBoundary>
    {({ reset }) => (
      <ErrorBoundary onReset={reset} FallbackComponent={ScreenError}>
        <Suspense fallback={<ScreenLoading />}>{children}</Suspense>
      </ErrorBoundary>
    )}
  </QueryErrorResetBoundary>
);
