import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { renderWithIntl } from "@/shared/testing/renderWithIntl";

import { EditActions } from "./EditActions";

describe("EditActions", () => {
  it("saves by submitting the form, and cancels without submitting it", async () => {
    const onSubmit = vi.fn<() => void>();
    const onCancel = vi.fn<() => void>();
    renderWithIntl(
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <EditActions pending={false} onCancel={onCancel} />
      </form>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Annuler" }));
    expect(onCancel).toHaveBeenCalledOnce();
    expect(onSubmit).not.toHaveBeenCalled();

    await userEvent.click(screen.getByRole("button", { name: "Enregistrer" }));
    expect(onSubmit).toHaveBeenCalledOnce();
  });
});
