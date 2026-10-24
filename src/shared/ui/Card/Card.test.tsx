import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Card } from "./Card";

describe("Card", () => {
  it("shows its header above its content", () => {
    render(<Card header={<h2>Groceries</h2>}>Milk</Card>);

    const heading = screen.getByRole("heading", { name: "Groceries" });
    const content = screen.getByText("Milk");
    expect(heading.compareDocumentPosition(content) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("has no header when none is given", () => {
    render(<Card>Milk</Card>);

    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });
});
