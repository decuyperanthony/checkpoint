import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SectionList } from "@/features/sections/ui/SectionList";
import { makeFakeApi } from "@/server/testing/fakeApi";
import { renderScreen } from "@/shared/testing/renderScreen";

const fakeApi = makeFakeApi();
const fetchSpy = vi.fn<typeof fetch>(fakeApi.fetch);
vi.stubGlobal("fetch", fetchSpy);

// Reset before each test, not after: a refetch still in flight from the previous screen
// must not hit a disposed store.
beforeEach(() => fakeApi.reset());

const addSection = async (title: string) => {
  await userEvent.type(await screen.findByRole("textbox", { name: "Nouvelle section" }), `${title}{Enter}`);
  return screen.findByRole("heading", { name: title });
};

describe("SectionList", () => {
  it("says when there is no section yet", async () => {
    renderScreen(<SectionList />);

    expect(await screen.findByText("Aucune section pour l'instant.")).toBeInTheDocument();
  });

  it("adds sections one after the other from the keyboard", async () => {
    renderScreen(<SectionList />);

    await addSection("Courses");
    expect(screen.getByRole("textbox", { name: "Nouvelle section" })).toHaveFocus();
    expect(screen.getByRole("textbox", { name: "Nouvelle section" })).toHaveValue("");
    expect(await addSection("Travail")).toBeInTheDocument();
  });

  it("renames a section in place, then gives focus back to the rename button", async () => {
    renderScreen(<SectionList />);
    await addSection("Courses");

    await userEvent.click(screen.getByRole("button", { name: "Renommer la section Courses" }));
    const field = screen.getByRole("textbox", { name: "Titre de la section Courses" });
    expect(field).toHaveFocus();
    await userEvent.clear(field);
    await userEvent.type(field, "Épicerie{Enter}");

    expect(await screen.findByRole("heading", { name: "Épicerie" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Renommer la section Épicerie" })).toHaveFocus();
  });

  it("cancels renaming with Escape", async () => {
    renderScreen(<SectionList />);
    await addSection("Courses");

    await userEvent.click(screen.getByRole("button", { name: "Renommer la section Courses" }));
    await userEvent.keyboard(" bio{Escape}");

    expect(screen.queryByRole("textbox", { name: "Titre de la section Courses" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Courses" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Renommer la section Courses" })).toHaveFocus();
  });

  it("refuses a blank title without calling the API", async () => {
    renderScreen(<SectionList />);
    await screen.findByText("Aucune section pour l'instant.");
    const calls = fetchSpy.mock.calls.length;

    await userEvent.type(screen.getByRole("textbox", { name: "Nouvelle section" }), "   {Enter}");

    expect(await screen.findByRole("alert")).toHaveTextContent("Le titre doit faire entre 1 et 200 caractères.");
    expect(fetchSpy.mock.calls.length).toBe(calls);
  });

  it("removes a section only once the removal is confirmed", async () => {
    renderScreen(<SectionList />);
    await addSection("Courses");

    await userEvent.click(screen.getByRole("button", { name: "Supprimer la section Courses" }));
    await userEvent.click(screen.getByRole("button", { name: "Annuler" }));
    expect(screen.getByRole("heading", { name: "Courses" })).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Supprimer la section Courses" }));
    expect(screen.getByRole("alertdialog", { name: "Supprimer « Courses » ?" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Supprimer" }));

    expect(await screen.findByText("Aucune section pour l'instant.")).toBeInTheDocument();
  });
});
