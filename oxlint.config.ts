import { defineConfig } from "oxlint";

// Import restrictions are composed per folder: oxlint overrides replace a rule's
// options instead of merging them, so each folder lists every restriction it needs.
type ImportRestriction = {
  readonly group: Array<string>;
  readonly message: string;
};

const features = ["sections", "items", "auth"] as const;

const shadcnAtoms: ImportRestriction = {
  group: [
    "@/shared/ui/primitives",
    "@/shared/ui/primitives/**",
    "**/shared/ui/primitives",
    "**/shared/ui/primitives/**",
  ],
  message: "shadcn atoms are only importable inside shared/ui.",
};

// Forbidding `../` makes every boundary below impossible to bypass with a relative path.
const parentImports: ImportRestriction = {
  group: ["../*", "../**"],
  message: "Import from outside the current folder through the @/ alias.",
};

const otherFeatures = (feature: (typeof features)[number]): ImportRestriction => ({
  group: ["@/features/*", "@/features/**", `!@/features/${feature}`, `!@/features/${feature}/**`],
  message: "A feature never imports another feature. Move shared code to shared/.",
});

const effectRuntime: ImportRestriction = {
  group: ["effect", "effect/**", "@effect/*", "@effect/**"],
  message: "No Effect in components: use the TanStack Query hooks from the feature api/.",
};

const database: ImportRestriction = {
  group: [
    "drizzle-orm",
    "drizzle-orm/**",
    "@neondatabase/*",
    "@neondatabase/**",
    "@/server/infra",
    "@/server/infra/**",
  ],
  message: "Services depend on repository interfaces, never on the database.",
};

const restrictImports = (...patterns: Array<ImportRestriction>) => ({
  "no-restricted-imports": ["error", { patterns }] satisfies ["error", { patterns: Array<ImportRestriction> }],
});

export default defineConfig({
  plugins: ["typescript", "unicorn", "oxc", "import", "react", "nextjs", "jsx-a11y", "vitest"],
  jsPlugins: ["./lint/checkpoint-plugin.ts"],
  categories: { correctness: "error", suspicious: "error" },
  rules: {
    "typescript/no-explicit-any": "error",
    "typescript/consistent-type-assertions": ["error", { assertionStyle: "never" }],
    "typescript/no-non-null-assertion": "error",
    "typescript/ban-ts-comment": ["error", { "ts-ignore": true, "ts-expect-error": true, "ts-nocheck": true }],
    "typescript/no-restricted-types": [
      "error",
      {
        types: {
          Record: { message: "Use a union of literal keys with a mapped type, or a type derived from a schema." },
        },
      },
    ],
    "typescript/consistent-type-definitions": ["error", "type"],
    "checkpoint/arrow-functions": "error",
    // The automatic JSX runtime does not need React in scope.
    "react/react-in-jsx-scope": "off",
    "import/no-unassigned-import": ["error", { allow: ["**/*.css", "@testing-library/jest-dom/vitest"] }],
    ...restrictImports(shadcnAtoms),
  },
  overrides: [
    { files: ["src/app/**/*.tsx"], rules: restrictImports(shadcnAtoms, effectRuntime) },
    { files: ["src/**/*.{ts,tsx}"], rules: { "checkpoint/design-tokens": "error" } },
    { files: ["src/shared/ui/**"], rules: restrictImports(effectRuntime) },
    // shadcn atoms are vendored as generated, so they can be updated with the shadcn CLI.
    {
      files: ["src/shared/ui/primitives/**"],
      rules: { "checkpoint/arrow-functions": "off", "checkpoint/design-tokens": "off" },
    },
    ...features.flatMap((feature) => [
      {
        files: [`src/features/${feature}/**`],
        rules: restrictImports(shadcnAtoms, otherFeatures(feature), parentImports),
      },
      {
        files: [`src/features/${feature}/ui/**`],
        rules: restrictImports(shadcnAtoms, otherFeatures(feature), parentImports, effectRuntime),
      },
    ]),
    { files: ["src/server/services/**"], rules: restrictImports(shadcnAtoms, database, parentImports) },
  ],
  ignorePatterns: [".next/**", "node_modules/**", "drizzle/**"],
});
