import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { FormEvent, ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { Button } from "./Button";

const renderInForm = (button: ReactNode) => {
  const onSubmit = vi.fn<(event: FormEvent) => void>((event) => event.preventDefault());
  render(<form onSubmit={onSubmit}>{button}</form>);
  return onSubmit;
};

describe("Button", () => {
  it("does not submit its form unless it is a submit button", async () => {
    const onSubmit = renderInForm(<Button>Cancel</Button>);

    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits its form as a submit button", async () => {
    const onSubmit = renderInForm(<Button type="submit">Save</Button>);

    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(onSubmit).toHaveBeenCalledOnce();
  });
});
