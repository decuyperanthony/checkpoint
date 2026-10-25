import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Progress } from "./Progress";

describe("Progress", () => {
  it("shows a short count and reads out the full sentence", () => {
    render(<Progress label="3 sur 4 cochés dans Courses" summary="3/4" />);

    expect(screen.getByText("3 sur 4 cochés dans Courses")).toBeInTheDocument();
    expect(screen.getByText("3/4")).toHaveAttribute("aria-hidden", "true");
  });
});
