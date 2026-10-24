import { getRequestConfig } from "next-intl/server";

import { defaultLocale, timeZone, type Locale, type Messages } from "./config";

// Static imports per locale keep the messages typed (a template-string import would be `any`)
// and only load the requested locale.
const catalogs = {
  fr: () => import("./messages/fr.json"),
} satisfies { [K in Locale]: () => Promise<{ default: Messages }> };

export default getRequestConfig(async () => ({
  locale: defaultLocale,
  messages: (await catalogs[defaultLocale]()).default,
  timeZone,
}));
