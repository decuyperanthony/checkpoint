import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Text } from "./Text";

describe("Text", () => {
  it("is a paragraph by default", () => {
    render(<Text>No section yet.</Text>);

    expect(screen.getByText("No section yet.").tagName).toBe("P");
  });

  it("renders as the requested element", () => {
    render(<Text as="h2">Groceries</Text>);

    expect(screen.getByRole("heading", { level: 2, name: "Groceries" })).toBeInTheDocument();
  });

  it("passes native attributes through, so it can be an announced error", () => {
    render(
      <Text id="title-error" role="alert" tone="error">
        Required
      </Text>,
    );

    expect(screen.getByRole("alert")).toHaveAttribute("id", "title-error");
  });
});
