const pds = require("./src/design-tokens");

// PREFIX_DASH를 가져옵니다.
const { PREFIX_DASH } = require("./src/tokens-config");

module.exports = {
  // PREFIX_DASH는 내부적으로 하이픈을 포함하거나 빈 문자열입니다.
  safelist: [
    { pattern: new RegExp(`^bg-${PREFIX_DASH}`) },
    { pattern: new RegExp(`^text-${PREFIX_DASH}`) },
    { pattern: new RegExp(`^border-${PREFIX_DASH}`) },
    { pattern: new RegExp(`^rounded-${PREFIX_DASH}`) },
    { pattern: new RegExp(`^p-${PREFIX_DASH}`) },
    { pattern: new RegExp(`^px-${PREFIX_DASH}`) },
    { pattern: new RegExp(`^py-${PREFIX_DASH}`) },
    { pattern: new RegExp(`^pt-${PREFIX_DASH}`) },
    { pattern: new RegExp(`^pb-${PREFIX_DASH}`) },
    { pattern: new RegExp(`^pl-${PREFIX_DASH}`) },
    { pattern: new RegExp(`^pr-${PREFIX_DASH}`) },
    { pattern: new RegExp(`^m-${PREFIX_DASH}`) },
    { pattern: new RegExp(`^mx-${PREFIX_DASH}`) },
    { pattern: new RegExp(`^my-${PREFIX_DASH}`) },
    { pattern: new RegExp(`^mt-${PREFIX_DASH}`) },
    { pattern: new RegExp(`^mb-${PREFIX_DASH}`) },
    { pattern: new RegExp(`^ml-${PREFIX_DASH}`) },
    { pattern: new RegExp(`^mr-${PREFIX_DASH}`) },
    { pattern: new RegExp(`^gap-${PREFIX_DASH}`) },
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
