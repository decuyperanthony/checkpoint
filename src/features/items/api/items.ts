import { useMutation, usePrefetchQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import type { Item, UpdateItemPayload } from "@/contract/schemas/Item";
import type { SectionId } from "@/contract/schemas/Section";
import { movedItems } from "@/features/items/model/moveItem";
import { callApi } from "@/shared/lib/api";
import { queryKeys } from "@/shared/lib/queryKeys";
import { useInvalidate } from "@/shared/lib/useInvalidate";

const itemsQuery = {
  queryKey: queryKeys.items,
  queryFn: ({ signal }: { signal: AbortSignal }) => callApi((api) => api.items.list(), { signal }),
};

// One list for the whole board: each section filters it, so the board loads in two requests.
export const useItems = () => useSuspenseQuery(itemsQuery);

// Starts loading items with the sections, so that the first section's items never suspend
// the whole board (which would remount it and lose keyboard focus).
export const usePrefetchItems = () => usePrefetchQuery(itemsQuery);

export const useCreateItem = () => {
  const invalidate = useInvalidate(queryKeys.items);
  return useMutation({
    mutationFn: ({ sectionId, content }: { sectionId: SectionId; content: Item["content"] }) =>
      callApi((api) => api.items.create({ params: { id: sectionId }, payload: { content } })),
    onSuccess: invalidate,
  });
};

export const useUpdateItem = () => {
  const invalidate = useInvalidate(queryKeys.items);
  return useMutation({
    mutationFn: ({ id, changes }: { id: Item["id"]; changes: UpdateItemPayload }) =>
      callApi((api) => api.items.update({ params: { id }, payload: changes })),
    onSuccess: invalidate,
  });
};

// Checks or unchecks an item at once, in the shared list: the station, the legs around it and
// its line's progress all change together. A failure puts the list back and the error toast
// says why; either way the list is refetched.
export const useCheckItem = () => {
  const queryClient = useQueryClient();
  const invalidate = useInvalidate(queryKeys.items);
  return useMutation({
    mutationFn: ({ id, done }: Pick<Item, "id" | "done">) =>
      callApi((api) => api.items.update({ params: { id }, payload: { done } })),
    onMutate: async ({ id, done }) => {
      // A refetch already in flight would overwrite the change with the old state.
      await queryClient.cancelQueries({ queryKey: queryKeys.items });
      const previous = queryClient.getQueryData<ReadonlyArray<Item>>(queryKeys.items);
      queryClient.setQueryData<ReadonlyArray<Item>>(queryKeys.items, (items) =>
        items?.map((item) => (item.id === id ? { ...item, done } : item)),
      );
      return { previous };
    },
    onError: (_error, _variables, context) => queryClient.setQueryData(queryKeys.items, context?.previous),
    onSettled: invalidate,
  });
};

export const useRemoveItem = () => {
  const invalidate = useInvalidate(queryKeys.items);
  return useMutation({
    mutationFn: (id: Item["id"]) => callApi((api) => api.items.remove({ params: { id } })),
    onSuccess: invalidate,
  });
};

// Shows the move at once, in the shared list, before the API answers: the item may change line.
// A failure puts the list back and the error toast says why; either way it is refetched.
export const useMoveItem = () => {
  const queryClient = useQueryClient();
  const invalidate = useInvalidate(queryKeys.items);
  return useMutation({
    mutationFn: ({ id, sectionId, position }: Pick<Item, "id" | "sectionId" | "position">) =>
      callApi((api) => api.items.move({ params: { id }, payload: { sectionId, position } })),
    onMutate: async (move) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.items });
      const previous = queryClient.getQueryData<ReadonlyArray<Item>>(queryKeys.items);
      queryClient.setQueryData<ReadonlyArray<Item>>(queryKeys.items, (items) =>
        items === undefined ? items : movedItems(items, move),
      );
      return { previous };
    },
    onError: (_error, _variables, context) => queryClient.setQueryData(queryKeys.items, context?.previous),
    onSettled: invalidate,
  });
};
