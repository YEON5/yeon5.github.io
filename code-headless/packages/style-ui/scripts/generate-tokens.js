const fs = require("fs");
const path = require("path");

const INPUT  = path.resolve(__dirname, "../src/design-tokens.css");
const OUTPUT = path.resolve(__dirname, "../src/pds-tokens.js");

function parsePdsTokens(css) {
  const colors = {};
  const borderRadius = {};
  const spacing = {};
  const fontSize = {};

  const varRegex = /--(pds-[a-zA-Z0-9-]+)\s*:/g;
  let match;

  while ((match = varRegex.exec(css)) !== null) {
    const name = match[1];
    const cssVar = `var(--${name})`;

    // ── Colors ──────────────────────────────────────────────
    if (name.startsWith("pds-color-states-dark-")) {
      const key = name.replace("pds-color-states-dark-", "");
      (colors["pds-states-dark"] ??= {})[key] = cssVar;

    } else if (name.startsWith("pds-color-states-light-")) {
      const key = name.replace("pds-color-states-light-", "");
      (colors["pds-states-light"] ??= {})[key] = cssVar;

    } else if (name.startsWith("pds-color-gray-color-")) {
      const raw = name.replace("pds-color-gray-color-", "");
      const key = raw.startsWith("gray-") ? raw.replace("gray-", "") : raw;
      (colors["pds-gray"] ??= {})[key] = cssVar;

    } else if (name.startsWith("pds-color-mint-color-mint-")) {
      const key = name.replace("pds-color-mint-color-mint-", "");
      (colors["pds-mint"] ??= {})[key] = cssVar;

    } else if (name.startsWith("pds-color-banner-color-bg-")) {
      const key = name.replace("pds-color-banner-color-bg-", "");
      (colors["pds-banner"] ??= {})[key] = cssVar;

    // ── Border Radius ────────────────────────────────────────
    } else if (name.startsWith("pds-value-set-radius-radius-")) {
      const key = "pds-" + name.replace("pds-value-set-radius-radius-", "");
      borderRadius[key] = cssVar;

    // ── Spacing ──────────────────────────────────────────────
    } else if (name.startsWith("pds-value-set-spacing-spacing-")) {
      const key = "pds-" + name.replace("pds-value-set-spacing-spacing-", "");
      spacing[key] = cssVar;

    // ── Font Size ────────────────────────────────────────────
    } else if (name.startsWith("pds-value-set-text-")) {
      const key = "pds-" + name.replace("pds-value-set-text-", "");
      fontSize[key] = cssVar;
    }
  }

  return { colors, borderRadius, spacing, fontSize };
}

const css = fs.readFileSync(INPUT, "utf-8");
const tokens = parsePdsTokens(css);

const output = `// Auto-generated from design-tokens.css — do not edit manually
// Run: npm run generate:tokens
module.exports = ${JSON.stringify(tokens, null, 2)};
`;

fs.writeFileSync(OUTPUT, output);
console.log("✓ pds-tokens.js generated from design-tokens.css");
