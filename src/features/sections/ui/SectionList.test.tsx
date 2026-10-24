import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { SectionList } from "@/features/sections/ui/SectionList";
import { makeFakeApi } from "@/server/testing/fakeApi";
import { renderScreen } from "@/shared/testing/renderScreen";

const api = vi.hoisted(() => ({ fetch: vi.fn<typeof fetch>() }));
vi.stubGlobal("fetch", api.fetch);

const fakeApi = makeFakeApi();
api.fetch.mockImplementation(fakeApi.fetch);

afterEach(() => fakeApi.reset());

const addSection = async (title: string) => {
  await userEvent.type(await screen.findByRole("textbox", { name: "Nouvelle section" }), title);
  await userEvent.click(screen.getByRole("button", { name: "Ajouter" }));
  return screen.findByRole("heading", { name: title });
};

describe("SectionList", () => {
  it("says when there is no section yet", async () => {
    renderScreen(<SectionList />);

    expect(await screen.findByText("Aucune section pour l'instant.")).toBeInTheDocument();
  });

  it("adds a section", async () => {
    renderScreen(<SectionList />);

    expect(await addSection("Courses")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Nouvelle section" })).toHaveValue("");
  });

  it("renames a section in place", async () => {
    renderScreen(<SectionList />);
    await addSection("Courses");

    await userEvent.click(screen.getByRole("button", { name: "Renommer la section" }));
    const field = screen.getByRole("textbox", { name: "Titre de la section" });
    await userEvent.clear(field);
    await userEvent.type(field, "Épicerie{Enter}");

    expect(await screen.findByRole("heading", { name: "Épicerie" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Courses" })).not.toBeInTheDocument();
  });

  it("cancels renaming with Escape", async () => {
    renderScreen(<SectionList />);
    await addSection("Courses");

    await userEvent.click(screen.getByRole("button", { name: "Renommer la section" }));
    await userEvent.type(screen.getByRole("textbox", { name: "Titre de la section" }), " bio{Escape}");

    expect(screen.getByRole("heading", { name: "Courses" })).toBeInTheDocument();
  });

  it("refuses a blank title without calling the API", async () => {
    renderScreen(<SectionList />);
    await screen.findByText("Aucune section pour l'instant.");
    const calls = api.fetch.mock.calls.length;

    await userEvent.type(screen.getByRole("textbox", { name: "Nouvelle section" }), "   ");
    await userEvent.click(screen.getByRole("button", { name: "Ajouter" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Le titre doit faire entre 1 et 200 caractères.");
    expect(api.fetch.mock.calls.length).toBe(calls);
  });

  it("removes a section", async () => {
    renderScreen(<SectionList />);
    const heading = await addSection("Courses");
    const card = heading.closest("[data-slot=card]");
    if (!(card instanceof HTMLElement)) throw new TypeError("section card not found");

    await userEvent.click(within(card).getByRole("button", { name: "Supprimer la section" }));

    expect(await screen.findByText("Aucune section pour l'instant.")).toBeInTheDocument();
  });
});
