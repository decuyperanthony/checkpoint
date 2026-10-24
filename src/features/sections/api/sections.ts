import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import type { Section } from "@/contract/schemas/Section";
import { callApi } from "@/shared/lib/api";
import { queryKeys } from "@/shared/lib/queryKeys";

export const useSections = () =>
  useSuspenseQuery({
    queryKey: queryKeys.sections,
    queryFn: ({ signal }) => callApi((api) => api.sections.list(), { signal }),
  });

const useInvalidate = (...keys: ReadonlyArray<ReadonlyArray<string>>) => {
  const queryClient = useQueryClient();
  return () => Promise.all(keys.map((queryKey) => queryClient.invalidateQueries({ queryKey })));
};

export const useCreateSection = () =>
  useMutation({
    mutationFn: (title: Section["title"]) => callApi((api) => api.sections.create({ payload: { title } })),
    onSuccess: useInvalidate(queryKeys.sections),
  });

export const useRenameSection = () =>
  useMutation({
    mutationFn: ({ id, title }: Pick<Section, "id" | "title">) =>
      callApi((api) => api.sections.rename({ params: { id }, payload: { title } })),
    onSuccess: useInvalidate(queryKeys.sections),
  });

export const useRemoveSection = () =>
  useMutation({
    mutationFn: (id: Section["id"]) => callApi((api) => api.sections.remove({ params: { id } })),
    onSuccess: useInvalidate(queryKeys.sections, queryKeys.items),
  });
