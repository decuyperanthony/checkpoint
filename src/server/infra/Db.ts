import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { Context, Effect, Layer, Redacted } from "effect";

import { AppConfig } from "./Config";
import * as schema from "./db/schema";

export class Db extends Context.Service<Db>()("checkpoint/Db", {
  make: Effect.gen(function* () {
    const { databaseUrl } = yield* AppConfig;
    const pool = yield* Effect.acquireRelease(
      Effect.sync(() => new Pool({ connectionString: Redacted.value(databaseUrl) })),
      (openPool) => Effect.promise(() => openPool.end()),
    );
    return drizzle({ client: pool, schema });
  }),
}) {
  static readonly layer = Layer.effect(this, this.make);
}
