import { Layer } from "effect";
import { HttpRouter } from "effect/http";

import { ApiHandlers } from "@/server/http";
import { RepositoriesMemory } from "@/server/repositories/RepositoriesMemory";

const build = () => HttpRouter.toWebHandler(ApiHandlers.pipe(Layer.provide(RepositoriesMemory)), { disableLogger: true });

// The real API on an in-memory store, callable as `fetch`: screen tests exercise the same
// handlers, validation and errors as production, without a database or a hand-written mock.
export const makeFakeApi = () => {
  let app = build();
  return {
    fetch: (input: RequestInfo | URL, init?: RequestInit) => app.handler(new Request(input, init)),
    reset: async () => {
      await app.dispose();
      app = build();
    },
  };
};
