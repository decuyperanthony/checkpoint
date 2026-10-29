"use client";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { GripVerticalIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { IconButton } from "@/shared/ui/IconButton";
import { Sortable, SortableGrip } from "@/shared/ui/primitives/sortable";

import { collide, readDragged, toMove, type Kind, type Move } from "./dragData";

export type { Move };

const labelOf = (data: unknown) => readDragged(data)?.label ?? "";

type RootProps = {
  onMove: (move: Move) => void;
  children: ReactNode;
};

// Drag and drop for lines among lines and stations among stations, on a mouse, a finger or the
// keyboard. It only says what moved and where; the caller moves it.
//
//   <Reorder onMove={move}>
//     <Reorder.List kind="line" id="lines" ids={lineIds}>
//       <Reorder.Item kind="line" id={line.id} containerId="lines" label={line.title}>
//         …<Reorder.Handle label={t("moveLine", { title })} />…
const Root = ({ onMove, children }: RootProps) => {
  const t = useTranslations("reorder");
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const end = (event: DragEndEvent) => {
    const move = toMove(event);
    if (move !== undefined) onMove(move);
  };

  return (
    <DndContext
      // A fixed id keeps the accessibility ids the same on the server and in the browser.
      id="reorder"
      sensors={sensors}
      collisionDetection={collide}
      onDragEnd={end}
      accessibility={{
        screenReaderInstructions: { draggable: t("instructions") },
        announcements: {
          onDragStart: ({ active }) => t("pickedUp", { label: labelOf(active.data.current) }),
          onDragOver: ({ active, over }) =>
            over === null || over.id === active.id
              ? undefined
              : t("over", { label: labelOf(active.data.current), over: labelOf(over.data.current) }),
          onDragEnd: ({ active }) => t("dropped", { label: labelOf(active.data.current) }),
          onDragCancel: ({ active }) => t("cancelled", { label: labelOf(active.data.current) }),
        },
      }}
    >
      {children}
    </DndContext>
  );
};

type ListProps = {
  kind: Kind;
  // The list's name, which its members point back to as `containerId`.
  id: string;
  // Its members, in order.
  ids: ReadonlyArray<string>;
  children: ReactNode;
};

// A stations list is also a place to drop at the end, empty or not; lines sit in a grid, so they
// are sorted by their rectangles.
const List = ({ kind, id, ids, children }: ListProps) => {
  const { setNodeRef } = useDroppable({
    id: `end-${id}`,
    data: { kind: "end", containerId: id, count: ids.length },
    // Lines have no end to drop on.
    disabled: kind === "line",
  });

  return (
    <SortableContext
      id={id}
      items={[...ids]}
      strategy={kind === "line" ? rectSortingStrategy : verticalListSortingStrategy}
    >
      {kind === "line" ? children : <div ref={setNodeRef}>{children}</div>}
    </SortableContext>
  );
};

type ItemProps = {
  kind: Kind;
  id: string;
  containerId: string;
  // Names it for assistive technologies when it is picked up or moved over.
  label: string;
  children: ReactNode;
};

// A member of a list: it follows the drag, and shows where another list's member would land.
const Item = ({ kind, id, containerId, label, children }: ItemProps) => (
  <Sortable
    id={id}
    data={{ kind, containerId, label }}
    className={({ isDragging, isOver, activeData }) => {
      if (isDragging) return "relative z-10 opacity-60";
      return isOver && readDragged(activeData)?.containerId !== containerId ? "border-t-2 border-primary" : "";
    }}
  >
    {children}
  </Sortable>
);

type HandleProps = {
  // "Déplacer la station Lait sur la ligne Courses".
  label: string;
};

// The grip that picks its item up: the only part that starts a drag, so scrolling with a finger
// elsewhere still scrolls.
const Handle = ({ label }: HandleProps) => (
  <span className="touch-none">
    <SortableGrip>
      <IconButton icon={GripVerticalIcon} label={label} />
    </SortableGrip>
  </span>
);

export const Reorder = Object.assign(Root, { List, Item, Handle });
