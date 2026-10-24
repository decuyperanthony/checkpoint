import { Layer } from "effect";

import { ItemRepositoryMemory } from "./ItemRepositoryMemory";
import { MemoryStore } from "./MemoryStore";
import { SectionRepositoryMemory } from "./SectionRepositoryMemory";

// Every repository on one fresh in-memory store: what tests provide instead of the database.
export const RepositoriesMemory = Layer.mergeAll(SectionRepositoryMemory, ItemRepositoryMemory).pipe(
  Layer.provide(MemoryStore.layer),
);
