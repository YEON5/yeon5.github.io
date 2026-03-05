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
## build-tokens.js 설명
## 테마 객체 네이밍
const theme = { colors: {}, spacing: {}, borderRadius: {}, fontSize: {} };

의미는
colors 객체 안에 값을 넣으면 ➡️ bg-[], text-[], border-[] 클래스를 만듭니다.
spacing 객체 안에 값을 넣으면 ➡️ p-[] (padding), m-[] (margin), gap-[] 클래스를 만듭니다.
borderRadius는 ➡️ rounded-[] 클래스를 만듭니다.
fontSize는 ➡️ text-[] 클래스를 만듭니다.


* 예시 1: 색상 (Colors)
원본 변수명: --pds-color-mint-color-mint-500
제거되는 단어: pds-color-, color-mint-
최종 Key 이름: mint-500
-> 실제 쓸 때: <div class="bg-mint-500 text-mint-900 border-gray-200">

* 예시 2: 간격 (Spacing)
원본 변수명: --pds-value-set-spacing-spacing-4
제거되는 단어: pds-value-set-, spacing-spacing-
최종 Key 이름: 4
✨ 실제 쓸 때: <div class="p-4 mt-2 gap-4"> (padding: 1.2rem 적용됨)

* 예시 3: 둥근 모서리 (Border Radius)
원본 변수명: --pds-value-set-radius-radius-md
제거되는 단어: pds-value-set-, radius-radius-
최종 Key 이름: md
✨ 실제 쓸 때: <button class="rounded-md">

* 예시 4: 폰트 크기 (Font Size)
원본 변수명: --pds-value-set-text-xl
제거되는 단어: pds-value-set-, text-
최종 Key 이름: xl
✨ 실제 쓸 때: <span class="text-xl"> (font-size: 20px 적용됨)