import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// Frozen timezone and locale so date and number formatting are deterministic.
// Set here, before the test workers are forked, so they inherit them at startup.
process.env.TZ = "UTC";
process.env.LANG = "fr_FR.UTF-8";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    passWithNoTests: true,
  },
});
