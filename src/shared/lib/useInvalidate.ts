import { useQueryClient, type QueryKey } from "@tanstack/react-query";

// Refetches the given caches; meant as a mutation's `onSuccess`.
export const useInvalidate = (...keys: ReadonlyArray<QueryKey>) => {
  const queryClient = useQueryClient();
  return () => Promise.all(keys.map((queryKey) => queryClient.invalidateQueries({ queryKey })));
};
