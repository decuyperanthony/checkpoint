import { Context, Layer, Ref } from "effect";

import type { Item } from "@/contract/schemas/Item";
import type { Section } from "@/contract/schemas/Section";

type Tables = {
  readonly sections: ReadonlyArray<Section>;
  readonly items: ReadonlyArray<Item>;
};

// One store shared by the in-memory repositories, so they behave like a single database
// (deleting a section deletes its items, like ON DELETE CASCADE).
export class MemoryStore extends Context.Service<MemoryStore>()("checkpoint/MemoryStore", {
  make: Ref.make<Tables>({ sections: [], items: [] }),
}) {
  static readonly layer = Layer.effect(this, this.make);
}
