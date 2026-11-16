import eslint from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import typescriptEslint from 'typescript-eslint';
const __dirname = dirname(fileURLToPath(import.meta.url));

export default [
  // 1. 기본 추천 규칙 적용
  eslint.configs.recommended,
  ...typescriptEslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],

  // 2. 커스텀 포맷팅 규칙
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: typescriptEslint.parser,
        tsconfigRootDir: __dirname, 
        extraFileExtensions: ['.vue'] // (보너스) vue 파일도 TS처럼 잘 읽도록 명시
      },
    },
    rules: {
      /* 방해되는 기본 문법 잔소리 끄기 */
      'no-undef': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'vue/multi-word-component-names': 'off',

      /* TS/JS 기본 들여쓰기 끄기 (Vue 전용 들여쓰기와 충돌 방지) */
      indent: 'off',
      '@typescript-eslint/indent': 'off',

      /* 템플릿(HTML)과 스크립트(JS/TS) 들여쓰기 2칸 강제 정렬 */
      'vue/html-indent': ['warn', 2],
      'vue/script-indent': [
        'warn',
        2,0
        {
          baseIndent: 0, 
          switchCase: 1, 
        },
      ],

      /* 속성 및 텍스트 줄바꿈/괄호 위치 내 맘대로 */
      'vue/max-attributes-per-line': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/multiline-html-element-content-newline': 'off',
      'vue/html-closing-bracket-newline': 'off',
    },
  },
];