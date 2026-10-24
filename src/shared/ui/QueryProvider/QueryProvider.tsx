"use client";

import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

import type { ApiError } from "@/shared/lib/api";
import { queryKeys } from "@/shared/lib/queryKeys";
import { ErrorMessage } from "@/shared/ui/ErrorMessage";
import { toast } from "@/shared/ui/Toaster";

// An expired session, from any query or mutation, locks the screen: the PIN replaces the board.
// Anything else from a mutation is shown here, unless the mutation shows it itself; query
// errors go to the screen boundary.
const makeQueryClient = () => {
  const lockOnExpiry = (error: ApiError) => {
    if (error._tag !== "SessionExpired") return false;
    queryClient.setQueryData(queryKeys.session, "locked");
    return true;
  };

  const queryClient: QueryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 30_000 } },
    queryCache: new QueryCache({ onError: lockOnExpiry }),
    mutationCache: new MutationCache({
      onError: (error, _variables, _context, mutation) => {
        if (lockOnExpiry(error) || mutation.meta?.toast === false) return;
        toast.error(<ErrorMessage error={error} />);
      },
    }),
  });
  return queryClient;
};

type QueryProviderProps = {
  children: ReactNode;
};

export const QueryProvider = ({ children }: QueryProviderProps) => {
  const [queryClient] = useState(makeQueryClient);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
