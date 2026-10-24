"use client";

import { ItemList } from "@/features/items/ui/ItemList";
import { SectionList } from "@/features/sections/ui/SectionList";
import { ScreenBoundary } from "@/shared/ui/ScreenBoundary";

// The board composes the features; it is the only place that knows about all of them.
const Board = () => (
  <ScreenBoundary>
    <SectionList renderContent={(section) => <ItemList section={section} />} />
  </ScreenBoundary>
);

export default Board;
