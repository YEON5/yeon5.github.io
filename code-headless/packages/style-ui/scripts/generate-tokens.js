const fs = require("fs");
const path = require("path");

const INPUT = path.resolve(__dirname, "../src/tokens/design-tokens.json");
const OUTPUT_JS = path.resolve(__dirname, "../src/design-tokens.js");
const OUTPUT_CSS = path.resolve(__dirname, "../src/design-tokens.css");

const tokens = JSON.parse(fs.readFileSync(INPUT, "utf-8"));

// ─────────────────────────────────────────────────────────────────────
// ✏️  Tailwind 클래스 접두사 설정
// 이 값을 바꾸면 모든 토큰 클래스에 반영됩니다.
//
// 현재: "pds"  →  bg-pds-mint-500, text-pds-xl, rounded-pds-md ...
// 변경 예시: "ds" →  bg-ds-mint-500, text-ds-xl, rounded-ds-md ...
// ─────────────────────────────────────────────────────────────────────
const { PREFIX, PREFIX_DASH } = require("../src/tokens-config");

/**
 * 그룹명·공통 접두사(color-, bg-)를 제거해 깔끔한 키를 추출합니다.
 * 새 색상 그룹이 JSON에 추가돼도 이 함수 하나로 처리됩니다.
 *
 * 예)
 *   gray  + "color-gray-200" → "200"
 *   gray  + "color-white"    → "white"
 *   mint  + "color-mint-500" → "500"
 *   banner+ "color-bg-green" → "green"
 *   states+ "dark-100-50"    → "dark-100-50"
 */
function cleanKey(group, rawKey) {
  return rawKey
    .replace(/^color-/, "")
    .replace(/^bg-/, "")
    .replace(new RegExp(`^${group}-`), "");
}

const colors = {};
const borderRadius = {};
const spacing = {};
const fontSize = {};
let cssVariables = ":root {\n";

// ── Colors ──────────────────────────────────────────────────────────
const colorGroups = tokens?.color?.color ?? {};

for (const [group, entries] of Object.entries(colorGroups)) {
  const groupKey = PREFIX ? `${PREFIX}-${group}` : group;
  colors[groupKey] = {};
  for (const [rawKey, token] of Object.entries(entries)) {
    if (token.type === "color" && token.value) {
      const clean = cleanKey(group, rawKey);
      colors[groupKey][clean] = token.value;
      cssVariables += `  --${PREFIX_DASH}${group}-${clean}: ${token.value};\n`;
    }
  }
}

// ── Border Radius ────────────────────────────────────────────────────
const radiusEntries = tokens?.["responsive-value-set"]?.radius ?? {};

for (const [rawKey, token] of Object.entries(radiusEntries)) {
  if (token.type === "dimension" && token.value) {
    const clean = rawKey.replace(/^radius-/, "");
    const radiusKey = PREFIX ? `${PREFIX}-${clean}` : clean;
    borderRadius[radiusKey] = token.value;
    cssVariables += `  --${PREFIX_DASH}radius-${clean}: ${token.value};\n`;
  }
}

// ── Spacing ──────────────────────────────────────────────────────────
const spacingEntries = tokens?.["responsive-value-set"]?.spacing ?? {};

for (const [rawKey, token] of Object.entries(spacingEntries)) {
  if (token.type === "dimension" && token.value) {
    const clean = rawKey.replace(/^spacing-/, "");
    const spacingKey = PREFIX ? `${PREFIX}-${clean}` : clean;
    spacing[spacingKey] = token.value;
    cssVariables += `  --${PREFIX_DASH}spacing-${clean}: ${token.value};\n`;
  }
}

// ── Font Size ─────────────────────────────────────────────────────────
const valueSet = tokens?.["responsive-value-set"] ?? {};

for (const [rawKey, token] of Object.entries(valueSet)) {
  if (rawKey.startsWith("text-") && token.type === "text" && token.value) {
    const remValue = `${parseFloat(token.value) / 10}rem`;
    const cleanText = rawKey.replace(/^text-/, ""); 
    
    const fontKey = PREFIX ? `${PREFIX}-${cleanText}` : cleanText;
    fontSize[fontKey] = remValue; 
    
    // rawKey는 이미 "text-4xl" 형태이므로 PREFIX_DASH만 앞에 붙임
    cssVariables += `  --${PREFIX_DASH}${rawKey}: ${remValue};\n`;
  }
}
cssVariables += "}\n";

// ── Output JS ─────────────────────────────────────────────────────────
const outputJs = `// Auto-generated from design-tokens.json — do not edit manually
// Run: npm run generate:tokens
module.exports = ${JSON.stringify({ colors, borderRadius, spacing, fontSize }, null, 2)};
`;

fs.writeFileSync(OUTPUT_JS, outputJs);
console.log("✓ design-tokens.js generated");

// ── Output CSS ────────────────────────────────────────────────────────
const outputCss = `/* Auto-generated from design-tokens.json — do not edit manually */
/* Run: npm run generate:tokens */
${cssVariables}`;

fs.writeFileSync(OUTPUT_CSS, outputCss);
console.log("✓ design-tokens.css generated");