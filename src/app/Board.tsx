"use client";

import { usePrefetchItems } from "@/features/items/api/items";
import { ItemList } from "@/features/items/ui/ItemList";
import { useSections } from "@/features/sections/api/sections";
import { NewSectionForm } from "@/features/sections/ui/NewSectionForm";
import { NoSections } from "@/features/sections/ui/NoSections";
import { SectionCard } from "@/features/sections/ui/SectionCard";
import { ScreenBoundary } from "@/shared/ui/ScreenBoundary";
import { Stack } from "@/shared/ui/Stack";

// The board composes the features; it is the only place that knows about all of them.
const Sections = () => {
  usePrefetchItems();
  const { data: sections } = useSections();

  return (
    <Stack gap="xl">
      {sections.length === 0 ? <NoSections /> : null}
      {sections.map((section) => (
        <SectionCard key={section.id} section={section}>
          <ItemList section={section} />
        </SectionCard>
      ))}
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
