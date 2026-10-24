import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  it("reports the new state when its label is clicked", async () => {
    const onCheckedChange = vi.fn<(checked: boolean) => void>();
    render(<Checkbox label="Buy milk" checked={false} onCheckedChange={onCheckedChange} />);

    await userEvent.click(screen.getByText("Buy milk"));

    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("reports unchecking", async () => {
    const onCheckedChange = vi.fn<(checked: boolean) => void>();
    render(<Checkbox label="Buy milk" checked onCheckedChange={onCheckedChange} />);

    await userEvent.click(screen.getByRole("checkbox", { name: "Buy milk" }));

    expect(onCheckedChange).toHaveBeenCalledWith(false);
  });

  it("ignores changes while the previous one is pending, without losing focus", async () => {
    const onCheckedChange = vi.fn<(checked: boolean) => void>();
    render(<Checkbox label="Buy milk" checked={false} pending onCheckedChange={onCheckedChange} />);
    const checkbox = screen.getByRole("checkbox", { name: "Buy milk" });

    await userEvent.click(checkbox);

    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(checkbox).toHaveFocus();
  });
});
