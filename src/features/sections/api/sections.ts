import { useMutation, useSuspenseQuery } from "@tanstack/react-query";

import type { Section } from "@/contract/schemas/Section";
import { callApi } from "@/shared/lib/api";
import { queryKeys } from "@/shared/lib/queryKeys";
import { useInvalidate } from "@/shared/lib/useInvalidate";

export const useSections = () =>
  useSuspenseQuery({
    queryKey: queryKeys.sections,
    queryFn: ({ signal }) => callApi((api) => api.sections.list(), { signal }),
  });

export const useCreateSection = () => {
  const invalidate = useInvalidate(queryKeys.sections);
  return useMutation({
    mutationFn: (title: Section["title"]) => callApi((api) => api.sections.create({ payload: { title } })),
    onSuccess: invalidate,
  });
};

export const useRenameSection = () => {
  const invalidate = useInvalidate(queryKeys.sections);
  return useMutation({
    mutationFn: ({ id, title }: Pick<Section, "id" | "title">) =>
      callApi((api) => api.sections.rename({ params: { id }, payload: { title } })),
    onSuccess: invalidate,
  });
};

export const useRemoveSection = () => {
  const invalidate = useInvalidate(queryKeys.sections, queryKeys.items);
  return useMutation({
    mutationFn: (id: Section["id"]) => callApi((api) => api.sections.remove({ params: { id } })),
    onSuccess: invalidate,
  });
};
