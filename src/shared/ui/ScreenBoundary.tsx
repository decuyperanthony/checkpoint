"use client";

import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Suspense, type ReactNode } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";

import { toApiError } from "@/shared/lib/api";
import { errorMessageKey } from "@/shared/lib/errorMessage";
import { Button } from "@/shared/ui/Button";
import { Stack } from "@/shared/ui/Stack";

const ScreenError = ({ error, resetErrorBoundary }: FallbackProps) => {
  const t = useTranslations();

  return (
    <Stack gap="lg">
      <p role="alert">{t(`errors.${errorMessageKey(toApiError(error))}`)}</p>
      <Button variant="secondary" onClick={resetErrorBoundary}>
        {t("screen.retry")}
      </Button>
    </Stack>
  );
};

const ScreenLoading = () => {
  const t = useTranslations("screen");

  return <p>{t("loading")}</p>;
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
