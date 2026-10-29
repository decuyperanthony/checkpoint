"use client";

import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import type { ReactNode } from "react";

import { IconButton } from "@/shared/ui/IconButton";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/shared/ui/primitives/collapsible";

type AccordionProps = {
  // The row that stays visible, closed or open: the thing's name and what it knows about itself.
  title: ReactNode;
  // Names the toggle after what it folds: it keeps its name, `aria-expanded` says the state.
  toggleLabel: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // Hidden while closed.
  children: ReactNode;
};

// A title that folds its content away, controlled like shadcn's `Collapsible`:
//
//   <Accordion title={<Title>Courses</Title>} toggleLabel={t("toggle", { title })} open={open} onOpenChange={setOpen}>
//     …
//   </Accordion>
export const Accordion = ({ title, toggleLabel, open, onOpenChange, children }: AccordionProps) => (
  <Collapsible open={open} onOpenChange={onOpenChange}>
    <div className="flex items-center gap-1">
      <div className="min-w-0 flex-1">{title}</div>
      <CollapsibleTrigger asChild>
        <IconButton icon={open ? ChevronDownIcon : ChevronRightIcon} label={toggleLabel} />
      </CollapsibleTrigger>
    </div>
    <CollapsibleContent>{children}</CollapsibleContent>
  </Collapsible>
);
