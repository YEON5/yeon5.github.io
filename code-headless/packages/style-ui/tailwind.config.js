/** @type {import('tailwindcss').Config} */
const pds = require("./src/design-tokens");
const { PREFIX } = require("./src/tokens-config");

module.exports = {
  // PDS 토큰 클래스는 빌드 후 어디서든 자유롭게 사용 가능하도록 항상 포함
  // PREFIX는 tokens-config.js 에서 관리 — 여기서 수정 불필요
  safelist: [
    { pattern: new RegExp(`^bg-${PREFIX}-`) },
    { pattern: new RegExp(`^text-${PREFIX}-`) },
    { pattern: new RegExp(`^border-${PREFIX}-`) },
    { pattern: new RegExp(`^rounded-${PREFIX}-`) },
    { pattern: new RegExp(`^p-${PREFIX}-`) },
    { pattern: new RegExp(`^px-${PREFIX}-`) },
    { pattern: new RegExp(`^py-${PREFIX}-`) },
    { pattern: new RegExp(`^pt-${PREFIX}-`) },
    { pattern: new RegExp(`^pb-${PREFIX}-`) },
    { pattern: new RegExp(`^pl-${PREFIX}-`) },
    { pattern: new RegExp(`^pr-${PREFIX}-`) },
    { pattern: new RegExp(`^m-${PREFIX}-`) },
    { pattern: new RegExp(`^mx-${PREFIX}-`) },
    { pattern: new RegExp(`^my-${PREFIX}-`) },
    { pattern: new RegExp(`^mt-${PREFIX}-`) },
    { pattern: new RegExp(`^mb-${PREFIX}-`) },
    { pattern: new RegExp(`^ml-${PREFIX}-`) },
    { pattern: new RegExp(`^mr-${PREFIX}-`) },
    { pattern: new RegExp(`^gap-${PREFIX}-`) },
  ],

  content: [
    // 1. Next.js App (react-docs)
    "../../apps/react-docs/app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../apps/react-docs/components/**/*.{js,ts,jsx,tsx,mdx}",

    // 2. Nuxt App (vue-docs)
    "../../apps/vue-docs/app/**/*.{js,ts,jsx,tsx,vue}",
    "../../apps/vue-docs/layouts/**/*.{js,ts,jsx,tsx,vue}",
    "../../apps/vue-docs/pages/**/*.{js,ts,jsx,tsx,vue}",

    // 3. React UI Components
    "../../packages/react-ui/src/**/*.{js,ts,jsx,tsx}",
    "../../packages/react-ui/index.html",

    // 4. Vue UI Components
    "../../packages/vue-ui/src/**/*.{js,ts,jsx,tsx,vue}",
    "../../packages/vue-ui/index.html",
  ],

  theme: {
    extend: {
      // 기존 시맨틱 컬러 (bg-background, text-foreground 등)
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // PDS 디자인 토큰 컬러 (design-tokens.js에서 자동 주입)
        ...pds.colors,
      },

      // 기존 시맨틱 radius + PDS radius
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        ...pds.borderRadius,
      },

      // PDS spacing / fontSize
      spacing: pds.spacing,
      fontSize: pds.fontSize,

      // Accordion 애니메이션 (Radix UI accordion-content height 애니메이션)
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },

  plugins: [require("tailwindcss-animate")],
};
