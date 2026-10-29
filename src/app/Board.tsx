"use client";

import { usePrefetchItems } from "@/features/items/api/items";
import { ItemList } from "@/features/items/ui/ItemList";
import { SectionProgress } from "@/features/items/ui/SectionProgress";
import { useSections } from "@/features/sections/api/sections";
import { NewSectionForm } from "@/features/sections/ui/NewSectionForm";
import { NoSections } from "@/features/sections/ui/NoSections";
import { linesId, SectionLine } from "@/features/sections/ui/SectionLine";
import { LineMap } from "@/shared/ui/LineMap";
import { Reorder } from "@/shared/ui/Reorder";
import { ScreenBoundary } from "@/shared/ui/ScreenBoundary";
import { Stack } from "@/shared/ui/Stack";
import { lineColorAt } from "@/shared/ui/tokens";

import { useBoardMoves } from "./useBoardMoves";

// The board composes the features; it is the only place that knows about all of them.
const Sections = () => {
  usePrefetchItems();
  const { data: sections } = useSections();
  const move = useBoardMoves();

  return (
    <Stack gap="lg">
      {sections.length === 0 ? <NoSections /> : null}
      <Reorder onMove={move}>
        <LineMap>
          <Reorder.List kind="line" id={linesId} ids={sections.map((section) => section.id)}>
            {sections.map((section, index) => {
              const color = lineColorAt(index);
              return (
                <SectionLine
                  key={section.id}
                  section={section}
                  color={color}
                  number={index + 1}
                  aside={<SectionProgress section={section} />}
                >
                  <ItemList section={section} color={color} />
                </SectionLine>
              );
            })}
          </Reorder.List>
        </LineMap>
      </Reorder>
      <NewSectionForm />
    </Stack>
  );
};

const Board = () => (
  <ScreenBoundary>
    <Sections />
  </ScreenBoundary>
);

export default Board;
