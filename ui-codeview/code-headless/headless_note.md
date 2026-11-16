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


-----------------------------------------------------------------------------------
## 서버 실행 방법
루트 경로 에서 (_pub\ui-codeview\code-headless>)

npm run dev -w apps/react-docs
npm run dev -w apps/vue-docs

npm run dev -w packages/react-ui
npm run dev -w packages/vue-ui


-----------------------------------------------------------------------------------
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
 