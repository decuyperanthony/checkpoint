import { Config, Context, Effect, Layer, Option, Redacted, Schema } from "effect";

export class InvalidEnvironment extends Schema.TaggedError<InvalidEnvironment>()("InvalidEnvironment", {
  variable: Schema.String,
  reason: Schema.String,
}) {
  override get message() {
    return `Environment variable ${this.variable} ${this.reason}.`;
  }
}

// Reads one variable and names it in the error. The value itself never appears in
// the error, since most variables are secrets.
type EnvironmentVariable<A> = {
  readonly name: string;
  readonly schema: Schema.Codec<A, string>;
  readonly expected: string;
};

const environmentVariable = <A>({ name, schema, expected }: EnvironmentVariable<A>) =>
  Effect.gen(function* () {
    const raw = yield* Config.option(Config.String(name)).pipe(
      Config.map(Option.filter((value) => value.trim() !== "")),
    );
    if (Option.isNone(raw)) {
      return yield* new InvalidEnvironment({ variable: name, reason: "is missing" });
    }
    return yield* Schema.decodeEffect(schema)(raw.value).pipe(
      Effect.mapError(() => new InvalidEnvironment({ variable: name, reason: `is invalid: expected ${expected}` })),
    );
  });

const PostgresUrl = Schema.String.check(Schema.isPattern(/^postgres(ql)?:\/\/.+/));

export const loadAppConfig = Effect.gen(function* () {
  const databaseUrl = yield* environmentVariable({
    name: "DATABASE_URL",
    schema: PostgresUrl,
    expected: "a postgres:// connection string",
  });
  return { databaseUrl: Redacted.make(databaseUrl) };
});

export class AppConfig extends Context.Service<AppConfig, Effect.Success<typeof loadAppConfig>>()(
  "checkpoint/AppConfig",
) {}

export const AppConfigLive = Layer.effect(AppConfig, loadAppConfig);
