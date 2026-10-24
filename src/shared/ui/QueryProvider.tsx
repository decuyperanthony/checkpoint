"use client";

import { MutationCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

import { ErrorMessage } from "@/shared/ui/ErrorMessage";
import { toast } from "@/shared/ui/Toaster";

// Single place where mutation errors reach the user; query errors go to the screen boundary.
const showError = (error: unknown) => toast.error(<ErrorMessage error={error} />);

type QueryProviderProps = {
  readonly children: ReactNode;
};

export const QueryProvider = ({ children }: QueryProviderProps) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: 30_000 } },
        mutationCache: new MutationCache({ onError: showError }),
      }),
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
