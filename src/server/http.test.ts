import { Effect, Layer, Schema } from "effect";
import { HttpRouter } from "effect/http";
import { beforeEach, describe, expect, it } from "vitest";

import { Item } from "@/contract/schemas/Item";
import { Section } from "@/contract/schemas/Section";
import { ApiHandlers } from "@/server/http";
import type { ItemRepository } from "@/server/repositories/ItemRepository";
import { ItemRepositoryMemory } from "@/server/repositories/ItemRepositoryMemory";
import type { LoginAttemptRepository } from "@/server/repositories/LoginAttemptRepository";
import { LoginAttemptRepositoryMemory } from "@/server/repositories/LoginAttemptRepositoryMemory";
import { MemoryStore } from "@/server/repositories/MemoryStore";
import { RepositoriesMemory } from "@/server/repositories/RepositoriesMemory";
import { SectionRepository } from "@/server/repositories/SectionRepository";
import { SectionRepositoryMemory } from "@/server/repositories/SectionRepositoryMemory";
import type { SessionRepository } from "@/server/repositories/SessionRepository";
import { SessionRepositoryMemory } from "@/server/repositories/SessionRepositoryMemory";
import { PinVerifierTest, testPin, unknownUuid } from "@/server/testing/fixtures";

type Repositories = SectionRepository | ItemRepository | SessionRepository | LoginAttemptRepository;

const makeApp = (repositories: Layer.Layer<Repositories>) =>
  HttpRouter.toWebHandler(ApiHandlers.pipe(Layer.provide([repositories, PinVerifierTest])), { disableLogger: true });

let app = makeApp(RepositoriesMemory);

type SendOptions = { body?: unknown; headers?: { [name: string]: string } };

const request = (method: string, path: string, { body, headers = {} }: SendOptions = {}) =>
  app.handler(
    new Request(`http://localhost/api${path}`, {
      method,
      headers: body === undefined ? headers : { ...headers, "content-type": "application/json" },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    }),
  );

// The `name=value` part of a Set-Cookie header, as a browser would send it back.
const cookieOf = (response: Response) => response.headers.get("set-cookie")?.split(";")[0] ?? "";

const logIn = (pin: string = testPin, headers: { [name: string]: string } = {}) =>
  request("POST", "/auth/login", { body: { pin }, headers });

let session = "";

beforeEach(async () => {
  await app.dispose();
  app = makeApp(RepositoriesMemory);
  session = cookieOf(await logIn());
});

// What the browser does once logged in: every request carries the session cookie.
const send = (method: string, path: string, body?: unknown) =>
  request(method, path, { body, headers: { cookie: session } });

const readJson = async <A, I>(response: Response, schema: Schema.Codec<A, I>) =>
  Schema.decodeUnknownSync(schema)(await response.json());

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
    const response = await send("PATCH", `/sections/${unknownUuid}`, { title: "Travail" });

    expect(response.status).toBe(404);
    expect(await response.text()).toBe(JSON.stringify({ _tag: "SectionNotFound", id: unknownUuid }));
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
    ).pipe(
      Layer.provide(SectionRepositoryMemory),
      Layer.merge(Layer.mergeAll(ItemRepositoryMemory, SessionRepositoryMemory, LoginAttemptRepositoryMemory)),
      Layer.provide(MemoryStore.layer),
    );
    app = makeApp(failingDatabase);
    session = cookieOf(await logIn());

    const response = await send("GET", "/sections");

    expect(response.status).toBe(500);
    expect(await response.text()).toBe("");
  });
});

describe("moving over the API", () => {
  it("moves a section and answers the sections in their new order", async () => {
    await send("POST", "/sections", { title: "Courses" });
    const second = await readJson(await send("POST", "/sections", { title: "Travail" }), Section);

    const response = await send("PATCH", `/sections/${second.id}/position`, { position: 0 });

    expect(response.status).toBe(200);
    const sections = await readJson(response, Schema.Array(Section));
    expect(sections.map((section) => section.title)).toEqual(["Travail", "Courses"]);
  });

  it("moves an item to another section", async () => {
    const courses = await readJson(await send("POST", "/sections", { title: "Courses" }), Section);
    const work = await readJson(await send("POST", "/sections", { title: "Travail" }), Section);
    const milk = await readJson(await send("POST", `/sections/${courses.id}/items`, { content: "Lait" }), Item);

    const response = await send("PATCH", `/items/${milk.id}/position`, { sectionId: work.id, position: 0 });

    expect(response.status).toBe(200);
    expect(await readJson(response, Schema.Array(Item))).toMatchObject([{ content: "Lait", sectionId: work.id }]);
  });

  it("rejects a position that is negative or not a whole number", async () => {
    const section = await readJson(await send("POST", "/sections", { title: "Courses" }), Section);

    expect((await send("PATCH", `/sections/${section.id}/position`, { position: -1 })).status).toBe(400);
    expect((await send("PATCH", `/sections/${section.id}/position`, { position: 1.5 })).status).toBe(400);
  });

  it("answers 404 for an unknown section or item", async () => {
    expect((await send("PATCH", `/sections/${unknownUuid}/position`, { position: 0 })).status).toBe(404);
    expect(
      (await send("PATCH", `/items/${unknownUuid}/position`, { sectionId: unknownUuid, position: 0 })).status,
    ).toBe(404);
  });
});

describe("items API", () => {
  it("creates an item in a section, then checks it", async () => {
    const section = await readJson(await send("POST", "/sections", { title: "Courses" }), Section);
    const created = await readJson(await send("POST", `/sections/${section.id}/items`, { content: " Lait " }), Item);

    const response = await send("PATCH", `/items/${created.id}`, { done: true });

    expect(response.status).toBe(200);
    expect(await readJson(response, Item)).toMatchObject({ content: "Lait", done: true, sectionId: section.id });
  });

  it("rejects an item update that changes nothing", async () => {
    const response = await send("PATCH", `/items/${unknownUuid}`, {});

    expect(response.status).toBe(400);
  });

  it("answers 404 with the typed error for an unknown item", async () => {
    const response = await send("DELETE", `/items/${unknownUuid}`);

    expect(response.status).toBe(404);
    expect(await response.text()).toBe(JSON.stringify({ _tag: "ItemNotFound", id: unknownUuid }));
  });

  it("answers 404 when adding an item to an unknown section", async () => {
    const response = await send("POST", `/sections/${unknownUuid}/items`, { content: "Lait" });

    expect(response.status).toBe(404);
  });
});

// As Vercel forwards it: the client first, then the proxies.
const from = (ip: string) => ({ "x-forwarded-for": `${ip}, 10.0.0.1` });

describe("auth API", () => {
  it("logs in with the right PIN through a Secure, httpOnly, SameSite=Lax cookie", async () => {
    const response = await logIn();

    expect(response.status).toBe(204);
    const cookie = response.headers.get("set-cookie") ?? "";
    expect(cookie).toMatch(/^__Host-checkpoint_session=[\w-]{43};/);
    expect(cookie).toContain("HttpOnly");
    expect(cookie).toContain("Secure");
    expect(cookie).toContain("SameSite=Lax");
    expect(cookie).toContain("Path=/");
  });

  it("refuses every other endpoint without a valid session", async () => {
    const responses = await Promise.all([
      request("GET", "/sections"),
      request("GET", "/items"),
      request("POST", "/sections", {
        body: { title: "Courses" },
        headers: { cookie: "__Host-checkpoint_session=forged" },
      }),
    ]);

    expect(responses.map((response) => response.status)).toEqual([401, 401, 401]);
    expect(await responses[0]?.text()).toBe(JSON.stringify({ _tag: "SessionExpired" }));
  });

  it("says whether the session is valid", async () => {
    expect((await send("GET", "/auth/session")).status).toBe(204);
    expect((await request("GET", "/auth/session")).status).toBe(401);
  });

  it("refuses a wrong PIN without opening a session", async () => {
    const response = await logIn("0000");

    expect(response.status).toBe(401);
    expect(await response.text()).toBe(JSON.stringify({ _tag: "InvalidPin" }));
    expect(response.headers.get("set-cookie")).toBeNull();
  });

  it("refuses a PIN that is not 4 to 12 digits before checking it", async () => {
    expect((await logIn("12ab")).status).toBe(400);
  });

  it("blocks the forwarded client address after too many wrong PINs", async () => {
    for (const _ of Array.from({ length: 5 })) await logIn("0000", from("203.0.113.7"));

    const blocked = await logIn(testPin, from("203.0.113.7"));
    const otherClient = await logIn(testPin, from("198.51.100.1"));

    expect(blocked.status).toBe(429);
    expect(await blocked.text()).toBe(JSON.stringify({ _tag: "TooManyAttempts", retryAfterSeconds: 900 }));
    expect(otherClient.status).toBe(204);
  });

  it("logs out: the session ends and the cookie is cleared", async () => {
    const response = await send("POST", "/auth/logout");

    expect(response.status).toBe(204);
    expect(response.headers.get("set-cookie")).toMatch(/^__Host-checkpoint_session=;.*Max-Age=0/);
    expect((await send("GET", "/sections")).status).toBe(401);
  });
});
