import { Schema } from "effect";
import { describe, expect, it } from "vitest";

import { ItemId, type Item } from "@/contract/schemas/Item";
import { SectionId } from "@/contract/schemas/Section";

import { movedItems } from "./moveItem";

const courses = Schema.decodeSync(SectionId)(crypto.randomUUID());
const work = Schema.decodeSync(SectionId)(crypto.randomUUID());

const item = (content: string, sectionId: SectionId, position: number): Item => ({
  id: Schema.decodeSync(ItemId)(crypto.randomUUID()),
  sectionId,
  content,
  done: false,
  position,
});

const inSection = (items: ReadonlyArray<Item>, sectionId: SectionId) =>
  items.filter((other) => other.sectionId === sectionId).toSorted((a, b) => a.position - b.position);

describe("movedItems", () => {
  const [milk, bread, report] = [item("Lait", courses, 0), item("Pain", courses, 1), item("Rapport", work, 0)];
  const items = [milk, bread, report];

  it("moves an item within its section", () => {
    const moved = movedItems(items, { id: bread.id, sectionId: courses, position: 0 });

    expect(inSection(moved, courses).map((other) => other.content)).toEqual(["Pain", "Lait"]);
    expect(inSection(moved, work).map((other) => other.content)).toEqual(["Rapport"]);
  });

  it("moves an item to another section, at the given place, keeping it checked", () => {
    const done = { ...milk, done: true };
    const moved = movedItems([done, bread, report], { id: milk.id, sectionId: work, position: 0 });

    expect(inSection(moved, work).map((other) => [other.content, other.position, other.done])).toEqual([
      ["Lait", 0, true],
      ["Rapport", 1, false],
    ]);
    expect(inSection(moved, courses).map((other) => other.content)).toEqual(["Pain"]);
  });

  it("leaves the items alone when the item is unknown", () => {
    expect(movedItems(items, { id: item("Inconnu", work, 0).id, sectionId: work, position: 0 })).toBe(items);
  });
});
