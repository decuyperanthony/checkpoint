import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// Frozen timezone and locale so date and number formatting are deterministic.
// Set here, before the test workers are forked, so they inherit them at startup.
Object.assign(process.env, { TZ: "UTC", LANG: "fr_FR.UTF-8", LC_ALL: "fr_FR.UTF-8" });

export default defineConfig({
  plugins: [react()],
  resolve: { tsconfigPaths: true },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    passWithNoTests: true,
  },
});
