import { render, screen } from "@testing-library/react";
import { ListChecksIcon } from "lucide-react";
import { describe, expect, it } from "vitest";

import { IconTitle } from "./IconTitle";

describe("IconTitle", () => {
  it("renders a heading of the requested level, named by its text only", () => {
    render(
      <IconTitle icon={ListChecksIcon} level={3}>
        Groceries
      </IconTitle>,
    );

    expect(screen.getByRole("heading", { level: 3, name: "Groceries" })).toBeInTheDocument();
  });
});
