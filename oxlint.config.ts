import { defineConfig } from "oxlint";

// Import restrictions are composed per folder: oxlint overrides replace a rule's
// options instead of merging them, so each folder lists every restriction it needs.
const shadcnAtoms = {
  group: ["@/shared/ui/primitives", "@/shared/ui/primitives/*"],
  message: "shadcn atoms are only importable inside shared/ui.",
};

const otherFeatures = {
  group: ["@/features/*", "@/features/**", "../../*", "../../**"],
  message: "A feature never imports another feature. Move shared code to shared/.",
};

const effectRuntime = {
  group: ["effect", "effect/*"],
  message: "No Effect in components: use the TanStack Query hooks from the feature api/.",
};

const database = {
  group: ["drizzle-orm", "drizzle-orm/*", "@neondatabase/*", "@/server/infra/*"],
  message: "Services depend on repository interfaces, never on the database.",
};

type ImportRestriction = typeof shadcnAtoms;

const restrictImports = (...patterns: Array<ImportRestriction>) => ({
  "no-restricted-imports": ["error", { patterns }] satisfies ["error", { patterns: Array<ImportRestriction> }],
});

export default defineConfig({
  plugins: ["typescript", "unicorn", "oxc", "import", "react", "nextjs", "jsx-a11y", "vitest"],
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
    "func-style": ["error", "expression"],
    // The automatic JSX runtime does not need React in scope.
    "react/react-in-jsx-scope": "off",
    "import/no-unassigned-import": ["error", { allow: ["**/*.css", "@testing-library/jest-dom/vitest"] }],
    ...restrictImports(shadcnAtoms),
  },
  overrides: [
    { files: ["src/shared/ui/**"], rules: { "no-restricted-imports": "off" } },
    { files: ["src/features/**"], rules: restrictImports(shadcnAtoms, otherFeatures) },
    { files: ["src/features/*/ui/**"], rules: restrictImports(shadcnAtoms, otherFeatures, effectRuntime) },
    { files: ["src/server/services/**"], rules: restrictImports(shadcnAtoms, database) },
  ],
  ignorePatterns: [".next/**", "node_modules/**", "drizzle/**"],
});
