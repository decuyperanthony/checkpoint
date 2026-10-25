import type { MetadataRoute } from "next";
import { getTranslations } from "next-intl/server";

// Installable as an app on a phone. Colours are the light theme's ground and line 12's green:
// a manifest cannot read the CSS tokens.
const manifest = async (): Promise<MetadataRoute.Manifest> => {
  const t = await getTranslations("app");

  return {
    name: t("title"),
    short_name: t("title"),
    description: t("description"),
    lang: "fr",
    start_url: "/",
    display: "standalone",
    background_color: "#fcfcfd",
    theme_color: "#00764f",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
};

export default manifest;
