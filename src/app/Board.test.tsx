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
beforeEach(() => {
  fakeApi.reset();
  fetchSpy.mockImplementation(fakeApi.fetch);
});

// Answers the next update (PATCH) with `answer`; `send` forwards it to the API.
const onNextUpdate = (answer: (send: () => Promise<Response>) => Promise<Response>) =>
  fetchSpy.mockImplementation((input, init) => {
    const method = init?.method ?? (input instanceof Request ? input.method : "GET");
    if (method.toUpperCase() !== "PATCH") return fakeApi.fetch(input, init);
    fetchSpy.mockImplementation(fakeApi.fetch);
    return answer(() => fakeApi.fetch(input, init));
  });

const addSection = async (title: string) => {
  await userEvent.type(await screen.findByRole("textbox", { name: "Nouvelle section" }), `${title}{Enter}`);
  return screen.findByRole("heading", { name: title });
};

// Opens a `⋯` menu and picks one of its actions.
const choose = async (menu: string, action: string) => {
  await userEvent.click(screen.getByRole("button", { name: menu }));
  await userEvent.click(screen.getByRole("menuitem", { name: action }));
};

const addItem = async (section: string, content: string) => {
  await userEvent.type(screen.getByRole("textbox", { name: `Nouvel élément dans ${section}` }), `${content}{Enter}`);
  return screen.findByRole("checkbox", { name: content });
};

describe("Board sections", () => {
  it("says when there is no section yet", async () => {
    renderScreen(<Board />);

    expect(await screen.findByText("Aucune section pour l'instant.")).toBeInTheDocument();
  });

  it("adds sections one after the other from the keyboard", async () => {
    renderScreen(<Board />);

    await addSection("Courses");
    expect(screen.getByRole("textbox", { name: "Nouvelle section" })).toHaveFocus();
    expect(screen.getByRole("textbox", { name: "Nouvelle section" })).toHaveValue("");
    expect(await addSection("Travail")).toBeInTheDocument();
  });

  it("renames a section in place, then gives focus back to the rename button", async () => {
    renderScreen(<Board />);
    await addSection("Courses");

    await choose("Actions de la section Courses", "Renommer");
    const field = screen.getByRole("textbox", { name: "Titre de la section Courses" });
    expect(field).toHaveFocus();
    await userEvent.clear(field);
    await userEvent.type(field, "Épicerie{Enter}");

    expect(await screen.findByRole("heading", { name: "Épicerie" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Actions de la section Épicerie" })).toHaveFocus();
  });

  it("cancels renaming with Escape", async () => {
    renderScreen(<Board />);
    await addSection("Courses");

    await choose("Actions de la section Courses", "Renommer");
    await userEvent.keyboard(" bio{Escape}");

    expect(screen.queryByRole("textbox", { name: "Titre de la section Courses" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Courses" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Actions de la section Courses" })).toHaveFocus();
  });

  it("refuses a blank title without calling the API", async () => {
    renderScreen(<Board />);
    await screen.findByText("Aucune section pour l'instant.");
    const calls = fetchSpy.mock.calls.length;

    await userEvent.type(screen.getByRole("textbox", { name: "Nouvelle section" }), "   {Enter}");

    expect(await screen.findByRole("alert")).toHaveTextContent("Ce champ est obligatoire.");
    expect(fetchSpy.mock.calls.length).toBe(calls);
  });

  it("removes a section only once the removal is confirmed", async () => {
    renderScreen(<Board />);
    await addSection("Courses");

    await choose("Actions de la section Courses", "Supprimer");
    await userEvent.click(screen.getByRole("button", { name: "Annuler" }));
    expect(screen.getByRole("heading", { name: "Courses" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Actions de la section Courses" })).toHaveFocus();

    await choose("Actions de la section Courses", "Supprimer");
    expect(screen.getByRole("alertdialog", { name: "Supprimer « Courses » ?" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Supprimer" }));

    expect(await screen.findByText("Aucune section pour l'instant.")).toBeInTheDocument();
  });
});

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
    expect(screen.getByRole("button", { name: "Actions de l'élément Lait dans Courses" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Actions de l'élément Lait dans Travail" })).toBeInTheDocument();
  });

  it("checks an item at once, before the API answers, then unchecks it", async () => {
    renderScreen(<Board />);
    await addSection("Courses");
    const item = await addItem("Courses", "Lait");
    const { promise: answered, resolve: answer } = Promise.withResolvers<void>();
    onNextUpdate((send) => answered.then(send));

    await userEvent.click(item);
    expect(screen.getByRole("checkbox", { name: "Lait" })).toBeChecked();
    // The line's progress moves with the station, before the API answers too.
    expect(screen.getByText("1 sur 1 cochés dans Courses")).toBeInTheDocument();
    answer();

    await userEvent.click(screen.getByRole("checkbox", { name: "Lait" }));
    await vi.waitFor(() => expect(screen.getByRole("checkbox", { name: "Lait" })).not.toBeChecked());
  });

  it("unchecks the box again and says so when checking fails", async () => {
    renderScreen(<Board />);
    await addSection("Courses");
    const item = await addItem("Courses", "Lait");
    onNextUpdate(() => Promise.resolve(new Response(null, { status: 500 })));

    await userEvent.click(item);

    expect(await screen.findByText("Une erreur est survenue. Réessaie dans un instant.")).toBeInTheDocument();
    await vi.waitFor(() => expect(screen.getByRole("checkbox", { name: "Lait" })).not.toBeChecked());
  });

  it("edits an item in place, then gives focus back to the edit button", async () => {
    renderScreen(<Board />);
    await addSection("Courses");
    await addItem("Courses", "Lait");

    await choose("Actions de l'élément Lait dans Courses", "Modifier");
    const field = screen.getByRole("textbox", { name: "Texte de l'élément Lait dans Courses" });
    expect(field).toHaveFocus();
    await userEvent.clear(field);
    await userEvent.type(field, "Lait d'avoine{Enter}");

    expect(await screen.findByRole("checkbox", { name: "Lait d'avoine" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Actions de l'élément Lait d'avoine dans Courses" })).toHaveFocus();
  });

  it("refuses a blank item without calling the API", async () => {
    renderScreen(<Board />);
    await addSection("Courses");
    const calls = fetchSpy.mock.calls.length;

    await userEvent.type(screen.getByRole("textbox", { name: "Nouvel élément dans Courses" }), "   {Enter}");

    expect(await screen.findByRole("alert")).toHaveTextContent("Ce champ est obligatoire.");
    expect(fetchSpy.mock.calls.length).toBe(calls);
  });

  it("removes an item only once the removal is confirmed", async () => {
    renderScreen(<Board />);
    await addSection("Courses");
    await addItem("Courses", "Lait");

    await choose("Actions de l'élément Lait dans Courses", "Supprimer");
    await userEvent.click(screen.getByRole("button", { name: "Annuler" }));
    expect(screen.getByRole("checkbox", { name: "Lait" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Actions de l'élément Lait dans Courses" })).toHaveFocus();

    await choose("Actions de l'élément Lait dans Courses", "Supprimer");
    await userEvent.click(screen.getByRole("button", { name: "Supprimer" }));

    await vi.waitFor(() => expect(screen.queryByRole("checkbox", { name: "Lait" })).not.toBeInTheDocument());
  });
});
