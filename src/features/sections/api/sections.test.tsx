import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Schema } from "effect";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Section } from "@/contract/schemas/Section";
import { makeFakeApi } from "@/server/testing/fakeApi";
import { renderScreen } from "@/shared/testing/renderScreen";

import { useMoveSection, useSections } from "./sections";

const fakeApi = makeFakeApi();
const fetchSpy = vi.fn<typeof fetch>(fakeApi.fetch);
vi.stubGlobal("fetch", fetchSpy);

beforeEach(() => {
  fakeApi.reset();
  fetchSpy.mockImplementation(fakeApi.fetch);
});

const create = async (title: string) =>
  Schema.decodeUnknownSync(Section)(
    await (
      await fakeApi.fetch("http://localhost/api/sections", {
        method: "POST",
        body: JSON.stringify({ title }),
        headers: { "content-type": "application/json" },
      })
    ).json(),
  );

// The sections in order, and a button that moves the last one first.
const Lines = () => {
  const { data: sections } = useSections();
  const move = useMoveSection();
  const last = sections.at(-1);

  return (
    <>
      <ul aria-label="Lignes">
        {sections.map((section) => (
          <li key={section.id}>{section.title}</li>
        ))}
      </ul>
      <button type="button" onClick={() => last && move.mutate({ id: last.id, position: 0 })}>
        Monter la dernière
      </button>
    </>
  );
};

const titles = () =>
  within(screen.getByRole("list", { name: "Lignes" }))
    .getAllByRole("listitem")
    .map((item) => item.textContent);

describe("useMoveSection", () => {
  it("shows the new order before the API answers", async () => {
    await create("Courses");
    await create("Travail");
    renderScreen(<Lines />);
    await screen.findByText("Travail");
    // The move is sent but never answered.
    fetchSpy.mockImplementation((input, init) =>
      init?.method === "PATCH" ? new Promise<Response>(() => undefined) : fakeApi.fetch(input, init),
    );

    await userEvent.click(screen.getByRole("button", { name: "Monter la dernière" }));

    expect(titles()).toEqual(["Travail", "Courses"]);
  });

  it("keeps the new order once the API has answered", async () => {
    await create("Courses");
    await create("Travail");
    renderScreen(<Lines />);
    await screen.findByText("Travail");

    await userEvent.click(screen.getByRole("button", { name: "Monter la dernière" }));

    await vi.waitFor(() => expect(titles()).toEqual(["Travail", "Courses"]));
    expect(await screen.findByText("Travail")).toBeInTheDocument();
  });

  it("puts the order back and says so when the move fails", async () => {
    await create("Courses");
    await create("Travail");
    renderScreen(<Lines />);
    await screen.findByText("Travail");
    fetchSpy.mockImplementation((input, init) =>
      init?.method === "PATCH"
        ? Promise.resolve(new Response(JSON.stringify({ _tag: "SectionNotFound" }), { status: 404 }))
        : fakeApi.fetch(input, init),
    );

    await userEvent.click(screen.getByRole("button", { name: "Monter la dernière" }));

    await vi.waitFor(() => expect(titles()).toEqual(["Courses", "Travail"]));
    expect(await screen.findByText("Une erreur est survenue. Réessaie dans un instant.")).toBeInTheDocument();
  });
});
