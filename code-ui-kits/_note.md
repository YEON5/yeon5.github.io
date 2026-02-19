## react 설치 방법
1.next.js
* 경로이동
cd code-ui-kits/apps

* react-docs라는 이름으로 Next.js 생성
cmd: npx create-next-app@latest react-docs

* 설정:
-TypeScript: Yes
-ESLint: Yes
-Tailwind CSS: Yes
-src/ directory: Yes (여기도 src 쓰는 게 통일성 있음)
-App Router: Yes
-Import alias: @/*

2.폴더 생성 및 vite 설치
* 경로이동
cd react-ui

* Vite React-TS 템플릿 설치
cmd: npm create vite@latest . -- --template react-ts

* 의존성 설치
cmd: npm install

* Tailwind 3.4v 및 유틸 설치 
Tailwind 및 설정용 패키지
cmd: npm install -D tailwindcss@3.4 postcss autoprefixer @types/node
Shadcn UI 유틸리티 패키지
cmd: npm install clsx tailwind-merge class-variance-authority lucide-react

* Tailwind 초기화
cmd: npx tailwindcss init -p

* tailwind.config.js 파일 생성되면
/** @type {import('tailwindcss').Config} */
export default {
  // 1. 여기 content에 경로를 추가해야 Tailwind가 클래스를 찾습니다.
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

* index.css 수정
기존내용 전부 삭제 후 아래 3줄만
@tailwind base;
@tailwind components;
@tailwind utilities;

* tsconfig.app.json 추가
{
  "compilerOptions": {
    // ... 기존 설정 유지 ...
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  // ...
}

* tsconfig.json 추가
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ],
  
  // ▼▼▼ 아래 compilerOptions 부분을 통째로 추가해 주세요 ▼▼▼
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
  // ▲▲▲ 여기까지 ▲▲▲
}

* vite.config.ts 전체교체
import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})

3.Shadcn UI 초기화
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

4.Radix UI 설치
* 예ㅒ시
npm install @radix-ui/react-tabs
npm install @radix-ui/react-slot