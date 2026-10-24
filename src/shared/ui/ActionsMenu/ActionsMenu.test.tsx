import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { describe, expect, it, vi } from "vitest";

import { ActionsMenu } from "./ActionsMenu";

const renderMenu = () => {
  const rename = vi.fn<() => void>();
  const remove = vi.fn<() => void>();
  render(
    <ActionsMenu label="Actions de la section Courses">
      <ActionsMenu.Item icon={PencilIcon} onSelect={rename}>
        Renommer
      </ActionsMenu.Item>
      <ActionsMenu.Separator />
      <ActionsMenu.Item icon={Trash2Icon} tone="destructive" onSelect={remove}>
        Supprimer
      </ActionsMenu.Item>
    </ActionsMenu>,
  );
  return { rename, remove };
};

describe("ActionsMenu", () => {
  it("keeps its actions behind the named ⋯ button", async () => {
    renderMenu();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Actions de la section Courses" }));

    expect(screen.getAllByRole("menuitem").map((item) => item.textContent)).toEqual(["Renommer", "Supprimer"]);
  });

  it("runs the chosen action from the keyboard, then closes", async () => {
    const { rename, remove } = renderMenu();
    screen.getByRole("button", { name: "Actions de la section Courses" }).focus();

    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard("{ArrowDown}{Enter}");

    expect(remove).toHaveBeenCalledOnce();
    expect(rename).not.toHaveBeenCalled();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });
});
