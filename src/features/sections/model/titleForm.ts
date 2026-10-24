import { effectTsResolver } from "@hookform/resolvers/effect-ts";
import { Schema } from "effect";

import { SectionTitle } from "@/contract/schemas/Section";

// Forms validate with the same schema the API decodes with.
export const titleResolver = effectTsResolver(Schema.Struct({ value: SectionTitle }));
