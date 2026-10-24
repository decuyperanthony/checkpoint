import { Option, Schema } from "effect";

// The fields a form can hold: schemas that decode without any service.
export type FormFields = { [name: string]: Schema.ConstraintDecoder<unknown> };

const hasMaxLength = (payload: unknown): payload is { maxLength: number } =>
  typeof payload === "object" && payload !== null && "maxLength" in payload && typeof payload.maxLength === "number";

// The `Schema.isMaxLength` limit among a field's checks, if it has one.
const maxLengthOf = (field: Schema.ConstraintDecoder<unknown>) =>
  (field.ast.checks ?? [])
    .map((check) => check.annotations?.representation)
    .find((representation) => representation?.id === "effect/schema/isMaxLength")?.payload;

// What a form needs to know about each field, read from the schema instead of written again:
// whether it accepts an empty value, and its length limit.
export const fieldFacts = (fields: FormFields) => ({
  required: (name: string) => {
    const field = fields[name];
    return field !== undefined && Option.isNone(Schema.decodeUnknownOption(field)(""));
  },
  maxLength: (name: string) => {
    const field = fields[name];
    const payload = field === undefined ? undefined : maxLengthOf(field);
    return hasMaxLength(payload) ? payload.maxLength : undefined;
  },
});
