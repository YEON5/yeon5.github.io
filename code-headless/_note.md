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
