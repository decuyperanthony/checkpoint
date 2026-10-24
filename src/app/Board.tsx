"use client";

import { SectionList } from "@/features/sections/ui/SectionList";
import { ScreenBoundary } from "@/shared/ui/ScreenBoundary";

// The board composes the features; it is the only place that knows about all of them.
const Board = () => (
  <ScreenBoundary>
    <SectionList />
  </ScreenBoundary>
);

export default Board;
