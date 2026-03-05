## code-basic

-----------------------------------------------------------------------------------
## code-vite-ts

@ 이미지 경로 예시 (public/assets/images)
HTML: <img src="/assets/images/logo.png">
SCSS: background-image: url('/assets/images/bg.png');


-----------------------------------------------------------------------------------
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



## 서버 실행 방법
루트 경로 에서 (_pub\ui-codeview\code-headless>)

npm run dev -w apps/react-docs
npm run dev -w apps/vue-docs

npm run dev -w packages/react-ui
npm run dev -w packages/vue-ui



## tailwind css build
피그마에서 design-tokens.css 파일을 새로 덮어씌울 때
루트 경로 에서 (_pub\ui-codeview\code-headless>)
npm run build -w packages/style-ui


디자인 컴포넌트나 UI를 개발할때는
터미널 창을 하나 열어서 **npm run dev -w packages/style-ui**를 입력해 켜놓고 진행(watch 상태)
UI 코드에서 색상 '클래스'만 바꿀 때 👉 빌드 안 해도 됨 (--watch가 알아서 함)
npm run dev -w packages/style-ui


## design dokens build
경로 _pub\ui-codeview\code-headless\packages\style-ui>
node build-tokens.js



-----------------------------------------------------------------------------------
## 폴더 구조
code-headless/
├── apps/                            # 문서 및 데모 애플리케이션
│   ├── react-docs/                  # React UI 컴포넌트 문서 (Next.js)
│   │   ├── app/
│   │   ├── public/
│   │   ├── eslint.config.mjs
│   │   ├── next.config.ts
│   │   ├── package.json
│   │   ├── README.md
│   │   └── tsconfig.json
│   │
│   └── vue-docs/                    # Vue UI 컴포넌트 문서 (Nuxt.js)
│       ├── app/
│       ├── assets/
│       ├── public/
│       ├── nuxt.config.ts
│       ├── package.json
│       ├── README.md
│       └── tsconfig.json
│
├── packages/                        # 공통으로 사용되는 패키지들
│   ├── react-ui/                    # React 컴포넌트 라이브러리
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── assets/
│   │   │   ├── components/
│   │   │   ├── lib/
│   │   │   ├── App.tsx
│   │   │   ├── index.ts
│   │   │   └── main.tsx
│   │   ├── components.json
│   │   ├── eslint.config.js
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── README.md
│   │   ├── tsconfig.app.json
│   │   ├── tsconfig.json
│   │   ├── tsconfig.node.json
│   │   └── vite.config.ts
│   │
│   ├── style-ui/                    # 공통 스타일 패키지 (Tailwind CSS)
│   │   ├── src/
│   │   │   └── style.css
│   │   ├── dist/
│   │   ├── note.md
│   │   ├── package.json
│   │   └── tailwind.config.js
│   │
│   └── vue-ui/                      # Vue 컴포넌트 라이브러리
│       ├── public/
│       ├── src/
│       │   ├── assets/
│       │   ├── components/
│       │   ├── lib/
│       │   ├── App.vue
│       │   ├── index.ts
│       │   └── main.ts
│       ├── index.html
│       ├── package.json
│       ├── README.md
│       ├── tsconfig.app.json
│       ├── tsconfig.json
│       ├── tsconfig.node.json
│       └── vite.config.ts
│
├── .prettierignore                  # Prettier 무시 파일 설정
├── .prettierrc                      # Prettier 포맷팅 설정
├── code_note.md                         # 프로젝트 관련 노트
├── package-lock.json
└── package.json                     # Root 패키지 설정 (Monorepo 기반)