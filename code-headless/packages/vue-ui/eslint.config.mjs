import eslint from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import typescriptEslint from 'typescript-eslint';

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
        parser: typescriptEslint.parser, // Vue <script lang="ts"> 완벽 지원
      },
    },
    rules: {
      /* 방해되는 기본 문법 잔소리 끄기 */
      'no-undef': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'vue/multi-word-component-names': 'off',

      /* ✨ 핵심 포맷팅 규칙 ✨ */
      'vue/html-indent': ['warn', 2], // 틀리면 노란줄(하지만 에디터 설정으로 숨김), 저장 시 2칸 정렬
      'vue/max-attributes-per-line': 'off', // 속성 줄바꿈 내 맘대로
      'vue/singleline-html-element-content-newline': 'off', // 텍스트 줄바꿈 내 맘대로
      'vue/multiline-html-element-content-newline': 'off',
      'vue/html-closing-bracket-newline': 'off',
    },
  },
];
