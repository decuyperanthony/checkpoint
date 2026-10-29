import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";

import { renderWithIntl } from "@/shared/testing/renderWithIntl";

import { Accordion } from "./Accordion";

const Example = ({ initiallyOpen }: { initiallyOpen: boolean }) => {
  const [open, setOpen] = useState(initiallyOpen);

  return (
    <Accordion title="Backlog" toggleLabel="Contenu du backlog" open={open} onOpenChange={setOpen}>
      <p>Une idée</p>
    </Accordion>
  );
};

describe("Accordion", () => {
  it("hides its content when closed and keeps the title", () => {
    renderWithIntl(<Example initiallyOpen={false} />);

    expect(screen.getByText("Backlog")).toBeInTheDocument();
    expect(screen.queryByText("Une idée")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Contenu du backlog" })).toHaveAttribute("aria-expanded", "false");
  });

  it("opens and closes on its toggle, which keeps its name", async () => {
    renderWithIntl(<Example initiallyOpen={false} />);
    const toggle = screen.getByRole("button", { name: "Contenu du backlog" });

    await userEvent.click(toggle);
    expect(screen.getByText("Une idée")).toBeInTheDocument();
    expect(toggle).toHaveAttribute("aria-expanded", "true");

    await userEvent.click(toggle);
    expect(screen.queryByText("Une idée")).not.toBeInTheDocument();
  });
});
