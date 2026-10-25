"use client";

import { usePrefetchItems } from "@/features/items/api/items";
import { ItemList } from "@/features/items/ui/ItemList";
import { SectionProgress } from "@/features/items/ui/SectionProgress";
import { useSections } from "@/features/sections/api/sections";
import { NewSectionForm } from "@/features/sections/ui/NewSectionForm";
import { NoSections } from "@/features/sections/ui/NoSections";
import { SectionLine } from "@/features/sections/ui/SectionLine";
import { LineMap } from "@/shared/ui/LineMap";
import { ScreenBoundary } from "@/shared/ui/ScreenBoundary";
import { Stack } from "@/shared/ui/Stack";
import { lineColorAt } from "@/shared/ui/tokens";

// The board composes the features; it is the only place that knows about all of them.
const Sections = () => {
  usePrefetchItems();
  const { data: sections } = useSections();

  return (
    <Stack gap="lg">
      {sections.length === 0 ? <NoSections /> : null}
      <LineMap>
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
      </LineMap>
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
