import { Context, Layer, Ref } from "effect";

import type { Item } from "@/contract/schemas/Item";
import type { Section } from "@/contract/schemas/Section";

import type { LoginAttempt } from "./LoginAttemptRepository";
import type { SessionDraft } from "./SessionRepository";

type Tables = {
  readonly sections: ReadonlyArray<Section>;
  readonly items: ReadonlyArray<Item>;
  readonly sessions: ReadonlyArray<SessionDraft>;
  readonly loginAttempts: ReadonlyArray<LoginAttempt>;
};

// One store shared by the in-memory repositories, so they behave like a single database
// (deleting a section deletes its items, like ON DELETE CASCADE).
export class MemoryStore extends Context.Service<MemoryStore>()("checkpoint/MemoryStore", {
  make: Ref.make<Tables>({ sections: [], items: [], sessions: [], loginAttempts: [] }),
}) {
  static readonly layer = Layer.effect(this, this.make);
}
