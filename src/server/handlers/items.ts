import { Effect } from "effect";
import { HttpApiBuilder } from "effect/http-api";

import { Api } from "@/contract/api";
import { ItemService } from "@/server/services/ItemService";

export const ItemsHandlers = HttpApiBuilder.group(
  Api,
  "items",
  Effect.fnUntraced(function* (handlers) {
    const items = yield* ItemService;

    return handlers
      .handle("list", () => items.list)
      .handle("create", ({ params, payload }) => items.create({ sectionId: params.id, content: payload.content }))
      .handle("update", ({ params, payload }) => items.update({ id: params.id, changes: payload }))
      .handle("move", ({ params, payload }) =>
        items.move({ id: params.id, sectionId: payload.sectionId, position: payload.position }),
      )
      .handle("remove", ({ params }) => items.remove(params.id));
  }),
);
