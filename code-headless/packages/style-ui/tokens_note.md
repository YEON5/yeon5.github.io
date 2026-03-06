# style-ui 사용 가이드

## 파일 구조

```
packages/style-ui/
├── src/
│   ├── tokens/
│   │   └── design-tokens.json  # 피그마에서 export한 디자인 토큰 (원본, 단일 소스)
│   ├── design-tokens.css       # CSS 변수 모음 (직접 var() 참조 시 사용)
│   ├── pds-tokens.js           # generate-tokens.js가 자동 생성 (수정 금지)
│   └── style.css               # Tailwind 진입점 CSS
├── dist/
│   └── style.css               # 빌드 결과물 (react-docs, vue-docs에서 import)
├── scripts/
│   └── generate-tokens.js      # JSON → pds-tokens.js 파서 스크립트
├── tailwind.config.js          # Tailwind 설정 (pds-tokens.js를 import해서 theme에 주입)
└── postcss.config.js           # PostCSS 설정 (tailwindcss + autoprefixer)
```

---

## 빌드 흐름

```
design-tokens.json
      ↓ generate-tokens.js 실행
src/pds-tokens.js  (자동 생성, 수정 금지)
      ↓ tailwind.config.js에서 require()
npm run build
      ↓
dist/style.css  ←  react-docs, vue-docs에서 @import
```

---

## 빌드 명령어

루트 경로(`code-headless/`)에서 실행

```bash
# CSS 재빌드 (generate:tokens 자동 선행 실행됨)
npm run build -w packages/style-ui

# 개발 모드 (파일 변경 감지 + 자동 재빌드)
npm run dev -w packages/style-ui

# 토큰 파일만 재생성 (CSS 빌드 없이 확인할 때)
npm run generate:tokens -w packages/style-ui
```

---

## design-tokens.json이 변경됐을 때

### 케이스 1: 기존 토큰 값만 변경 (색상 코드 등)
```bash
npm run build -w packages/style-ui
```
→ 스크립트 수정 없이 자동 반영

### 케이스 2: 기존 그룹에 새 토큰 추가
예) `mint` 그룹에 `"color-mint-25"` 추가
```bash
npm run build -w packages/style-ui
```
→ 자동 반영

### 케이스 3: 완전히 새로운 색상 그룹 추가
예) JSON에 `"blue": { "color-blue-500": { ... } }` 추가
```bash
npm run build -w packages/style-ui
```
→ **스크립트 수정 없이 자동 반영** (JSON 기반의 핵심 장점)

### 케이스 4: JSON 최상위 구조 자체가 변경
예) `color.color.{group}` 경로가 바뀌는 경우
```
scripts/generate-tokens.js 상단의 탐색 경로 수정 필요
const colorGroups = tokens?.color?.color ?? {};  ← 이 부분
```

---

## Tailwind 클래스 접두사 변경

`scripts/generate-tokens.js` 상단의 `PREFIX` 상수만 바꾸고 재빌드하면 됩니다.

```js
// ✏️ 이 값만 변경하면 모든 토큰 클래스에 반영됨
const PREFIX = "pds";  // → "ds"로 바꾸면 bg-ds-mint-500, text-ds-xl ...
```

```bash
npm run build -w packages/style-ui
```

---

## generate-tokens.js 동작 원리

`design-tokens.json` 구조를 순회하여 `pds-tokens.js`를 자동 생성합니다.
그룹명과 중복 접두사(`color-`, `bg-`)를 제거해 깔끔한 키를 추출합니다.

| JSON 경로 | Tailwind theme | 생성 클래스 예시 |
|---|---|---|
| `color.color.states.*` | `colors["pds-states"]` | `bg-pds-states-dark-100-50` |
| `color.color.gray.*` | `colors["pds-gray"]` | `bg-pds-gray-950`, `text-pds-gray-white` |
| `color.color.mint.*` | `colors["pds-mint"]` | `bg-pds-mint-500` |
| `color.color.banner.*` | `colors["pds-banner"]` | `bg-pds-banner-green` |
| `responsive-value-set.radius.*` | `borderRadius` | `rounded-pds-md`, `rounded-pds-full` |
| `responsive-value-set.spacing.*` | `spacing` | `p-pds-4`, `m-pds-2`, `gap-pds-3` |
| `responsive-value-set.text-*` | `fontSize` | `text-pds-xl`, `text-pds-md` |

---

## Tailwind 클래스 사용 예시

```html
<!-- 색상 -->
<div class="bg-pds-mint-500 text-pds-gray-white">mint 배경</div>
<div class="text-pds-gray-900">gray 텍스트</div>
<div class="border border-pds-gray-200">gray 보더</div>

<!-- 배너 배경 -->
<div class="bg-pds-banner-green">green 배너</div>
<div class="bg-pds-banner-violet">violet 배너</div>

<!-- 상태 오버레이 -->
<div class="bg-pds-states-dark-100-50">어두운 오버레이 50%</div>

<!-- 모서리 -->
<div class="rounded-pds-sm">rounded sm</div>
<div class="rounded-pds-md">rounded md</div>
<div class="rounded-pds-full">rounded full</div>

<!-- 간격 -->
<div class="p-pds-4">padding pds-4</div>
<div class="m-pds-2">margin pds-2</div>
<div class="gap-pds-3">gap pds-3</div>

<!-- 폰트 크기 -->
<span class="text-pds-xl">xl 텍스트</span>
<span class="text-pds-md">md 텍스트</span>
<span class="text-pds-xxs">xxs 텍스트</span>
```

기존 Tailwind 클래스(`bg-blue-500`, `text-sm` 등)와 함께 사용 가능합니다.

---

## CSS 적용 구조

```
apps/react-docs/app/globals.css   → @import "@code-headless/style-ui/dist/style.css"
apps/vue-docs/assets/css/main.css → @import "@code-headless/style-ui/dist/style.css"
```

## design-tokens.css 관련

`src/style.css`에 `@import './design-tokens.css'`가 포함되어 있어
CSS 변수(`var(--pds-color-mint-500)` 등)를 직접 참조하는 것도 가능합니다.
Tailwind 클래스만 사용한다면 없어도 동작하지만, 그대로 두는 것을 권장합니다.
