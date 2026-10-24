import { effectTsResolver } from "@hookform/resolvers/effect-ts";
import { Schema } from "effect";

// Validation for the single field of `AddForm` and `EditForm`, with the contract schema the API decodes it with.
export const textFormResolver = (schema: Schema.Codec<string, string>) =>
  effectTsResolver(Schema.Struct({ value: schema }));
