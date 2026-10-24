import { Layer } from "effect";
import { HttpServer } from "effect/http";
import { HttpApiBuilder } from "effect/http-api";

import { Api } from "@/contract/api";
import { SectionsHandlers } from "@/server/handlers/sections";
import { SectionService } from "@/server/services/SectionService";

// The whole API, still waiting for its repositories: production provides the Drizzle ones
// (main.ts), tests provide the in-memory ones.
export const ApiLive = HttpApiBuilder.layer(Api).pipe(
  Layer.provide(SectionsHandlers),
  Layer.provide(SectionService.layer),
  Layer.provide(HttpServer.layerServices),
);
