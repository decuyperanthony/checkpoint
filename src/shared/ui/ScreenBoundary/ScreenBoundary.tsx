"use client";

import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Suspense, type ReactNode } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";

import { Button } from "@/shared/ui/Button";
import { Skeleton } from "@/shared/ui/primitives/skeleton";
import { ErrorMessage } from "@/shared/ui/ErrorMessage";
import { Stack } from "@/shared/ui/Stack";
import { Text } from "@/shared/ui/Text";

const ScreenError = ({ error, resetErrorBoundary }: FallbackProps) => {
  const t = useTranslations();

  return (
    <Stack gap="lg">
      <Text role="alert">
        <ErrorMessage error={error} />
      </Text>
      <Button variant="secondary" onClick={resetErrorBoundary}>
        {t("screen.retry")}
      </Button>
    </Stack>
  );
};

// The shape of what is coming, two cards of lines, rather than a word; the word is still there
// for assistive technologies.
const lines = ["w-2/3", "w-1/2", "w-3/5"] as const;

export const ScreenLoading = () => {
  const t = useTranslations("screen");

  return (
    <output className="flex flex-col gap-4">
      <span className="sr-only">{t("loading")}</span>
      {[0, 1].map((card) => (
        <div key={card} aria-hidden className="flex flex-col gap-4 rounded-xl bg-card p-5 ring-1 ring-border">
          <Skeleton className="h-6 w-2/5" />
          {lines.map((width) => (
            <div key={width} className="flex items-center gap-3">
              <Skeleton className="size-5 rounded-full" />
              <Skeleton className={`h-4 ${width}`} />
            </div>
          ))}
        </div>
      ))}
    </output>
  );
};

type ScreenBoundaryProps = {
  children: ReactNode;
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
