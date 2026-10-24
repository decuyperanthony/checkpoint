import { Context, Effect, Layer, Option } from "effect";

import { SectionNotFound } from "@/contract/errors/SectionNotFound";
import type { Section, SectionId } from "@/contract/schemas/Section";
import { SectionRepository } from "@/server/repositories/SectionRepository";

const notFound = (id: SectionId) => Effect.fromOption(() => new SectionNotFound({ id }));

const make = Effect.gen(function* () {
  const repository = yield* SectionRepository;

  return {
    list: repository.list,

    // New sections go last.
    create: (title: Section["title"]) =>
      repository.lastPosition.pipe(
        Effect.map(Option.match({ onNone: () => 0, onSome: (last) => last + 1 })),
        Effect.flatMap((position) => repository.insert({ title, position })),
      ),

    rename: ({ id, title }: Pick<Section, "id" | "title">) =>
      repository.update({ id, changes: { title } }).pipe(Effect.flatMap(notFound(id))),

    remove: (id: SectionId) => repository.delete(id).pipe(Effect.flatMap(notFound(id)), Effect.asVoid),
  };
});

export class SectionService extends Context.Service<SectionService, Effect.Success<typeof make>>()(
  "checkpoint/SectionService",
) {}

export const SectionServiceLive = Layer.effect(SectionService, make);
