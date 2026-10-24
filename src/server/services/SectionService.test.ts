import { Effect, Schema } from "effect";
import { describe, expect, it } from "vitest";

import { SectionNotFound } from "@/contract/errors/SectionNotFound";
import { SectionId } from "@/contract/schemas/Section";
import { runServices as run, unknownUuid } from "@/server/testing/fixtures";

import { SectionService } from "./SectionService";

const unknownId = Schema.decodeSync(SectionId)(unknownUuid);

describe("SectionService", () => {
  it("appends new sections after the existing ones", async () => {
    const titles = await run(
      Effect.gen(function* () {
        const sections = yield* SectionService;
        yield* sections.create("Courses");
        yield* sections.create("Travail");
        yield* sections.create("Maison");
        return (yield* sections.list).map((section) => section.title);
      }),
    );

    expect(titles).toEqual(["Courses", "Travail", "Maison"]);
  });

  it("renames a section", async () => {
    const titles = await run(
      Effect.gen(function* () {
        const sections = yield* SectionService;
        const created = yield* sections.create("Courses");
        yield* sections.rename({ id: created.id, title: "Épicerie" });
        return (yield* sections.list).map((section) => section.title);
      }),
    );

    expect(titles).toEqual(["Épicerie"]);
  });

  it("removes a section", async () => {
    const remaining = await run(
      Effect.gen(function* () {
        const sections = yield* SectionService;
        const created = yield* sections.create("Courses");
        yield* sections.create("Travail");
        yield* sections.remove(created.id);
        return (yield* sections.list).map((section) => section.title);
      }),
    );

    expect(remaining).toEqual(["Travail"]);
  });

  it("fails with SectionNotFound when renaming an unknown section", async () => {
    const error = await run(
      SectionService.use((sections) => Effect.flip(sections.rename({ id: unknownId, title: "x" }))),
    );

    expect(error).toBeInstanceOf(SectionNotFound);
  });

  it("fails with SectionNotFound when removing an unknown section", async () => {
    const error = await run(SectionService.use((sections) => Effect.flip(sections.remove(unknownId))));

    expect(error).toBeInstanceOf(SectionNotFound);
  });
});
