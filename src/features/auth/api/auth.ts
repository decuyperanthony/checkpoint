import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import type { LoginPayload } from "@/contract/schemas/Auth";
import { callApi, type ApiError } from "@/shared/lib/api";
import { queryKeys } from "@/shared/lib/queryKeys";

export type SessionState = "open" | "locked";

// The cookie is httpOnly: only the server can say whether the session is valid. An expired one
// is an answer here, not an error.
const sessionQuery = {
  queryKey: queryKeys.session,
  queryFn: ({ signal }: { signal: AbortSignal }) =>
    callApi((api) => api.auth.session(), { signal }).then(
      (): SessionState => "open",
      (error: ApiError): SessionState => {
        if (error._tag === "SessionExpired") return "locked";
        throw error;
      },
    ),
};

// For the screen that chooses between the PIN and the board.
export const useSession = () => useSuspenseQuery(sessionQuery);

// For what only shows once logged in, outside that screen: nothing until the session is known.
export const useSessionOpen = () => useQuery(sessionQuery).data === "open";

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: LoginPayload) => callApi((api) => api.auth.login({ payload })),
    // Everything cached belongs to a previous session: refetch it, the session first.
    onSuccess: () => queryClient.invalidateQueries(),
    // The PIN form shows its own errors.
    meta: { toast: false },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => callApi((api) => api.auth.logout()),
    onSuccess: () => {
      queryClient.setQueryData(queryKeys.session, "locked");
      // The board is gone: drop its data, so the next session starts from the server.
      queryClient.removeQueries({ predicate: (query) => query.queryKey[0] !== queryKeys.session[0] });
    },
  });
};
