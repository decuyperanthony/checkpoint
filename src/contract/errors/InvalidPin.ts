import { Schema } from "effect";

export class InvalidPin extends Schema.TaggedError<InvalidPin>()("InvalidPin", {}, { httpApiStatus: 401 }) {}
