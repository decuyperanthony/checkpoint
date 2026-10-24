import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Screen } from "./Screen";

describe("Screen", () => {
  it("is the page's main landmark, titled by its only level-1 heading", () => {
    render(
      <Screen title="Checkpoint" actions={<button type="button">Theme</button>}>
        Content
      </Screen>,
    );

    expect(screen.getByRole("main")).toHaveTextContent("Content");
    expect(screen.getByRole("heading", { level: 1, name: "Checkpoint" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Theme" })).toBeInTheDocument();
  });
});
