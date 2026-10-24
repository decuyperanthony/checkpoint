import messages from "./messages/fr.json";

// French only for now: adding a language means adding a messages file and
// widening `Locale`, nothing else.
export const locale = "fr" as const;

export type Locale = typeof locale;

export type Messages = typeof messages;

export const timeZone = "Europe/Paris";

export { messages };
