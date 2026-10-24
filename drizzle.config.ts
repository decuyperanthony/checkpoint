import { defineConfig } from "drizzle-kit";
import { Effect, Redacted } from "effect";

import { AppConfig } from "./src/server/infra/Config";

// Same Config as the server: a missing or invalid variable stops drizzle-kit with an explicit message.
const { databaseUrl } = Effect.runSync(AppConfig.make);

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/server/infra/db/schema.ts",
  out: "./drizzle",
  dbCredentials: { url: Redacted.value(databaseUrl) },
});
