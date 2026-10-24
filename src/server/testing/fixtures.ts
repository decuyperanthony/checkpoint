import { Effect, Layer } from "effect";

import { RepositoriesMemory } from "@/server/repositories/RepositoriesMemory";
import { ItemService } from "@/server/services/ItemService";
import { SectionService } from "@/server/services/SectionService";

// A valid uuid that no repository ever generates.
export const unknownUuid = "6f1c2a52-6a35-4d7e-9b51-0b8f0f1c9f3a";

const ServicesMemory = Layer.mergeAll(SectionService.layer, ItemService.layer).pipe(Layer.provide(RepositoriesMemory));

// Runs a program against the services on a fresh in-memory store.
export const runServices = <A, E>(program: Effect.Effect<A, E, SectionService | ItemService>) =>
  Effect.runPromise(program.pipe(Effect.provide(ServicesMemory)));
