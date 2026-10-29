import { closestCenter, pointerWithin, type CollisionDetection, type DroppableContainer } from "@dnd-kit/core";

// What a drag says about what moved and where it landed, with no dnd-kit type in sight.
export type Kind = "line" | "station";

export type Move = {
  id: string;
  kind: Kind;
  // The list it lands in: for a line, the one list of lines.
  containerId: string;
  index: number;
};

type Dragged = { kind: Kind; containerId: string; label: string };

// Where a drag can land: on a member of a list, or on the free end of a list.
type Target = { kind: Kind | "end"; containerId: string; index: number };

// An object with that property, whatever it holds.
const has = <K extends string>(value: unknown, key: K): value is { [P in K]: unknown } =>
  typeof value === "object" && value !== null && key in value;

const isKind = (value: unknown): value is Kind => value === "line" || value === "station";

// dnd-kit hands back whatever was put in `data`, untyped: it is read back through these guards.
export const readDragged = (data: unknown): Dragged | undefined =>
  has(data, "kind") &&
  has(data, "containerId") &&
  has(data, "label") &&
  isKind(data.kind) &&
  typeof data.containerId === "string" &&
  typeof data.label === "string"
    ? { kind: data.kind, containerId: data.containerId, label: data.label }
    : undefined;

const readIndex = (data: unknown) =>
  has(data, "sortable") && has(data.sortable, "index") && typeof data.sortable.index === "number"
    ? data.sortable.index
    : undefined;

const readTarget = (data: unknown): Target | undefined => {
  if (
    has(data, "kind") &&
    has(data, "containerId") &&
    has(data, "count") &&
    data.kind === "end" &&
    typeof data.containerId === "string" &&
    typeof data.count === "number"
  ) {
    return { kind: "end", containerId: data.containerId, index: data.count };
  }
  const member = readDragged(data);
  const index = readIndex(data);
  return member === undefined || index === undefined
    ? undefined
    : { kind: member.kind, containerId: member.containerId, index };
};

type Landing = {
  active: { id: string | number; data: { current?: unknown } };
  over: { id: string | number; data: { current?: unknown } } | null;
};

// The move a drag asks for, or nothing: dropped nowhere, on itself, or on something it cannot go to
// (a line never goes into a list of stations).
export const toMove = ({ active, over }: Landing): Move | undefined => {
  const dragged = readDragged(active.data.current);
  const target = over === null ? undefined : readTarget(over.data.current);
  if (dragged === undefined || target === undefined || over?.id === active.id) return undefined;

  const fits = dragged.kind === "line" ? target.kind === "line" : target.kind !== "line";
  return fits
    ? { id: String(active.id), kind: dragged.kind, containerId: target.containerId, index: target.index }
    : undefined;
};

const kindOf = (container: DroppableContainer) => {
  const data = container.data.current;
  return has(data, "kind") ? data.kind : undefined;
};

// A line only lands among lines; a station among stations or on the end of a list. A station under
// the pointer wins over the list's end that contains it.
export const collide: CollisionDetection = (args) => {
  const dragged = readDragged(args.active.data.current);
  const accepted: ReadonlyArray<unknown> = dragged?.kind === "line" ? ["line"] : ["station", "end"];
  const droppableContainers = args.droppableContainers.filter((container) => accepted.includes(kindOf(container)));
  const scoped = { ...args, droppableContainers };

  const underPointer = pointerWithin(scoped);
  const hits = underPointer.length > 0 ? underPointer : closestCenter(scoped);
  const rank = (id: string | number) => {
    const container = droppableContainers.find((candidate) => candidate.id === id);
    return container !== undefined && kindOf(container) === "end" ? 1 : 0;
  };
  return hits.toSorted((a, b) => rank(a.id) - rank(b.id));
};
