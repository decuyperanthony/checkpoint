"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Slot } from "radix-ui";
import { createContext, use, type ReactNode } from "react";

// What a member of a sortable list hands to its grip, so that only the grip starts the drag.
type Grip = Pick<ReturnType<typeof useSortable>, "attributes" | "listeners"> & {
  attach: (node: HTMLElement | null) => void;
};

const GripContext = createContext<Grip | undefined>(undefined);

// Makes its only child the grip: the child gets the drag listeners and the keyboard attributes.
function SortableGrip({ children }: { children: ReactNode }) {
  const props = use(GripContext);
  if (props === undefined) return null;

  return (
    // `attach` is dnd-kit's callback for the activator node, called when the grip mounts, not a ref read.
    // oxlint-disable-next-line react/refs
    <Slot.Root {...props.attributes} {...props.listeners} ref={props.attach}>
      {children}
    </Slot.Root>
  );
}

type SortableState = { isDragging: boolean; isOver: boolean; activeData: unknown };

type SortableProps = {
  id: string;
  data: { [key: string]: unknown };
  className: (state: SortableState) => string;
  children: ReactNode;
};

// A member of a sortable list: it follows the drag and moves aside for it.
function Sortable({ id, data, className, children }: SortableProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef: attach,
    transform,
    transition,
    isDragging,
    isOver,
    active,
  } = useSortable({ id, data });

  return (
    <GripContext value={{ attributes, listeners, attach }}>
      <div
        ref={setNodeRef}
        style={{ transform: CSS.Translate.toString(transform), transition }}
        className={className({ isDragging, isOver, activeData: active?.data.current })}
      >
        {children}
      </div>
    </GripContext>
  );
}

export { Sortable, SortableGrip };
