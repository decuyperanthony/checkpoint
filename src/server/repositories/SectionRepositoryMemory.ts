import { randomUUID } from "node:crypto";

import { Array, Effect, Layer, Option, Order, Ref, Schema } from "effect";

import { SectionId, type Section } from "@/contract/schemas/Section";

import { MemoryStore } from "./MemoryStore";
import { SectionRepository } from "./SectionRepository";

const byPosition = Order.mapInput(Order.Number, (section: Section) => section.position);

// In-memory implementation for tests: same contract as the Drizzle one, no database.
// `toSorted` is stable, so equal positions keep insertion order, like the Drizzle tiebreaker.
export const SectionRepositoryMemory = Layer.effect(
  SectionRepository,
  Effect.gen(function* () {
    const store = yield* MemoryStore;
    const sections = Ref.get(store).pipe(Effect.map((tables) => tables.sections));

    return SectionRepository.of({
      list: sections.pipe(Effect.map((all) => all.toSorted(byPosition))),
      exists: (id) => sections.pipe(Effect.map(Array.some((section) => section.id === id))),
      lastPosition: sections.pipe(
        Effect.map((all) =>
          Array.match(all, {
            onEmpty: Option.none,
            onNonEmpty: (some) => Option.some(Math.max(...some.map((section) => section.position))),
          }),
        ),
      ),
      insert: (draft) =>
        Effect.gen(function* () {
          const created: Section = { ...draft, id: Schema.decodeSync(SectionId)(randomUUID()) };
          yield* Ref.update(store, (tables) => ({ ...tables, sections: [...tables.sections, created] }));
          return created;
        }),
      update: ({ id, changes }) =>
        Ref.modify(store, (tables) => {
          const renamed = tables.sections.map((section) => (section.id === id ? { ...section, ...changes } : section));
          return [Array.findFirst(renamed, (section) => section.id === id), { ...tables, sections: renamed }];
        }),
      delete: (id) =>
        Ref.modify(store, (tables) => [
          Array.findFirst(tables.sections, (section) => section.id === id).pipe(Option.map((section) => section.id)),
          {
            sections: tables.sections.filter((section) => section.id !== id),
            items: tables.items.filter((item) => item.sectionId !== id),
          },
        ]),
    });
  }),
);
