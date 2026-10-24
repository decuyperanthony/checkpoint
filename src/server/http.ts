import { Layer } from "effect";
import { HttpServer } from "effect/http";
import { HttpApiBuilder } from "effect/http-api";

import { Api } from "@/contract/api";
import { ItemsHandlers } from "@/server/handlers/items";
import { SectionsHandlers } from "@/server/handlers/sections";
import { ItemService } from "@/server/services/ItemService";
import { SectionService } from "@/server/services/SectionService";

// The whole API, still waiting for its repositories: production provides the Drizzle ones
// (main.ts), tests provide the in-memory ones.
export const ApiHandlers = HttpApiBuilder.layer(Api).pipe(
  Layer.provide([SectionsHandlers, ItemsHandlers]),
  Layer.provide([SectionService.layer, ItemService.layer]),
  Layer.provide(HttpServer.layerServices),
);
