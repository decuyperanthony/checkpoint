import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { makeFakeApi } from "@/server/testing/fakeApi";
import { renderScreen } from "@/shared/testing/renderScreen";

import Board from "./Board";

const fakeApi = makeFakeApi();
const fetchSpy = vi.fn<typeof fetch>(fakeApi.fetch);
vi.stubGlobal("fetch", fetchSpy);

// Reset before each test, not after: a refetch still in flight from the previous screen
// must not hit a disposed store.
beforeEach(() => fakeApi.reset());

const addSection = async (title: string) => {
  await userEvent.type(await screen.findByRole("textbox", { name: "Nouvelle section" }), `${title}{Enter}`);
  await screen.findByRole("heading", { name: title });
};

const addItem = async (section: string, content: string) => {
  await userEvent.type(screen.getByRole("textbox", { name: `Nouvel élément dans ${section}` }), `${content}{Enter}`);
  return screen.findByRole("checkbox", { name: content });
};

describe("Board items", () => {
  it("adds items one after the other, each in its own section", async () => {
    renderScreen(<Board />);
    await addSection("Courses");
    await addSection("Travail");

    await addItem("Courses", "Lait");
    const field = screen.getByRole("textbox", { name: "Nouvel élément dans Courses" });
    expect(field).toHaveFocus();
    expect(field).toHaveValue("");
    await addItem("Courses", "Pain");
    await userEvent.type(screen.getByRole("textbox", { name: "Nouvel élément dans Travail" }), "Lait{Enter}");

    await vi.waitFor(() => expect(screen.getAllByRole("checkbox", { name: "Lait" })).toHaveLength(2));
    expect(screen.getAllByRole("checkbox", { name: "Pain" })).toHaveLength(1);
    // Same text in two sections: their actions still have distinct names.
    expect(screen.getByRole("button", { name: "Modifier l'élément Lait dans Courses" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Modifier l'élément Lait dans Travail" })).toBeInTheDocument();
  });

  it("checks an item, then unchecks it", async () => {
    renderScreen(<Board />);
    await addSection("Courses");
    const item = await addItem("Courses", "Lait");

    await userEvent.click(item);
    await vi.waitFor(() => expect(screen.getByRole("checkbox", { name: "Lait" })).toBeChecked());
    await vi.waitFor(() => expect(screen.getByRole("checkbox", { name: "Lait" })).toBeEnabled());

    await userEvent.click(screen.getByRole("checkbox", { name: "Lait" }));
    await vi.waitFor(() => expect(screen.getByRole("checkbox", { name: "Lait" })).not.toBeChecked());
  });

  it("edits an item in place, then gives focus back to the edit button", async () => {
    renderScreen(<Board />);
    await addSection("Courses");
    await addItem("Courses", "Lait");

    await userEvent.click(screen.getByRole("button", { name: "Modifier l'élément Lait dans Courses" }));
    const field = screen.getByRole("textbox", { name: "Texte de l'élément Lait dans Courses" });
    expect(field).toHaveFocus();
    await userEvent.clear(field);
    await userEvent.type(field, "Lait d'avoine{Enter}");

    expect(await screen.findByRole("checkbox", { name: "Lait d'avoine" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Modifier l'élément Lait d'avoine dans Courses" })).toHaveFocus();
  });

  it("refuses a blank item without calling the API", async () => {
    renderScreen(<Board />);
    await addSection("Courses");
    const calls = fetchSpy.mock.calls.length;

    await userEvent.type(screen.getByRole("textbox", { name: "Nouvel élément dans Courses" }), "   {Enter}");

    expect(await screen.findByRole("alert")).toHaveTextContent("Le texte doit faire entre 1 et 500 caractères.");
    expect(fetchSpy.mock.calls.length).toBe(calls);
  });

  it("removes an item only once the removal is confirmed", async () => {
    renderScreen(<Board />);
    await addSection("Courses");
    await addItem("Courses", "Lait");

    await userEvent.click(screen.getByRole("button", { name: "Supprimer l'élément Lait dans Courses" }));
    await userEvent.click(screen.getByRole("button", { name: "Annuler" }));
    expect(screen.getByRole("checkbox", { name: "Lait" })).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Supprimer l'élément Lait dans Courses" }));
    await userEvent.click(screen.getByRole("button", { name: "Supprimer" }));

    await vi.waitFor(() => expect(screen.queryByRole("checkbox", { name: "Lait" })).not.toBeInTheDocument());
  });
});
