import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import { defineConfig, globalIgnores } from 'eslint/config';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),

  // 👇 추가된 부분: 개발자님 맞춤형 JSX 포맷팅 규칙 👇
  {
    rules: {
      /* 태그 전체 들여쓰기 2칸 (노란줄 경고 설정 + 자동 정렬) */
      'react/jsx-indent': ['warn', 2],

      /* 태그 안의 속성(props) 들여쓰기 2칸 */
      'react/jsx-indent-props': ['warn', 2],

      /* ✨ 속성 줄바꿈 내 맘대로 (강제하지 않음) */
      'react/jsx-max-props-per-line': 'off',
      'react/jsx-first-prop-new-line': 'off',

      /* ✨ 닫는 괄호(>) 위치 내 맘대로 */
      'react/jsx-closing-bracket-location': 'off',

      /* ✨ 중괄호 안의 변수/텍스트 줄바꿈 내 맘대로 */
      'react/jsx-one-expression-per-line': 'off',
    },
  },
]);

export default eslintConfig;
