import { Option } from "effect";

// New sections and items go last: right after the highest position, or first in an empty list.
export const nextPosition = Option.match({ onNone: () => 0, onSome: (last: number) => last + 1 });
