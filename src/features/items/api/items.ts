import { useMutation, useSuspenseQuery } from "@tanstack/react-query";

import type { Item, UpdateItemPayload } from "@/contract/schemas/Item";
import type { SectionId } from "@/contract/schemas/Section";
import { callApi } from "@/shared/lib/api";
import { queryKeys } from "@/shared/lib/queryKeys";
import { useInvalidate } from "@/shared/lib/useInvalidate";

// One list for the whole board: each section filters it, so the board loads in two requests.
export const useItems = () =>
  useSuspenseQuery({
    queryKey: queryKeys.items,
    queryFn: ({ signal }) => callApi((api) => api.items.list(), { signal }),
  });

export const useCreateItem = () => {
  const invalidate = useInvalidate(queryKeys.items);
  return useMutation({
    mutationFn: ({ sectionId, content }: { readonly sectionId: SectionId; readonly content: Item["content"] }) =>
      callApi((api) => api.items.create({ params: { id: sectionId }, payload: { content } })),
    onSuccess: invalidate,
  });
};

export const useUpdateItem = () => {
  const invalidate = useInvalidate(queryKeys.items);
  return useMutation({
    mutationFn: ({ id, changes }: { readonly id: Item["id"]; readonly changes: UpdateItemPayload }) =>
      callApi((api) => api.items.update({ params: { id }, payload: changes })),
    onSuccess: invalidate,
  });
};

export const useRemoveItem = () => {
  const invalidate = useInvalidate(queryKeys.items);
  return useMutation({
    mutationFn: (id: Item["id"]) => callApi((api) => api.items.remove({ params: { id } })),
    onSuccess: invalidate,
  });
};
