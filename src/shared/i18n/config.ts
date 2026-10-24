import type fr from "./messages/fr.json";

// Adding a language: add its messages file, its code to `locales` and its catalog in
// `request.ts`, then pick the request locale there (cookie or Accept-Language).
export const locales = ["fr"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "fr";

// French is the reference: every other messages file must have the same keys.
export type Messages = typeof fr;

export const timeZone = "Europe/Paris";
