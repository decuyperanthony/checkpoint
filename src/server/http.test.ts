import { Effect, Layer, Schema } from "effect";
import { HttpRouter } from "effect/http";
import { afterEach, describe, expect, it } from "vitest";

import { Section } from "@/contract/schemas/Section";
import { ApiHandlers } from "@/server/http";
import { SectionRepository } from "@/server/repositories/SectionRepository";
import { SectionRepositoryMemory } from "@/server/repositories/SectionRepositoryMemory";

const makeApp = (repositories: Layer.Layer<SectionRepository>) =>
  HttpRouter.toWebHandler(ApiHandlers.pipe(Layer.provide(repositories)), { disableLogger: true });

let app = makeApp(SectionRepositoryMemory);

afterEach(async () => {
  await app.dispose();
  app = makeApp(SectionRepositoryMemory);
});

const send = (method: string, path: string, body?: unknown) =>
  app.handler(
    new Request(`http://localhost/api${path}`, {
      method,
      ...(body === undefined ? {} : { body: JSON.stringify(body), headers: { "content-type": "application/json" } }),
    }),
  );

const readJson = async <A, I>(response: Response, schema: Schema.Codec<A, I>) =>
  Schema.decodeUnknownSync(schema)(await response.json());

const unknownId = "6f1c2a52-6a35-4d7e-9b51-0b8f0f1c9f3a";

describe("sections API", () => {
  it("creates a section with a trimmed title", async () => {
    const response = await send("POST", "/sections", { title: "  Courses  " });

    expect(response.status).toBe(201);
    expect(await readJson(response, Section)).toMatchObject({ title: "Courses", position: 0 });
  });

  it("rejects a blank title", async () => {
    const response = await send("POST", "/sections", { title: "   " });

    expect(response.status).toBe(400);
  });

  it("answers 404 with the typed error for an unknown section", async () => {
    const response = await send("PATCH", `/sections/${unknownId}`, { title: "Travail" });

    expect(response.status).toBe(404);
    expect(await response.text()).toBe(JSON.stringify({ _tag: "SectionNotFound", id: unknownId }));
  });

  it("rejects an id that is not a uuid", async () => {
    const response = await send("DELETE", "/sections/not-a-uuid");

    expect(response.status).toBe(400);
  });

  it("lists sections after creation and removal", async () => {
    const created = await readJson(await send("POST", "/sections", { title: "Courses" }), Section);
    await send("POST", "/sections", { title: "Travail" });

    const removal = await send("DELETE", `/sections/${created.id}`);
    const list = await readJson(await send("GET", "/sections"), Schema.Array(Section));

    expect(removal.status).toBe(204);
    expect(list.map((section) => section.title)).toEqual(["Travail"]);
  });

  it("answers a database failure with an empty 500, without leaking the cause", async () => {
    await app.dispose();
    const failingDatabase = Layer.effect(
      SectionRepository,
      Effect.gen(function* () {
        const memory = yield* SectionRepository;
        return { ...memory, list: Effect.die(new Error("connection to db.internal refused")) };
      }),
    ).pipe(Layer.provide(SectionRepositoryMemory));
    app = makeApp(failingDatabase);

    const response = await send("GET", "/sections");

    expect(response.status).toBe(500);
    expect(await response.text()).toBe("");
  });
});
