import { definePlugin, defineRule, type Ranged } from "@oxlint/plugins";

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

const paletteColor =
  /^-?(?:bg|text|text-shadow|border(?:-[trblxyse])?|ring(?:-offset)?|inset-ring|inset-shadow|outline|fill|stroke|from|via|to|decoration|shadow|accent|caret|divide|placeholder)-(?:white|black|(?:slate|gray|zinc|neutral|stone|mauve|olive|mist|taupe|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3})(?:\/\d+)?$/;

// `hover:bg-[#fff]` → `bg-[#fff]`. Variants may contain brackets themselves (`data-[state=open]:`).
const variantPrefix = /^(?:[^\s:[]*(?:\[[^\]]*\])?[^\s:[]*:)+/;

// `p-[13px]`, `gap-(--x)` or `[mask-type:alpha]`; plain text such as "Close (Esc)" does not match.
const arbitraryValue = /^(?:-?[a-z][a-z0-9-]*-[[(]|\[[a-z-]+:[^\]]+\]$)/;

const hardCodedStyle = (className: string) => {
  const utility = className.replace(variantPrefix, "").replace(/^!/, "");
  if (paletteColor.test(utility)) return `"${className}" uses a raw palette colour`;
  if (arbitraryValue.test(utility)) return `"${className}" uses an arbitrary value`;
  return undefined;
};

const designTokens = defineRule({
  meta: {
    type: "problem",
    docs: { description: "Style with design tokens only: no palette colours, arbitrary values or inline styles." },
    messages: {
      hardCoded: "{{reason}}: use a design token instead.",
      inlineStyle: "Inline styles bypass the design tokens: use a design-system component or token class.",
    },
  },
  create: (context) => {
    const checkClasses = (node: Ranged, text: string) => {
      for (const className of text.split(/\s+/)) {
        const reason = hardCodedStyle(className);
        if (reason !== undefined) context.report({ node, messageId: "hardCoded", data: { reason } });
      }
    };
    return {
      Literal: (node) => {
        if (typeof node.value === "string") checkClasses(node, node.value);
      },
      TemplateElement: (node) => checkClasses(node, node.value.cooked ?? node.value.raw),
      JSXAttribute: (node) => {
        if (node.name.type === "JSXIdentifier" && node.name.name === "style") {
          context.report({ node, messageId: "inlineStyle" });
        }
      },
    };
  },
});

export default definePlugin({
  meta: { name: "checkpoint" },
  rules: { "arrow-functions": arrowFunctions, "design-tokens": designTokens },
});
