import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Stack } from "./Stack";

describe("Stack", () => {
  it("lays out its children in the order given", () => {
    render(
      <Stack direction="row" gap="lg">
        <button type="button">First</button>
        <button type="button">Second</button>
      </Stack>,
    );

    expect(screen.getAllByRole("button").map((button) => button.textContent)).toEqual(["First", "Second"]);
  });
});
