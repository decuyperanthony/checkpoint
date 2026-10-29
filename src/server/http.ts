import { Layer } from "effect";
import { HttpServer } from "effect/http";
import { HttpApiBuilder, HttpApiScalar } from "effect/http-api";

import { Api } from "@/contract/api";
import { AuthHandlers } from "@/server/handlers/auth";
import { ApiAuthorization } from "@/server/handlers/authorization";
import { ItemsHandlers } from "@/server/handlers/items";
import { SectionsHandlers } from "@/server/handlers/sections";
import { AuthService } from "@/server/services/AuthService";
import { ItemService } from "@/server/services/ItemService";
import { SectionService } from "@/server/services/SectionService";

// The whole API, still waiting for its repositories, its PinVerifier and its ApiTokenVerifier:
// production provides the Drizzle, argon2 and SHA-256 ones (main.ts), tests the in-memory ones
// with a test PIN and a test token.
//
// Its reference (Scalar, from the OpenAPI document built from the contract) is served at
// `/api/docs`. It describes the endpoints and holds no data, so it needs no session.
export const ApiHandlers = HttpApiBuilder.layer(Api).pipe(
  Layer.provideMerge(HttpApiScalar.layerCdn(Api, { path: "/api/docs", version: "1.43.5" })),
  Layer.provide([SectionsHandlers, ItemsHandlers, AuthHandlers]),
  // Its own step: the groups above need it.
  Layer.provide(ApiAuthorization),
  Layer.provide([SectionService.layer, ItemService.layer, AuthService.layer]),
  Layer.provide(HttpServer.layerServices),
);
