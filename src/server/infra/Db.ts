import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { Context, Effect, Layer, Redacted } from "effect";

import { AppConfig } from "./Config";
import * as schema from "./db/schema";

const makeDb = Effect.gen(function* () {
  const { databaseUrl } = yield* AppConfig;
  const pool = yield* Effect.acquireRelease(
    Effect.sync(() => new Pool({ connectionString: Redacted.value(databaseUrl) })),
    (openPool) => Effect.promise(() => openPool.end()),
  );
  return drizzle({ client: pool, schema });
});

export class Db extends Context.Service<Db, Effect.Success<typeof makeDb>>()("checkpoint/Db") {}

export const DbLive = Layer.effect(Db, makeDb);
