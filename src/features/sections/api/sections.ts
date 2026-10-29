import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import type { Section } from "@/contract/schemas/Section";
import { movedSections } from "@/features/sections/model/moveSection";
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

// Shows the new order at once, before the API answers. A failure puts the order back and the
// error toast says why; either way the list is refetched.
export const useMoveSection = () => {
  const queryClient = useQueryClient();
  const invalidate = useInvalidate(queryKeys.sections);
  return useMutation({
    mutationFn: ({ id, position }: Pick<Section, "id" | "position">) =>
      callApi((api) => api.sections.move({ params: { id }, payload: { position } })),
    onMutate: async (move) => {
      // A refetch already in flight would overwrite the move with the old order.
      await queryClient.cancelQueries({ queryKey: queryKeys.sections });
      const previous = queryClient.getQueryData<ReadonlyArray<Section>>(queryKeys.sections);
      queryClient.setQueryData<ReadonlyArray<Section>>(queryKeys.sections, (sections) =>
        sections === undefined ? sections : movedSections(sections, move),
      );
      return { previous };
    },
    onError: (_error, _variables, context) => queryClient.setQueryData(queryKeys.sections, context?.previous),
    onSettled: invalidate,
  });
};
