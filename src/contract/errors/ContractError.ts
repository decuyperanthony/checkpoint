import { Schema } from "effect";
import type { HttpApi, HttpApiEndpoint, HttpApiGroup } from "effect/http-api";

import type { Api } from "@/contract/api";
import { ItemNotFound } from "@/contract/errors/ItemNotFound";
import { SectionNotFound } from "@/contract/errors/SectionNotFound";

// Every error the API can answer with. The front maps each `_tag` to a message.
export const ContractError = Schema.Union([SectionNotFound, ItemNotFound]);
export type ContractError = typeof ContractError.Type;

type ApiGroups = typeof Api extends HttpApi.HttpApi<infer _Id, infer Groups> ? Groups : never;
type ApiErrors = HttpApiEndpoint.Errors<HttpApiGroup.Endpoints<ApiGroups>>;

// Fails to compile when an endpoint declares an error missing from `ContractError`,
// which the front would otherwise treat as unexpected.
export type EveryApiErrorIsListed = [ApiErrors] extends [ContractError] ? true : never;
export const everyApiErrorIsListed: EveryApiErrorIsListed = true;
