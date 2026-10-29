// Where something goes in an ordered list: the list without it, then it at `index`, which is
// clamped to the list. Used by the server to renumber and by the client to show the move at once.
export const placeAt = <A>({ list, item, index }: { list: ReadonlyArray<A>; item: A; index: number }) => {
  const rest = list.filter((other) => other !== item);
  const at = Math.min(Math.max(index, 0), rest.length);
  return [...rest.slice(0, at), item, ...rest.slice(at)];
};
