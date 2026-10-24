"use client";

import { MutationCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";

import { errorMessageKey } from "@/shared/lib/errorMessage";
import { toast } from "@/shared/ui/Toaster";

type QueryProviderProps = {
  readonly children: ReactNode;
};

export const QueryProvider = ({ children }: QueryProviderProps) => {
  const t = useTranslations("errors");
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: 30_000 } },
        // Single place where mutation errors reach the user; query errors go to the screen boundary.
        mutationCache: new MutationCache({ onError: (error) => toast.error(t(errorMessageKey(error))) }),
      }),
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
