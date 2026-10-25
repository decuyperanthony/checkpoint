import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Progress } from "./Progress";

describe("Progress", () => {
  it("is a progress bar named by its label, with its value", () => {
    render(<Progress done={3} total={4} label="3 sur 4 cochés" summary="3/4" />);

    const bar = screen.getByRole("progressbar", { name: "3 sur 4 cochés" });
    expect(bar).toHaveAttribute("aria-valuenow", "75");
  });

  it("stays empty for nothing to do", () => {
    render(<Progress done={0} total={0} label="Rien" summary="0/0" />);

    expect(screen.getByRole("progressbar", { name: "Rien" })).toHaveAttribute("aria-valuenow", "0");
  });
});
