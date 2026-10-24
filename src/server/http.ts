import { Layer } from "effect";
import { HttpServer } from "effect/http";
import { HttpApiBuilder } from "effect/http-api";

import { Api } from "@/contract/api";
import { AuthHandlers } from "@/server/handlers/auth";
import { SessionAuthorization } from "@/server/handlers/authorization";
import { ItemsHandlers } from "@/server/handlers/items";
import { SectionsHandlers } from "@/server/handlers/sections";
import { AuthService } from "@/server/services/AuthService";
import { ItemService } from "@/server/services/ItemService";
import { SectionService } from "@/server/services/SectionService";

// The whole API, still waiting for its repositories and its PinVerifier: production provides
// the Drizzle and argon2 ones (main.ts), tests the in-memory ones with a test PIN.
export const ApiHandlers = HttpApiBuilder.layer(Api).pipe(
  Layer.provide([SectionsHandlers, ItemsHandlers, AuthHandlers]),
  // Its own step: the groups above need it.
  Layer.provide(SessionAuthorization),
  Layer.provide([SectionService.layer, ItemService.layer, AuthService.layer]),
  Layer.provide(HttpServer.layerServices),
);
