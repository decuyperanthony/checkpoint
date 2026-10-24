import { Schema } from "effect";

import { ItemNotFound } from "@/contract/errors/ItemNotFound";
import { SectionNotFound } from "@/contract/errors/SectionNotFound";

// Every error the API can answer with. The front maps each `_tag` to a message.
export const ContractError = Schema.Union([SectionNotFound, ItemNotFound]);
export type ContractError = typeof ContractError.Type;
