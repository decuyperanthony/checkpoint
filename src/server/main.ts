import { Layer } from "effect";
import { HttpRouter } from "effect/http";

import { AppConfigLive } from "@/server/infra/Config";
import { DbLive } from "@/server/infra/Db";
import { ApiLive } from "@/server/http";
import { SectionRepositoryDrizzle } from "@/server/repositories/SectionRepositoryDrizzle";

const RepositoriesLive = SectionRepositoryDrizzle.pipe(Layer.provide(DbLive), Layer.provide(AppConfigLive));

// Built once per server instance. If a Layer fails to build (missing variable, for instance),
// every request fails with that error and it is logged with its explicit message.
const { handler } = HttpRouter.toWebHandler(ApiLive.pipe(Layer.provide(RepositoriesLive)));

// Next passes route context as a second argument, which must not reach Effect.
export const handleApiRequest = (request: Request) => handler(request);
