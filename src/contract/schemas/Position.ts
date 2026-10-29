import { Schema } from "effect";

// A place in an ordered list, counted from 0.
export const Position = Schema.Int.check(Schema.isGreaterThanOrEqualTo(0));
export type Position = typeof Position.Type;
