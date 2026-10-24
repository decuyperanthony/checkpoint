// The design tokens: the only scales design-system components may offer. Each component maps
// every step to Tailwind token classes (`satisfies TokenClasses<…>`): a missing step or an
// invented one (`huge`) fails compilation. Nothing outside shared/ui picks raw sizes or colours.

export const sizes = ["sm", "md", "lg", "xl"] as const;
export type Size = (typeof sizes)[number];

export const tones = ["info", "success", "warning", "error"] as const;
export type Tone = (typeof tones)[number];

// One class string per step of a scale, and no other step.
export type TokenClasses<T extends string> = { readonly [K in T]: string };
