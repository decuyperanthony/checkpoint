import { render, screen } from "@testing-library/react";
import { LockKeyholeIcon } from "lucide-react";
import { describe, expect, it } from "vitest";

import { Panel } from "./Panel";

describe("Panel", () => {
  it("names its section after its title", () => {
    render(
      <Panel icon={LockKeyholeIcon} title="Enter your code" description="The app is locked.">
        <button type="button">Unlock</button>
      </Panel>,
    );

    expect(screen.getByRole("heading", { level: 2, name: "Enter your code" })).toBeInTheDocument();
    expect(screen.getByText("The app is locked.")).toBeInTheDocument();
  });
});
