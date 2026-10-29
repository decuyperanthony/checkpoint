import { Context, type Effect, type Option } from "effect";

import type { Section, SectionId } from "@/contract/schemas/Section";

export type SectionDraft = Pick<Section, "title" | "position">;

export type SectionUpdate = { readonly id: SectionId; readonly changes: Pick<Section, "title"> };

export class SectionRepository extends Context.Service<
  SectionRepository,
  {
    readonly list: Effect.Effect<ReadonlyArray<Section>>;
    readonly exists: (id: SectionId) => Effect.Effect<boolean>;
    readonly lastPosition: Effect.Effect<Option.Option<number>>;
    readonly insert: (draft: SectionDraft) => Effect.Effect<Section>;
    readonly update: (input: SectionUpdate) => Effect.Effect<Option.Option<Section>>;
    // Numbers the sections after the order of `ids`, all or none.
    readonly arrange: (ids: ReadonlyArray<SectionId>) => Effect.Effect<void>;
    readonly delete: (id: SectionId) => Effect.Effect<Option.Option<SectionId>>;
  }
>()("checkpoint/SectionRepository") {}
