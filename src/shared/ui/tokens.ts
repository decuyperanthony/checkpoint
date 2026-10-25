// The design tokens: the only scales design-system components may offer. Each component maps
// every step to Tailwind token classes (`satisfies TokenClasses<…>`): a missing step or an
// invented one (`huge`) fails compilation. Nothing outside shared/ui picks raw sizes or colours.

export const sizes = ["sm", "md", "lg", "xl"] as const;
export type Size = (typeof sizes)[number];

export const tones = ["info", "success", "warning", "error"] as const;
export type Tone = (typeof tones)[number];

// The line colours a section can take, in the order they are handed out.
export const lineColors = ["green", "blue", "magenta", "orange", "yellow", "sky"] as const;
export type LineColor = (typeof lineColors)[number];

// The n-th section's line: colours repeat past the sixth.
export const lineColorAt = (index: number): LineColor => lineColors[index % lineColors.length] ?? "green";

// One class string per step of a scale, and no other step.
export type TokenClasses<T extends string> = { [K in T]: string };
