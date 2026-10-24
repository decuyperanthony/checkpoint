import { Layer } from "effect";
import { HttpRouter } from "effect/http";

import { ApiHandlers } from "@/server/http";
import { RepositoriesMemory } from "@/server/repositories/RepositoriesMemory";
import { PinVerifierTest, testPin } from "@/server/testing/fixtures";

const build = () =>
  HttpRouter.toWebHandler(ApiHandlers.pipe(Layer.provide([RepositoriesMemory, PinVerifierTest])), {
    disableLogger: true,
  });

// The real API on an in-memory store, callable as `fetch`: screen tests exercise the same
// handlers, validation and errors as production, without a database or a hand-written mock.
// Like a browser, it keeps the session cookie the API sets and sends it back. It starts logged
// in, unless `loggedIn` is false.
export const makeFakeApi = ({ loggedIn = true }: { loggedIn?: boolean } = {}) => {
  let app = build();
  let cookie = "";

  const fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const request = new Request(input, init);
    if (cookie !== "") request.headers.set("cookie", cookie);
    const response = await app.handler(request);
    const setCookie = response.headers.get("set-cookie");
    if (setCookie !== null) {
      // `name=value`, as a browser sends it back; an emptied cookie is gone.
      const [pair = ""] = setCookie.split(";");
      cookie = pair.endsWith("=") ? "" : pair;
    }
    return response;
  };

  const logIn = () =>
    fetch("http://localhost/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ pin: testPin }),
      headers: { "content-type": "application/json" },
    });

  let ready = loggedIn ? logIn() : Promise.resolve();

  return {
    fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
      await ready;
      return fetch(input, init);
    },
    // As if the session had expired: the browser still sends a cookie the server no longer knows.
    expireSession: () => {
      cookie = "__Host-checkpoint_session=expired";
    },
    reset: async () => {
      await app.dispose();
      app = build();
      cookie = "";
      ready = loggedIn ? logIn() : Promise.resolve();
    },
  };
};
