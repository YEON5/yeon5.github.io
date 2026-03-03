/** @type {import('tailwindcss').Config} */
module.exports = {
  // 모노레포 내의 모든 프레임워크와 패키지 경로를 통합 스캔합니다.
  content: [
    // 1. Next.js App (react-docs)
    "../../apps/react-docs/app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../apps/react-docs/components/**/*.{js,ts,jsx,tsx,mdx}", // (혹시 컴포넌트 폴더가 생길 경우를 대비)
    
    // 2. Nuxt App (vue-docs) - Nuxt 3의 app 폴더 구조 반영
    "../../apps/vue-docs/app/**/*.{js,ts,jsx,tsx,vue}",
    "../../apps/vue-docs/layouts/**/*.{js,ts,jsx,tsx,vue}",
    "../../apps/vue-docs/pages/**/*.{js,ts,jsx,tsx,vue}",
    
    // 3. React UI Components (Radix 기반 react-ui)
    "../../packages/react-ui/src/**/*.{js,ts,jsx,tsx}",
    "../../packages/react-ui/index.html",
    
    // 4. Vue UI Components (Reka 기반 vue-ui)
    "../../packages/vue-ui/src/**/*.{js,ts,jsx,tsx,vue}",
    "../../packages/vue-ui/index.html",
  ],

  // 나중에 디자인 시스템의 공통 컬러, 폰트 등을 여기에 정의하게 됩니다.
  theme: {
    extend: {
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
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate")
  ],
};