import { effectTsResolver } from "@hookform/resolvers/effect-ts";
import { Schema } from "effect";

import { ItemContent } from "@/contract/schemas/Item";

// Forms validate with the same schema the API decodes with.
export const contentResolver = effectTsResolver(Schema.Struct({ value: ItemContent }));
