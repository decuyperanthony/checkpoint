import { Array, Effect, Layer, Ref } from "effect";

import { SectionId } from "@/contract/schemas/Section";

import { lastPosition, newId, removeById, sortByPosition, updateById } from "./memory";
import { MemoryStore } from "./MemoryStore";
import { SectionRepository } from "./SectionRepository";

// In-memory implementation for tests: same contract as the Drizzle one, no database.
export const SectionRepositoryMemory = Layer.effect(
  SectionRepository,
  Effect.gen(function* () {
    const store = yield* MemoryStore;
    const sections = Ref.get(store).pipe(Effect.map((tables) => tables.sections));

    return SectionRepository.of({
      list: sections.pipe(Effect.map(sortByPosition)),
      exists: (id) => sections.pipe(Effect.map(Array.some((section) => section.id === id))),
      lastPosition: sections.pipe(Effect.map(lastPosition)),
      insert: (draft) =>
        Effect.gen(function* () {
          const created = { ...draft, id: newId(SectionId) };
          yield* Ref.update(store, (tables) => ({ ...tables, sections: [...tables.sections, created] }));
          return created;
        }),
      update: ({ id, changes }) =>
        Ref.modify(store, (tables) => {
          const [renamed, rows] = updateById(tables.sections, id, (section) => ({ ...section, ...changes }));
          return [renamed, { ...tables, sections: rows }];
        }),
      arrange: (ids) =>
        Ref.update(store, (tables) => ({
          ...tables,
          sections: tables.sections.map((section) =>
            ids.includes(section.id) ? { ...section, position: ids.indexOf(section.id) } : section,
          ),
        })),
      delete: (id) =>
        Ref.modify(store, (tables) => {
          const [deleted, rows] = removeById(tables.sections, id);
          // ON DELETE CASCADE
          return [deleted, { ...tables, sections: rows, items: tables.items.filter((item) => item.sectionId !== id) }];
        }),
    });
  }),
);
