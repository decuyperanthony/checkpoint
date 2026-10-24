import type { Locale, Messages } from "./config";

// Module augmentation is the documented way to type next-intl, and it only works with an
// interface: the `type`-only lint rule is disabled for this file alone.
declare module "next-intl" {
  interface AppConfig {
    Locale: Locale;
    Messages: Messages;
  }
}
