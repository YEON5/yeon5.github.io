# style-ui 사용 가이드

## 파일 구조

```
packages/style-ui/
├── src/
│   ├── design-tokens.css   # 피그마에서 export한 디자인 토큰 CSS 변수 (원본)
│   ├── pds-tokens.js       # generate-tokens.js가 자동 생성하는 파일 (수정 금지)
│   └── style.css           # Tailwind 진입점 CSS
├── dist/
│   └── style.css           # 빌드 결과물 (react-docs, vue-docs에서 import)
├── scripts/
│   └── generate-tokens.js  # design-tokens.css → pds-tokens.js 파서 스크립트
├── tailwind.config.js      # Tailwind 설정 (pds-tokens.js를 import해서 theme에 주입)
└── postcss.config.js       # PostCSS 설정 (tailwindcss + autoprefixer)
```

---

## 빌드 방법

루트 경로(`code-headless/`)에서 실행

```bash
# CSS 재빌드 (generate:tokens 자동 선행 실행됨)
npm run build -w packages/style-ui

# 개발 모드 (파일 변경 감지 + 자동 재빌드)
npm run dev -w packages/style-ui

# 토큰 파일만 재생성 (CSS 빌드 없이)
npm run generate:tokens -w packages/style-ui
```

---

## design-tokens.css가 변경됐을 때

### 케이스 1: 기존 변수 값만 변경 (색상 코드 등)
```bash
npm run build -w packages/style-ui
```
→ 스크립트 수정 없이 자동 반영

### 케이스 2: 기존 그룹에 새 변수 추가
예) `--pds-color-mint-color-mint-25` 추가
```bash
npm run build -w packages/style-ui
```
→ 자동 반영

### 케이스 3: 완전히 새로운 색상 그룹 추가
예) `--pds-color-blue-color-blue-500` 추가
```
scripts/generate-tokens.js 수정 필요
→ 새 그룹 파싱 규칙 추가 후 npm run build -w packages/style-ui
```

### 케이스 4: 변수명 규칙(네이밍 컨벤션) 자체가 변경
```
scripts/generate-tokens.js 전면 수정 필요
```

---

## generate-tokens.js 동작 원리

`design-tokens.css`의 CSS 변수명 prefix 패턴을 파싱해서 `pds-tokens.js`를 자동 생성합니다.

| CSS 변수 prefix | Tailwind theme 카테고리 | 생성되는 클래스 예시 |
|---|---|---|
| `--pds-color-states-dark-*` | `colors["pds-states-dark"]` | `bg-pds-states-dark-100-50` |
| `--pds-color-states-light-*` | `colors["pds-states-light"]` | `bg-pds-states-light-100-60` |
| `--pds-color-gray-color-*` | `colors["pds-gray"]` | `bg-pds-gray-950` |
| `--pds-color-mint-color-mint-*` | `colors["pds-mint"]` | `bg-pds-mint-500` |
| `--pds-color-banner-color-bg-*` | `colors["pds-banner"]` | `bg-pds-banner-green` |
| `--pds-value-set-radius-radius-*` | `borderRadius` | `rounded-pds-md` |
| `--pds-value-set-spacing-spacing-*` | `spacing` | `p-pds-4`, `m-pds-2`, `gap-pds-3` |
| `--pds-value-set-text-*` | `fontSize` | `text-pds-xl` |

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
<div class="bg-pds-states-light-100-60">밝은 오버레이 60%</div>

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

---

## CSS 적용 구조

```
style-ui/dist/style.css
    ↑ 빌드 결과물

apps/react-docs/app/globals.css   → @import "@code-headless/style-ui/dist/style.css"
apps/vue-docs/assets/css/main.css → @import "@code-headless/style-ui/dist/style.css"
```

기존 Tailwind 클래스(`bg-blue-500`, `text-sm` 등)와 PDS 토큰 클래스를 함께 사용할 수 있습니다.
