import { getRequestConfig } from "next-intl/server";

import { locale, messages, timeZone } from "./config";

export default getRequestConfig(async () => ({ locale, messages, timeZone }));
