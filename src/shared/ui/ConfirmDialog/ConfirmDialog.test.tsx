import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { renderWithIntl } from "@/shared/testing/renderWithIntl";

import { ConfirmDialog } from "./ConfirmDialog";

// Opened by its owner, as a menu would.
const Archive = ({ onConfirm }: { onConfirm: () => void }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Archive
      </button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Archive the list?"
        description="It can be restored later."
        confirmLabel="Archive it"
        onConfirm={onConfirm}
      />
    </>
  );
};

const renderDialog = () => {
  const onConfirm = vi.fn<() => void>();
  renderWithIntl(<Archive onConfirm={onConfirm} />);
  return onConfirm;
};

describe("ConfirmDialog", () => {
  it("runs the action only once confirmed", async () => {
    const onConfirm = renderDialog();

    await userEvent.click(screen.getByRole("button", { name: "Archive" }));
    expect(screen.getByRole("alertdialog", { name: "Archive the list?" })).toHaveAccessibleDescription(
      "It can be restored later.",
    );
    await userEvent.click(screen.getByRole("button", { name: "Archive it" }));

    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it("does nothing when cancelled or closed with Escape", async () => {
    const onConfirm = renderDialog();

    await userEvent.click(screen.getByRole("button", { name: "Archive" }));
    await userEvent.click(screen.getByRole("button", { name: "Annuler" }));
    await userEvent.click(screen.getByRole("button", { name: "Archive" }));
    await userEvent.keyboard("{Escape}");

    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    expect(onConfirm).not.toHaveBeenCalled();
  });
});
