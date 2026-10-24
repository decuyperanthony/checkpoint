import { Layer, Schema } from "effect";
import { HttpRouter } from "effect/http";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { Section } from "@/contract/schemas/Section";
import { ApiLive } from "@/server/http";
import { SectionRepositoryMemory } from "@/server/repositories/SectionRepositoryMemory";

const makeApp = () =>
  HttpRouter.toWebHandler(ApiLive.pipe(Layer.provide(SectionRepositoryMemory)), { disableLogger: true });

let app: ReturnType<typeof makeApp>;

beforeEach(() => {
  app = makeApp();
});

afterEach(() => app.dispose());

const send = (method: string, path: string, body?: unknown) =>
  app.handler(
    new Request(`http://localhost/api${path}`, {
      method,
      ...(body === undefined ? {} : { body: JSON.stringify(body), headers: { "content-type": "application/json" } }),
    }),
  );

const unknownId = "6f1c2a52-6a35-4d7e-9b51-0b8f0f1c9f3a";

describe("sections API", () => {
  it("creates a section with a trimmed title", async () => {
    const response = await send("POST", "/sections", { title: "  Courses  " });

    expect(response.status).toBe(201);
    expect(await response.json()).toMatchObject({ title: "Courses", position: 0 });
  });

  it("rejects a blank title", async () => {
    const response = await send("POST", "/sections", { title: "   " });

    expect(response.status).toBe(400);
  });

  it("answers 404 with the typed error for an unknown section", async () => {
    const response = await send("PATCH", `/sections/${unknownId}`, { title: "Travail" });

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ _tag: "SectionNotFound", id: unknownId });
  });

  it("rejects an id that is not a uuid", async () => {
    const response = await send("DELETE", "/sections/not-a-uuid");

    expect(response.status).toBe(400);
  });

  it("lists sections after creation and removal", async () => {
    const created = Schema.decodeUnknownSync(Section)(
      await (await send("POST", "/sections", { title: "Courses" })).json(),
    );
    await send("POST", "/sections", { title: "Travail" });

    const removal = await send("DELETE", `/sections/${created.id}`);
    const list = await (await send("GET", "/sections")).json();

    expect(removal.status).toBe(204);
    expect(list).toMatchObject([{ title: "Travail" }]);
  });
});
