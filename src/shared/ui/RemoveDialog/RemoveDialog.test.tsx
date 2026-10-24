import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { renderWithIntl } from "@/shared/testing/renderWithIntl";

import { RemoveDialog } from "./RemoveDialog";

describe("RemoveDialog", () => {
  it("asks about the named thing before removing it", async () => {
    const onConfirm = vi.fn<() => void>();
    renderWithIntl(
      <RemoveDialog
        name="Courses"
        description="Définitif."
        open
        onOpenChange={vi.fn<(open: boolean) => void>()}
        onConfirm={onConfirm}
      />,
    );

    expect(screen.getByRole("alertdialog", { name: "Supprimer « Courses » ?" })).toHaveAccessibleDescription(
      "Définitif.",
    );
    await userEvent.click(screen.getByRole("button", { name: "Supprimer" }));

    expect(onConfirm).toHaveBeenCalledOnce();
  });
});
