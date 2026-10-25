import { render, screen } from "@testing-library/react";
import { ListChecksIcon } from "lucide-react";
import { describe, expect, it } from "vitest";

import { Title } from "./Title";

describe("Title", () => {
  it("renders a heading of the requested level, named by its text only", () => {
    render(
      <Title icon={ListChecksIcon} level={3}>
        Groceries
      </Title>,
    );

    expect(screen.getByRole("heading", { level: 3, name: "Groceries" })).toBeInTheDocument();
  });
});
