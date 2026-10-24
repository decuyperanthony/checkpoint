import { randomUUID } from "node:crypto";

import { Array, Effect, Layer, Option, Order, Ref, Schema } from "effect";

import { SectionId, type Section } from "@/contract/schemas/Section";

import { SectionRepository } from "./SectionRepository";

const byPosition = Order.mapInput(Order.Number, (section: Section) => section.position);

// In-memory implementation for tests: same contract as the Drizzle one, no database.
// `toSorted` is stable, so equal positions keep insertion order, like the Drizzle tiebreaker.
export const SectionRepositoryMemory = Layer.effect(
  SectionRepository,
  Effect.gen(function* () {
    const sections = yield* Ref.make<ReadonlyArray<Section>>([]);

    return SectionRepository.of({
      list: Ref.get(sections).pipe(Effect.map((all) => all.toSorted(byPosition))),
      lastPosition: Ref.get(sections).pipe(
        Effect.map((all) =>
          Array.match(all, {
            onEmpty: Option.none,
            onNonEmpty: (some) => Option.some(Math.max(...some.map((s) => s.position))),
          }),
        ),
      ),
      insert: (draft) =>
        Effect.gen(function* () {
          const created: Section = { ...draft, id: Schema.decodeSync(SectionId)(randomUUID()) };
          yield* Ref.update(sections, Array.append(created));
          return created;
        }),
      updateTitle: ({ id, title }) =>
        Ref.modify(sections, (all) => {
          const updated = Array.findFirst(all, (s) => s.id === id).pipe(Option.map((s) => ({ ...s, title })));
          const next = Option.match(updated, {
            onNone: () => all,
            onSome: (section) => all.map((s) => (s.id === id ? section : s)),
          });
          return [updated, next];
        }),
      delete: (id) =>
        Ref.modify(sections, (all) => {
          const found = Array.findFirst(all, (s) => s.id === id).pipe(Option.map((s) => s.id));
          return [found, all.filter((s) => s.id !== id)];
        }),
    });
  }),
);
