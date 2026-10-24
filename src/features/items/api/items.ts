import { useMutation, usePrefetchQuery, useSuspenseQuery } from "@tanstack/react-query";
import { startTransition, useOptimistic } from "react";

import type { Item, UpdateItemPayload } from "@/contract/schemas/Item";
import type { SectionId } from "@/contract/schemas/Section";
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

// Checks or unchecks an item at once, without waiting for the API. The box shows the new state
// until the change is saved and the list refetched, and goes back if the change fails.
export const useCheckItem = (item: Item) => {
  const update = useUpdateItem();
  const [done, setOptimisticDone] = useOptimistic(item.done);

  const check = (next: Item["done"]) =>
    startTransition(async () => {
      setOptimisticDone(next);
      // A failure already reaches the user through the mutation cache: only the box goes back.
      await update.mutateAsync({ id: item.id, changes: { done: next } }).catch(() => undefined);
    });

  return { done, check };
};

export const useRemoveItem = () => {
  const invalidate = useInvalidate(queryKeys.items);
  return useMutation({
    mutationFn: (id: Item["id"]) => callApi((api) => api.items.remove({ params: { id } })),
    onSuccess: invalidate,
  });
};
