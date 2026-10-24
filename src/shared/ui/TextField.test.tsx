import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TextField } from "./TextField";

describe("TextField", () => {
  it("is reachable by its label, even when the label is visually hidden", () => {
    render(<TextField label="Section title" labelVisibility="hidden" />);

    expect(screen.getByRole("textbox", { name: "Section title" })).toBeInTheDocument();
  });

  it("announces its error and marks itself invalid", () => {
    render(<TextField label="Section title" error="Title is required" />);

    const input = screen.getByRole("textbox", { name: "Section title" });
    expect(input).toHaveAccessibleDescription("Title is required");
    expect(input).toBeInvalid();
  });

  it("is valid without an error", () => {
    render(<TextField label="Section title" />);

    expect(screen.getByRole("textbox", { name: "Section title" })).toBeValid();
  });
});
