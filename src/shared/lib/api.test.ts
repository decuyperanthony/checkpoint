import { describe, expect, it, vi } from "vitest";

import { SectionNotFound } from "@/contract/errors/SectionNotFound";
import { sectionId } from "@/shared/lib/fixtures";

import { callApi, UnexpectedApiError } from "./api";

// The HTTP client captures `fetch` when it is first built, so the stub must exist before
// the first call and only its behaviour changes from test to test.
const fetchMock = vi.hoisted(() => {
  const mock = vi.fn<typeof fetch>();
  vi.stubGlobal("fetch", mock);
  return mock;
});

const respondWith = (response: () => Promise<Response>) => fetchMock.mockImplementation(response);

const json = (status: number, body: unknown) =>
  Promise.resolve(new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } }));

describe("callApi", () => {
  it("resolves with the decoded success value", async () => {
    respondWith(() => json(200, [{ id: sectionId, title: "Courses", position: 0 }]));

    await expect(callApi((api) => api.sections.list())).resolves.toEqual([
      { id: sectionId, title: "Courses", position: 0 },
    ]);
  });

  it("rejects with the contract error the API answered", async () => {
    respondWith(() => json(404, { _tag: "SectionNotFound", id: sectionId }));

    const rename = callApi((api) => api.sections.rename({ params: { id: sectionId }, payload: { title: "Travail" } }));

    await expect(rename).rejects.toBeInstanceOf(SectionNotFound);
  });

  it.each([
    ["the network fails", () => Promise.reject(new TypeError("Failed to fetch"))],
    ["the server fails", () => Promise.resolve(new Response(null, { status: 500 }))],
    ["the response does not match the contract", () => json(200, [{ id: "not-a-uuid" }])],
  ])("rejects with UnexpectedApiError when %s", async (_, response) => {
    respondWith(response);

    await expect(callApi((api) => api.sections.list())).rejects.toBeInstanceOf(UnexpectedApiError);
  });
});
