import { useEffect, useRef } from "react";

// For a button that swaps itself for an inline editor: when the editor closes (`open` turns
// false), keyboard focus goes back to the button. Returns the ref to put on the button.
export const useReturnFocus = <E extends HTMLElement>(open: boolean) => {
  const trigger = useRef<E>(null);
  const wasOpen = useRef(false);
  useEffect(() => {
    if (wasOpen.current && !open) trigger.current?.focus();
    wasOpen.current = open;
  }, [open]);
  return trigger;
};
