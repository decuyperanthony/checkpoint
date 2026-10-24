import { hashSync } from "@node-rs/argon2";
import { Effect, Layer, Redacted, Schema } from "effect";

import { Pin } from "@/contract/schemas/Auth";
import { AuthConfig } from "@/server/infra/Config";

import { PinVerifierArgon2 } from "@/server/security/PinVerifierArgon2";
import { RepositoriesMemory } from "@/server/repositories/RepositoriesMemory";
import { AuthService } from "@/server/services/AuthService";
import { ItemService } from "@/server/services/ItemService";
import { SectionService } from "@/server/services/SectionService";

// A valid uuid that no repository ever generates.
export const unknownUuid = "6f1c2a52-6a35-4d7e-9b51-0b8f0f1c9f3a";

// The PIN that tests log in with, and its hash in place of `PIN_HASH`.
export const testPin = Schema.decodeSync(Pin)("2468");
export const AuthConfigTest = Layer.succeed(AuthConfig, { pinHash: Redacted.make(hashSync(testPin)) });

const ServicesMemory = Layer.mergeAll(
  SectionService.layer,
  ItemService.layer,
  AuthService.layer.pipe(Layer.provide(PinVerifierArgon2), Layer.provide(AuthConfigTest)),
).pipe(Layer.provide(RepositoriesMemory));

// Runs a program against the services on a fresh in-memory store.
export const runServices = <A, E>(program: Effect.Effect<A, E, SectionService | ItemService | AuthService>) =>
  Effect.runPromise(program.pipe(Effect.provide(ServicesMemory)));
