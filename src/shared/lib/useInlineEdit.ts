import { useRef, useState } from "react";
import { flushSync } from "react-dom";

// A value edited in place, opened by a button: closing the editor, by saving or cancelling,
// gives keyboard focus back to that button.
export const useInlineEdit = () => {
  const [editing, setEditing] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return {
    editing,
    triggerRef,
    open: () => setEditing(true),
    close: () => {
      // Render the button back right away, so that it can take the focus.
      flushSync(() => setEditing(false));
      triggerRef.current?.focus();
    },
  };
};
