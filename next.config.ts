import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/shared/i18n/request.ts");

const nextConfig: NextConfig = {
  typedRoutes: true,
  // Agent instructions live in CLAUDE.md and docs/best-practices.md: no generated AGENTS.md.
  agentRules: false,
};

export default withNextIntl(nextConfig);
