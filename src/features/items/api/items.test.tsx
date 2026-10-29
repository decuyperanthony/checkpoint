import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Schema } from "effect";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Item } from "@/contract/schemas/Item";
import { Section } from "@/contract/schemas/Section";
import { makeFakeApi } from "@/server/testing/fakeApi";
import { renderScreen } from "@/shared/testing/renderScreen";

import { useItems, useMoveItem } from "./items";

const fakeApi = makeFakeApi();
const fetchSpy = vi.fn<typeof fetch>(fakeApi.fetch);
vi.stubGlobal("fetch", fetchSpy);

beforeEach(() => {
  fakeApi.reset();
  fetchSpy.mockImplementation(fakeApi.fetch);
});

const post = async (path: string, body: unknown) =>
  (
    await fakeApi.fetch(`http://localhost/api${path}`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "content-type": "application/json" },
    })
  ).json();

// "Lait" on the line Courses, "Rapport" on the line Travail.
const seed = async () => {
  const courses = Schema.decodeUnknownSync(Section)(await post("/sections", { title: "Courses" }));
  const work = Schema.decodeUnknownSync(Section)(await post("/sections", { title: "Travail" }));
  Schema.decodeUnknownSync(Item)(await post(`/sections/${courses.id}/items`, { content: "Lait" }));
  Schema.decodeUnknownSync(Item)(await post(`/sections/${work.id}/items`, { content: "Rapport" }));
  return { courses, work };
};

const Stations = ({ moveTo }: { moveTo: Section }) => {
  const { data: items } = useItems();
  const move = useMoveItem();
  const milk = items.find((item) => item.content === "Lait");

  return (
    <>
      <ul aria-label="Travail">
        {items
          .filter((item) => item.sectionId === moveTo.id)
          .map((item) => (
            <li key={item.id}>{item.content}</li>
          ))}
      </ul>
      <button type="button" onClick={() => milk && move.mutate({ id: milk.id, sectionId: moveTo.id, position: 0 })}>
        Envoyer le lait au travail
      </button>
    </>
  );
};

const stationsOfWork = () =>
  within(screen.getByRole("list", { name: "Travail" }))
    .queryAllByRole("listitem")
    .map((item) => item.textContent);

describe("useMoveItem", () => {
  it("shows an item on another line at once, before the API answers", async () => {
    const { work } = await seed();
    renderScreen(<Stations moveTo={work} />);
    await screen.findByText("Rapport");
    fetchSpy.mockImplementation((input, init) =>
      init?.method === "PATCH" ? new Promise<Response>(() => undefined) : fakeApi.fetch(input, init),
    );

    await userEvent.click(screen.getByRole("button", { name: "Envoyer le lait au travail" }));

    expect(stationsOfWork()).toEqual(["Lait", "Rapport"]);
  });

  it("puts the item back on its line when the move fails", async () => {
    const { work } = await seed();
    renderScreen(<Stations moveTo={work} />);
    await screen.findByText("Rapport");
    fetchSpy.mockImplementation((input, init) =>
      init?.method === "PATCH"
        ? Promise.resolve(new Response(JSON.stringify({ _tag: "ItemNotFound" }), { status: 404 }))
        : fakeApi.fetch(input, init),
    );

    await userEvent.click(screen.getByRole("button", { name: "Envoyer le lait au travail" }));

    await vi.waitFor(() => expect(stationsOfWork()).toEqual(["Rapport"]));
  });

  it("keeps the item on its new line once the API has answered", async () => {
    const { work } = await seed();
    renderScreen(<Stations moveTo={work} />);
    await screen.findByText("Rapport");

    await userEvent.click(screen.getByRole("button", { name: "Envoyer le lait au travail" }));

    await vi.waitFor(() => expect(stationsOfWork()).toEqual(["Lait", "Rapport"]));
  });
});
