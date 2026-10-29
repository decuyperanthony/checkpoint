import { ConfigProvider, Effect, Option, Redacted } from "effect";
import { describe, expect, it } from "vitest";

import { ApiTokenConfig, AppConfig, AuthConfig } from "./Config";

type TestEnv = { readonly DATABASE_URL?: string; readonly PIN_HASH?: string; readonly API_TOKEN_HASH?: string };

const withEnv = (env: TestEnv) => Effect.provide(ConfigProvider.layer(ConfigProvider.fromEnv({ env })));

const configError = (env: TestEnv) => Effect.runPromise(AppConfig.make.pipe(Effect.flip, withEnv(env)));

describe("AppConfig", () => {
  it("names the variable when it is missing", async () => {
    const error = await configError({});

    expect(error.message).toBe("Environment variable DATABASE_URL is missing.");
  });

  it("treats a blank value as missing", async () => {
    const error = await configError({ DATABASE_URL: "  " });

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
    const config = await Effect.runPromise(AppConfig.make.pipe(withEnv({ DATABASE_URL: url })));

    expect(String(config.databaseUrl)).not.toContain("secret");
    expect(Redacted.value(config.databaseUrl)).toBe(url);
  });
});

const pinHash = "$argon2id$v=19$m=19456,t=2,p=1$c2FsdHNhbHRzYWx0$aGFzaGhhc2hoYXNoaGFzaGhhc2hoYXNoaGFzaA";

describe("AuthConfig", () => {
  it("reads an argon2id hash and keeps it redacted", async () => {
    const config = await Effect.runPromise(AuthConfig.make.pipe(withEnv({ PIN_HASH: pinHash })));

    expect(String(config.pinHash)).not.toContain("argon2id");
    expect(Redacted.value(config.pinHash)).toBe(pinHash);
  });

  it("refuses a PIN written in clear instead of its hash", async () => {
    const error = await Effect.runPromise(AuthConfig.make.pipe(Effect.flip, withEnv({ PIN_HASH: "1234" })));

    expect(error.message).toBe(
      "Environment variable PIN_HASH is invalid: expected an argon2id hash, from `pnpm hash-pin`.",
    );
    expect(error.message).not.toContain("1234");
  });
});

describe("ApiTokenConfig", () => {
  const digest = "a".repeat(64);

  it("accepts no token when the variable is absent or blank", async () => {
    const absent = await Effect.runPromise(ApiTokenConfig.make.pipe(withEnv({})));
    const blank = await Effect.runPromise(ApiTokenConfig.make.pipe(withEnv({ API_TOKEN_HASH: "  " })));

    expect(absent.tokenHash).toEqual(Option.none());
    expect(blank.tokenHash).toEqual(Option.none());
  });

  it("reads a SHA-256 digest and keeps it redacted", async () => {
    const config = await Effect.runPromise(ApiTokenConfig.make.pipe(withEnv({ API_TOKEN_HASH: digest })));

    const hash = Option.getOrThrow(config.tokenHash);
    expect(String(hash)).not.toContain(digest);
    expect(Redacted.value(hash)).toBe(digest);
  });

  it("names the variable without leaking its value when it is not a digest", async () => {
    const error = await Effect.runPromise(
      ApiTokenConfig.make.pipe(Effect.flip, withEnv({ API_TOKEN_HASH: "cp_the-token-itself" })),
    );

    expect(error.message).toBe(
      "Environment variable API_TOKEN_HASH is invalid: expected a SHA-256 hex digest, from `pnpm hash-api-token`.",
    );
    expect(error.message).not.toContain("the-token-itself");
  });
});
