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
  localStorage.clear();
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
  await userEvent.type(await screen.findByRole("textbox", { name: "Nouvelle ligne" }), `${title}{Enter}`);
  return screen.findByRole("heading", { name: title });
};

// Opens a `⋯` menu and picks one of its actions.
const choose = async (menu: string, action: string) => {
  await userEvent.click(screen.getByRole("button", { name: menu }));
  await userEvent.click(screen.getByRole("menuitem", { name: action }));
};

const addItem = async (section: string, content: string) => {
  await userEvent.type(
    screen.getByRole("textbox", { name: `Nouvelle station sur la ligne ${section}` }),
    `${content}{Enter}`,
  );
  return screen.findByRole("checkbox", { name: content });
};

describe("Board sections", () => {
  it("adds a line by tapping the dashed badge, not only with Enter", async () => {
    renderScreen(<Board />);

    await userEvent.type(await screen.findByRole("textbox", { name: "Nouvelle ligne" }), "Courses");
    await userEvent.click(screen.getByRole("button", { name: "Ajouter la ligne" }));

    expect(await screen.findByRole("heading", { name: "Courses" })).toBeInTheDocument();
  });

  it("says when there is no section yet", async () => {
    renderScreen(<Board />);

    expect(await screen.findByText("Aucune ligne pour l'instant.")).toBeInTheDocument();
  });

  it("adds sections one after the other from the keyboard", async () => {
    renderScreen(<Board />);

    await addSection("Courses");
    expect(screen.getByRole("textbox", { name: "Nouvelle ligne" })).toHaveFocus();
    expect(screen.getByRole("textbox", { name: "Nouvelle ligne" })).toHaveValue("");
    expect(await addSection("Travail")).toBeInTheDocument();
  });

  it("renames a section in place, then gives focus back to the rename button", async () => {
    renderScreen(<Board />);
    await addSection("Courses");

    await choose("Actions de la ligne Courses", "Renommer");
    const field = screen.getByRole("textbox", { name: "Nom de la ligne Courses" });
    expect(field).toHaveFocus();
    await userEvent.clear(field);
    await userEvent.type(field, "Épicerie{Enter}");

    expect(await screen.findByRole("heading", { name: "Épicerie" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Actions de la ligne Épicerie" })).toHaveFocus();
  });

  it("cancels renaming with Escape", async () => {
    renderScreen(<Board />);
    await addSection("Courses");

    await choose("Actions de la ligne Courses", "Renommer");
    await userEvent.keyboard(" bio{Escape}");

    expect(screen.queryByRole("textbox", { name: "Nom de la ligne Courses" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Courses" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Actions de la ligne Courses" })).toHaveFocus();
  });

  it("refuses a blank title without calling the API", async () => {
    renderScreen(<Board />);
    await screen.findByText("Aucune ligne pour l'instant.");
    const calls = fetchSpy.mock.calls.length;

    await userEvent.type(screen.getByRole("textbox", { name: "Nouvelle ligne" }), "   {Enter}");

    expect(await screen.findByRole("alert")).toHaveTextContent("Ce champ est obligatoire.");
    expect(fetchSpy.mock.calls.length).toBe(calls);
  });

  it("removes a section only once the removal is confirmed", async () => {
    renderScreen(<Board />);
    await addSection("Courses");

    await choose("Actions de la ligne Courses", "Supprimer");
    await userEvent.click(screen.getByRole("button", { name: "Annuler" }));
    expect(screen.getByRole("heading", { name: "Courses" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Actions de la ligne Courses" })).toHaveFocus();

    await choose("Actions de la ligne Courses", "Supprimer");
    expect(screen.getByRole("alertdialog", { name: "Supprimer « Courses » ?" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Supprimer" }));

    expect(await screen.findByText("Aucune ligne pour l'instant.")).toBeInTheDocument();
  });
});

const stations = (section: string) => `Stations de la ligne ${section}`;

describe("Board folding", () => {
  it("folds a line's stations away and keeps its name and progress", async () => {
    renderScreen(<Board />);
    await addSection("Backlog");
    await addItem("Backlog", "Idée");

    await userEvent.click(screen.getByRole("button", { name: stations("Backlog") }));

    expect(screen.queryByRole("checkbox", { name: "Idée" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Backlog" })).toBeInTheDocument();
    expect(screen.getByText("0/1")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: stations("Backlog") })).toHaveAttribute("aria-expanded", "false");
  });

  it("remembers which lines are folded after a reload, and only those", async () => {
    const first = renderScreen(<Board />);
    await addSection("Backlog");
    await addItem("Backlog", "Idée");
    await addSection("Courses");
    await addItem("Courses", "Lait");
    await userEvent.click(screen.getByRole("button", { name: stations("Backlog") }));
    first.unmount();

    renderScreen(<Board />);

    expect(await screen.findByRole("checkbox", { name: "Lait" })).toBeInTheDocument();
    expect(screen.queryByRole("checkbox", { name: "Idée" })).not.toBeInTheDocument();
  });
});

describe("Board items", () => {
  it("adds a station by tapping the dashed station, not only with Enter", async () => {
    renderScreen(<Board />);
    await addSection("Courses");

    await userEvent.type(screen.getByRole("textbox", { name: "Nouvelle station sur la ligne Courses" }), "Lait");
    await userEvent.click(screen.getByRole("button", { name: "Ajouter la station à la ligne Courses" }));

    expect(await screen.findByRole("checkbox", { name: "Lait" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Nouvelle station sur la ligne Courses" })).toHaveValue("");
  });

  it("counts a line's stations: none yet, then how many are travelled", async () => {
    renderScreen(<Board />);
    await addSection("Courses");
    expect(screen.getByText("0 station")).toBeInTheDocument();
    expect(screen.getByText("Aucune station sur la ligne Courses")).toBeInTheDocument();

    await addItem("Courses", "Lait");
    await addItem("Courses", "Pain");

    expect(await screen.findByText("0/2")).toBeInTheDocument();
    expect(screen.getByText("Aucune station parcourue sur 2, ligne Courses")).toBeInTheDocument();
  });

  it("adds items one after the other, each in its own section", async () => {
    renderScreen(<Board />);
    await addSection("Courses");
    await addSection("Travail");

    await addItem("Courses", "Lait");
    const field = screen.getByRole("textbox", { name: "Nouvelle station sur la ligne Courses" });
    expect(field).toHaveFocus();
    expect(field).toHaveValue("");
    await addItem("Courses", "Pain");
    await userEvent.type(screen.getByRole("textbox", { name: "Nouvelle station sur la ligne Travail" }), "Lait{Enter}");

    await vi.waitFor(() => expect(screen.getAllByRole("checkbox", { name: "Lait" })).toHaveLength(2));
    expect(screen.getAllByRole("checkbox", { name: "Pain" })).toHaveLength(1);
    // Same text in two sections: their actions still have distinct names.
    expect(screen.getByRole("button", { name: "Actions de la station Lait sur la ligne Courses" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Actions de la station Lait sur la ligne Travail" })).toBeInTheDocument();
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
    expect(screen.getByText("1 station parcourue sur 1, ligne Courses")).toBeInTheDocument();
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

    await choose("Actions de la station Lait sur la ligne Courses", "Modifier");
    const field = screen.getByRole("textbox", { name: "Nom de la station Lait sur la ligne Courses" });
    expect(field).toHaveFocus();
    await userEvent.clear(field);
    await userEvent.type(field, "Lait d'avoine{Enter}");

    expect(await screen.findByRole("checkbox", { name: "Lait d'avoine" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Actions de la station Lait d'avoine sur la ligne Courses" }),
    ).toHaveFocus();
  });

  it("refuses a blank item without calling the API", async () => {
    renderScreen(<Board />);
    await addSection("Courses");
    const calls = fetchSpy.mock.calls.length;

    await userEvent.type(screen.getByRole("textbox", { name: "Nouvelle station sur la ligne Courses" }), "   {Enter}");

    expect(await screen.findByRole("alert")).toHaveTextContent("Ce champ est obligatoire.");
    expect(fetchSpy.mock.calls.length).toBe(calls);
  });

  it("removes an item only once the removal is confirmed", async () => {
    renderScreen(<Board />);
    await addSection("Courses");
    await addItem("Courses", "Lait");

    await choose("Actions de la station Lait sur la ligne Courses", "Supprimer");
    await userEvent.click(screen.getByRole("button", { name: "Annuler" }));
    expect(screen.getByRole("checkbox", { name: "Lait" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Actions de la station Lait sur la ligne Courses" })).toHaveFocus();

    await choose("Actions de la station Lait sur la ligne Courses", "Supprimer");
    await userEvent.click(screen.getByRole("button", { name: "Supprimer" }));

    await vi.waitFor(() => expect(screen.queryByRole("checkbox", { name: "Lait" })).not.toBeInTheDocument());
  });
});
