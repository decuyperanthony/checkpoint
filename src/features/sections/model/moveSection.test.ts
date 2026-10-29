import { Schema } from "effect";
import { describe, expect, it } from "vitest";

import { SectionId, type Section } from "@/contract/schemas/Section";

import { movedSections } from "./moveSection";

const section = (title: string, position: number): Section => ({
  id: Schema.decodeSync(SectionId)(crypto.randomUUID()),
  title,
  position,
});

describe("movedSections", () => {
  const [courses, work, home] = [section("Courses", 0), section("Travail", 1), section("Maison", 2)];
  const sections = [courses, work, home];

  it("puts a section at its new place and numbers them again", () => {
    const moved = movedSections(sections, { id: home.id, position: 0 });

    expect(moved.map((item) => [item.title, item.position])).toEqual([
      ["Maison", 0],
      ["Courses", 1],
      ["Travail", 2],
    ]);
  });

  it("leaves the sections alone when the section is unknown", () => {
    const unknown = section("Inconnue", 9);

    expect(movedSections(sections, { id: unknown.id, position: 0 })).toBe(sections);
  });
});
