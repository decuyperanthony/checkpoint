import { definePlugin, defineRule } from "@oxlint/plugins";

// Generators have no arrow form, and methods (class members, object shorthand) are not
// standalone functions, so both stay allowed.
const arrowFunctions = defineRule({
  meta: {
    type: "suggestion",
    docs: { description: "Use arrow functions instead of the `function` keyword." },
    messages: { useArrow: "Use an arrow function instead of the `function` keyword." },
  },
  create: (context) => ({
    FunctionDeclaration: (node) => {
      if (!node.generator) context.report({ node, messageId: "useArrow" });
    },
    FunctionExpression: (node) => {
      const isMethod =
        node.parent.type === "MethodDefinition" ||
        (node.parent.type === "Property" && (node.parent.method || node.parent.kind !== "init"));
      if (!node.generator && !isMethod) context.report({ node, messageId: "useArrow" });
    },
  }),
});

export default definePlugin({
  meta: { name: "checkpoint" },
  rules: { "arrow-functions": arrowFunctions },
});
