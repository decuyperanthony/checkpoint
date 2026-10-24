import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { renderWithIntl } from "@/shared/testing/renderWithIntl";

import { RemoveButton } from "./RemoveButton";

describe("RemoveButton", () => {
  it("asks about the named thing before removing it", async () => {
    const onConfirm = vi.fn<() => void>();
    renderWithIntl(
      <RemoveButton
        name="Courses"
        label="Supprimer la section Courses"
        description="Définitif."
        onConfirm={onConfirm}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Supprimer la section Courses" }));
    expect(screen.getByRole("alertdialog", { name: "Supprimer « Courses » ?" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Supprimer" }));

    expect(onConfirm).toHaveBeenCalledOnce();
  });
});
