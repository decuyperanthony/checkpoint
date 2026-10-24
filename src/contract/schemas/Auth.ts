import { Schema } from "effect";

// Digits only, so that phones show the numeric keypad.
export const Pin = Schema.String.check(Schema.isPattern(/^\d{4,12}$/)).pipe(Schema.brand("Pin"));
export type Pin = typeof Pin.Type;
