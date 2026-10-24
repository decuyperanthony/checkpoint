import { Effect } from "effect";
import { HttpApiBuilder } from "effect/http-api";

import { Api } from "@/contract/api";
import { SectionService } from "@/server/services/SectionService";

export const SectionsHandlers = HttpApiBuilder.group(
  Api,
  "sections",
  Effect.fnUntraced(function* (handlers) {
    const sections = yield* SectionService;

    return handlers
      .handle("list", () => sections.list)
      .handle("create", ({ payload }) => sections.create(payload.title))
      .handle("rename", ({ params, payload }) => sections.rename({ id: params.id, title: payload.title }))
      .handle("remove", ({ params }) => sections.remove(params.id));
  }),
);
