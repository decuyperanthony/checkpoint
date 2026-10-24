import { Context, Effect, Layer, Option } from "effect";

import { SectionNotFound } from "@/contract/errors/SectionNotFound";
import type { Section, SectionId } from "@/contract/schemas/Section";
import { SectionRepository } from "@/server/repositories/SectionRepository";

const notFound = (id: SectionId) => Effect.fromOption(() => new SectionNotFound({ id }));

// The service's shape is inferred from `make`. Each operation has a span named after it, in
// traces and in error stack traces (`Effect.fn` for functions, `withSpan` for `list`).
export class SectionService extends Context.Service<SectionService>()("checkpoint/SectionService", {
  make: Effect.gen(function* () {
    const repository = yield* SectionRepository;

    return {
      list: repository.list.pipe(Effect.withSpan("SectionService.list")),

      // New sections go last.
      create: Effect.fn("SectionService.create")(function* (title: Section["title"]) {
        const last = yield* repository.lastPosition;
        const position = Option.match(last, { onNone: () => 0, onSome: (value) => value + 1 });
        return yield* repository.insert({ title, position });
      }),

      rename: Effect.fn("SectionService.rename")(function* ({ id, title }: Pick<Section, "id" | "title">) {
        return yield* repository.update({ id, changes: { title } }).pipe(Effect.flatMap(notFound(id)));
      }),

      remove: Effect.fn("SectionService.remove")(function* (id: SectionId) {
        yield* repository.delete(id).pipe(Effect.flatMap(notFound(id)));
      }),
    };
  }),
}) {
  static readonly layer = Layer.effect(this, this.make);
}
