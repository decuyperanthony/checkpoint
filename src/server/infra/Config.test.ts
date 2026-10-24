import { ConfigProvider, Effect, Redacted } from "effect";
import { describe, expect, it } from "vitest";

import { loadAppConfig } from "./Config";

const withEnv = (env: { readonly DATABASE_URL?: string }) =>
  Effect.provide(ConfigProvider.layer(ConfigProvider.fromEnv({ env })));

const configError = (env: { readonly DATABASE_URL?: string }) =>
  Effect.runPromise(loadAppConfig.pipe(Effect.flip, withEnv(env)));

describe("loadAppConfig", () => {
  it("names the variable when it is missing", async () => {
    const error = await configError({});

    expect(error.message).toBe("Environment variable DATABASE_URL is missing.");
  });

  it("names the variable without leaking its value when it is invalid", async () => {
    const error = await configError({ DATABASE_URL: "mysql://user:secret@host/db" });

    expect(error.message).toBe(
      "Environment variable DATABASE_URL is invalid: expected a postgres:// connection string.",
    );
    expect(error.message).not.toContain("secret");
  });

  it("keeps the database url redacted", async () => {
    const url = "postgresql://user:secret@host/db";
    const config = await Effect.runPromise(loadAppConfig.pipe(withEnv({ DATABASE_URL: url })));

    expect(String(config.databaseUrl)).not.toContain("secret");
    expect(Redacted.value(config.databaseUrl)).toBe(url);
  });
});
