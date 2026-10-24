import { randomUUID } from "node:crypto";

import { Array, Option, Order, Schema } from "effect";

// Table operations shared by the in-memory repositories.

type Row = { readonly id: string; readonly position: number };

// `toSorted` is stable: equal positions keep insertion order, like the `created_at` tiebreaker in SQL.
export const sortByPosition = <R extends Row>(rows: ReadonlyArray<R>) =>
  rows.toSorted(Order.mapInput(Order.Number, (row: R) => row.position));

export const lastPosition = <R extends Row>(rows: ReadonlyArray<R>) =>
  Array.match(rows, {
    onEmpty: Option.none<number>,
    onNonEmpty: (some) => Option.some(Math.max(...some.map((row) => row.position))),
  });

export const newId = <A>(schema: Schema.Codec<A, string>) => Schema.decodeSync(schema)(randomUUID());

// Both return `[the affected row, the new table]`, the shape `Ref.modify` expects.
export const updateById = <R extends Row>(rows: ReadonlyArray<R>, id: R["id"], change: (row: R) => R) => {
  const updated = rows.map((row) => (row.id === id ? change(row) : row));
  return [Array.findFirst(updated, (row) => row.id === id), updated] as const;
};

export const removeById = <R extends Row>(rows: ReadonlyArray<R>, id: R["id"]) =>
  [
    Array.findFirst(rows, (row) => row.id === id).pipe(Option.map((row): R["id"] => row.id)),
    rows.filter((row) => row.id !== id),
  ] as const;
