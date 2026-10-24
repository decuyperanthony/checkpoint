import { render, screen } from "@testing-library/react";
import { PencilIcon } from "lucide-react";
import { describe, expect, it } from "vitest";

import { IconButton } from "./IconButton";

describe("IconButton", () => {
  it("is named by its label, the icon being decorative", () => {
    render(<IconButton icon={PencilIcon} label="Rename Groceries" />);

    expect(screen.getByRole("button", { name: "Rename Groceries" })).toBeInTheDocument();
  });

  it("does not submit its form", () => {
    render(
      <form>
        <IconButton icon={PencilIcon} label="Rename" />
      </form>,
    );

    expect(screen.getByRole("button", { name: "Rename" })).toHaveAttribute("type", "button");
  });
});
