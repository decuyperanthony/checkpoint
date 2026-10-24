import { Context, type Effect, type Option } from "effect";

import type { Section, SectionId } from "@/contract/schemas/Section";

export type SectionDraft = Pick<Section, "title" | "position">;

export type SectionRename = Pick<Section, "id" | "title">;

export class SectionRepository extends Context.Service<
  SectionRepository,
  {
    readonly list: Effect.Effect<ReadonlyArray<Section>>;
    readonly lastPosition: Effect.Effect<Option.Option<number>>;
    readonly insert: (draft: SectionDraft) => Effect.Effect<Section>;
    readonly updateTitle: (input: SectionRename) => Effect.Effect<Option.Option<Section>>;
    readonly delete: (id: SectionId) => Effect.Effect<Option.Option<SectionId>>;
  }
>()("checkpoint/SectionRepository") {}
