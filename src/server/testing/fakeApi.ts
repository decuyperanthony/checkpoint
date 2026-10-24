import { Layer } from "effect";
import { HttpRouter } from "effect/http";

import { ApiHandlers } from "@/server/http";
import { RepositoriesMemory } from "@/server/repositories/RepositoriesMemory";
import { PinVerifierTest, testPin } from "@/server/testing/fixtures";

const build = () =>
  HttpRouter.toWebHandler(ApiHandlers.pipe(Layer.provide([RepositoriesMemory, PinVerifierTest])), {
    disableLogger: true,
  });

// The `name=value` part of a Set-Cookie header, as a browser would send it back.
const sessionCookieOf = (response: Response) => response.headers.get("set-cookie")?.split(";")[0] ?? "";

const logIn = async (app: ReturnType<typeof build>) => {
  const response = await app.handler(
    new Request("http://localhost/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ pin: testPin }),
      headers: { "content-type": "application/json" },
    }),
  );
  return sessionCookieOf(response);
};

// The real API on an in-memory store, callable as `fetch`: screen tests exercise the same
// handlers, validation and errors as production, without a database or a hand-written mock.
// It starts logged in and sends the session cookie back, like the browser.
export const makeFakeApi = () => {
  let app = build();
  let cookie = logIn(app);

  return {
    fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
      const request = new Request(input, init);
      request.headers.set("cookie", await cookie);
      return app.handler(request);
    },
    reset: async () => {
      await app.dispose();
      app = build();
      cookie = logIn(app);
    },
  };
};
