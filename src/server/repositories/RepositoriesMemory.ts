import { Layer } from "effect";

import { ItemRepositoryMemory } from "./ItemRepositoryMemory";
import { LoginAttemptRepositoryMemory } from "./LoginAttemptRepositoryMemory";
import { MemoryStore } from "./MemoryStore";
import { SectionRepositoryMemory } from "./SectionRepositoryMemory";
import { SessionRepositoryMemory } from "./SessionRepositoryMemory";

// Every repository on one fresh in-memory store: what tests provide instead of the database.
export const RepositoriesMemory = Layer.mergeAll(
  SectionRepositoryMemory,
  ItemRepositoryMemory,
  SessionRepositoryMemory,
  LoginAttemptRepositoryMemory,
).pipe(Layer.provide(MemoryStore.layer));
