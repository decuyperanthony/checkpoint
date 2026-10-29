import { Effect, Schema } from "effect";
import { describe, expect, it } from "vitest";

import { ItemNotFound } from "@/contract/errors/ItemNotFound";
import { SectionNotFound } from "@/contract/errors/SectionNotFound";
import { ItemId } from "@/contract/schemas/Item";
import { SectionId } from "@/contract/schemas/Section";
import { runServices as run, unknownUuid } from "@/server/testing/fixtures";

import { ItemService } from "./ItemService";
import { SectionService } from "./SectionService";

// A section with two items, "Lait" then "Pain".
const groceries = Effect.gen(function* () {
  const sections = yield* SectionService;
  const items = yield* ItemService;
  const section = yield* sections.create("Courses");
  const milk = yield* items.create({ sectionId: section.id, content: "Lait" });
  const bread = yield* items.create({ sectionId: section.id, content: "Pain" });
  return { section, milk, bread };
});

describe("ItemService", () => {
  it("appends new items, unchecked, at the end of their own section", async () => {
    const { milk, bread, other } = await run(
      Effect.gen(function* () {
        const created = yield* groceries;
        const work = yield* (yield* SectionService).create("Travail");
        const report = yield* (yield* ItemService).create({ sectionId: work.id, content: "Rapport" });
        return { ...created, other: report };
      }),
    );

    expect([milk.position, bread.position, other.position]).toEqual([0, 1, 0]);
    expect([milk.done, bread.done]).toEqual([false, false]);
  });

  it("refuses an item in an unknown section", async () => {
    const unknown = Schema.decodeSync(SectionId)(unknownUuid);

    const error = await run(
      ItemService.use((items) => Effect.flip(items.create({ sectionId: unknown, content: "Lait" }))),
    );

    expect(error).toBeInstanceOf(SectionNotFound);
  });

  it("checks an item without touching its text, then edits its text without unchecking it", async () => {
    const item = await run(
      Effect.gen(function* () {
        const items = yield* ItemService;
        const { milk } = yield* groceries;
        yield* items.update({ id: milk.id, changes: { done: true } });
        return yield* items.update({ id: milk.id, changes: { content: "Lait d'avoine" } });
      }),
    );

    expect(item).toMatchObject({ content: "Lait d'avoine", done: true });
  });

  it("removes an item", async () => {
    const remaining = await run(
      Effect.gen(function* () {
        const items = yield* ItemService;
        const { milk } = yield* groceries;
        yield* items.remove(milk.id);
        return (yield* items.list).map((item) => item.content);
      }),
    );

    expect(remaining).toEqual(["Pain"]);
  });

  it("removes the items of a removed section", async () => {
    const remaining = await run(
      Effect.gen(function* () {
        const { section } = yield* groceries;
        yield* (yield* SectionService).remove(section.id);
        return yield* (yield* ItemService).list;
      }),
    );

    expect(remaining).toEqual([]);
  });

  it("fails with ItemNotFound for an unknown item", async () => {
    const unknown = Schema.decodeSync(ItemId)(unknownUuid);

    const errors = await run(
      ItemService.use((items) =>
        Effect.all([
          Effect.flip(items.update({ id: unknown, changes: { done: true } })),
          Effect.flip(items.remove(unknown)),
        ]),
      ),
    );

    expect(errors).toEqual([expect.any(ItemNotFound), expect.any(ItemNotFound)]);
  });

  it("moves an item within its section", async () => {
    const contents = await run(
      Effect.gen(function* () {
        const { section, bread } = yield* groceries;
        const items = yield* ItemService;
        yield* items.move({ id: bread.id, sectionId: section.id, position: 0 });
        return (yield* items.list).map((item) => item.content);
      }),
    );

    expect(contents).toEqual(["Pain", "Lait"]);
  });

  it("moves an item to another section, at the given place", async () => {
    const { items, workId } = await run(
      Effect.gen(function* () {
        const { milk } = yield* groceries;
        const service = yield* ItemService;
        const work = yield* (yield* SectionService).create("Travail");
        yield* service.create({ sectionId: work.id, content: "Rapport" });
        yield* service.move({ id: milk.id, sectionId: work.id, position: 0 });
        return { items: yield* service.list, workId: work.id };
      }),
    );

    const inWork = items.filter((item) => item.sectionId === workId);
    expect(inWork.map((item) => [item.content, item.position])).toEqual([
      ["Lait", 0],
      ["Rapport", 1],
    ]);
    expect(items.filter((item) => item.sectionId !== workId).map((item) => item.content)).toEqual(["Pain"]);
  });

  it("fails with ItemNotFound for an unknown item", async () => {
    const error = await run(
      Effect.gen(function* () {
        const { section } = yield* groceries;
        const unknown = Schema.decodeSync(ItemId)(unknownUuid);
        return yield* Effect.flip((yield* ItemService).move({ id: unknown, sectionId: section.id, position: 0 }));
      }),
    );

    expect(error).toBeInstanceOf(ItemNotFound);
  });

  it("fails with SectionNotFound when moving an item to an unknown section", async () => {
    const error = await run(
      Effect.gen(function* () {
        const { milk } = yield* groceries;
        const unknown = Schema.decodeSync(SectionId)(unknownUuid);
        return yield* Effect.flip((yield* ItemService).move({ id: milk.id, sectionId: unknown, position: 0 }));
      }),
    );

    expect(error).toBeInstanceOf(SectionNotFound);
  });
});
