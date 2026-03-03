## code-basic

## code-vite-ts

@ 이미지 경로 예시 (public/assets/images)
HTML: <img src="/assets/images/logo.png">
SCSS: background-image: url('/assets/images/bg.png');



## code-headless

# react: radix 설치 방법
1.Shadcn UI
cmd: npx shadcn@latest init

설치가 완료되면 shadcn ui에서 원하는 컴포넌트를 명령어로 실행
* 기본 형식
npx shadcn@latest add [컴포넌트이름]

* 예시: 입력창(Input)이 필요할 때
npx shadcn@latest add input

* 예시: 여러 개를 한 번에 추가하고 싶을 때 (띄어쓰기로 구분)
npx shadcn@latest add input button card dialog

* 설치모드 방식
npx shadcn@latest add


2.radix로 설치
npm install @radix-ui/react-tabs


# vue reka ui 설치 방법

설치 방법
npm install reka-ui


----------------------------------------------------------------------------------------------------

## build
루트 경로 에서 (_pub\ui-codeview\code-headless>)
: npm run build -w packages/style-ui



## 서버 실행 방법
: npm run dev -w apps/react-docs
: npm run dev -w apps/vue-docs

: npm run dev -w packages/react-ui
: npm run dev -w packages/vue-ui





code-headless/
├── _note.md
├── .prettierignore
├── .prettierrc
├── package-lock.json
├── package.json
├── apps/
│   ├── react-docs/
│   │   ├── eslint.config.mjs
│   │   ├── next-env.d.ts
│   │   ├── next.config.ts
│   │   ├── package.json
│   │   ├── postcss.config.mjs
│   │   ├── README.md
│   │   ├── tailwind.config.ts
│   │   ├── tsconfig.json
│   │   ├── app/
│   │   │   ├── accordion/
│   │   │   │   └── page.tsx
│   │   │   ├── tabs/
│   │   │   │   └── page.tsx
│   │   │   ├── favicon.ico
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   └── public/
│   │       ├── file.svg
│   │       ├── globe.svg
│   │       ├── next.svg
│   │       ├── vercel.svg
│   │       └── window.svg
│   └── vue-docs/
│       ├── nuxt.config.ts
│       ├── package.json
│       ├── README.md
│       ├── tailwind.config.js
│       ├── tsconfig.json
│       ├── app/
│       │   ├── layouts/
│       │   │   └── default.vue
│       │   ├── pages/
│       │   │   ├── tabs/
│       │   │   │   └── index.vue
│       │   │   └── index.vue
│       │   └── app.vue
│       ├── assets/
│       │   └── css/
│       │       └── main.css
│       └── public/
│           ├── favicon.ico
│           └── robots.txt
└── packages/
    ├── react-ui/
    │   ├── components.json
    │   ├── eslint.config.js
    │   ├── index.html
    │   ├── package.json
    │   ├── postcss.config.js
    │   ├── README.md
    │   ├── tailwind.config.js
    │   ├── tailwind.config.ts
    │   ├── tsconfig.app.json
    │   ├── tsconfig.json
    │   ├── tsconfig.node.json
    │   ├── vite.config.ts
    │   ├── public/
    │   │   └── vite.svg
    │   └── src/
    │       ├── assets/
    │       │   └── react.svg
    │       ├── components/
    │       │   ├── accordion/
    │       │   │   ├── accordion copy.tsx
    │       │   │   └── accordion.tsx
    │       │   ├── button/
    │       │   │   ├── button-group.tsx
    │       │   │   └── button.tsx
    │       │   ├── checkbox/
    │       │   │   └── checkbox.tsx
    │       │   ├── form/
    │       │   │   ├── field.tsx
    │       │   │   ├── form-layout.tsx
    │       │   │   └── form.tsx
    │       │   ├── input/
    │       │   │   └── input.tsx
    │       │   ├── label/
    │       │   │   └── label.tsx
    │       │   ├── separator/
    │       │   │   └── separator.tsx
    │       │   ├── tabs/
    │       │   │   ├── tabs.tsx
    │       │   │   ├── tabs2.tsx
    │       │   │   └── tabs_htmlattr.tsx
    │       │   └── textarea/
    │       │       └── textarea.tsx
    │       ├── lib/
    │       │   └── utils.ts
    │       ├── App.css
    │       ├── App.tsx
    │       ├── base.css
    │       ├── index.css
    │       ├── index.ts
    │       └── main.tsx
    └── vue-ui/
        ├── index.html
        ├── package.json
        ├── postcss.config.js
        ├── README.md
        ├── tailwind.config.js
        ├── tsconfig.app.json
        ├── tsconfig.json
        ├── tsconfig.node.json
        ├── vite.config.ts
        ├── public/
        │   └── vite.svg
        └── src/
            ├── assets/
            │   └── vue.svg
            ├── components/
            │   └── tabs/
            │       ├── index.ts
            │       ├── tabs.style.ts
            │       ├── tabs.vue
            │       ├── tabsContent.vue
            │       ├── tabsList.vue
            │       └── tabsTrigger.vue
            ├── lib/
            │   └── utils.ts
            ├── App.vue
            ├── index.ts
            ├── main.ts
            └── style.css