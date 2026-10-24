import { Layer } from "effect";
import { HttpRouter } from "effect/http";

import { ApiHandlers } from "@/server/http";
import { AppConfig } from "@/server/infra/Config";
import { Db } from "@/server/infra/Db";
import { ItemRepositoryDrizzle } from "@/server/repositories/ItemRepositoryDrizzle";
import { SectionRepositoryDrizzle } from "@/server/repositories/SectionRepositoryDrizzle";

const RepositoriesDrizzle = Layer.mergeAll(SectionRepositoryDrizzle, ItemRepositoryDrizzle).pipe(
  Layer.provide(Db.layer),
  Layer.provide(AppConfig.layer),
);

// Built once per server instance. If a Layer fails to build (missing variable, for instance),
// every request fails with that error and it is logged with its explicit message.
const { handler } = HttpRouter.toWebHandler(ApiHandlers.pipe(Layer.provide(RepositoriesDrizzle)));

// Next route handlers receive `(request, context)`: this keeps the exported signature to `(request)`.
export const handleApiRequest = (request: Request) => handler(request);
