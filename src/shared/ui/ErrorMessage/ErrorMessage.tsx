"use client";

import { useTranslations } from "next-intl";

import { toApiError } from "@/shared/lib/api";
import { errorMessageKey } from "@/shared/lib/errorMessage";

type ErrorMessageProps = {
  error: unknown;
};

// The translated message for any error, wherever it is shown (toast, screen).
// Translating at render time keeps it in the current language.
export const ErrorMessage = ({ error }: ErrorMessageProps) => {
  const t = useTranslations("errors");

  return t(errorMessageKey(toApiError(error)));
};
