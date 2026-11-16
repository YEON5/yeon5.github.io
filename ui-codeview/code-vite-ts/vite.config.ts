import { defineConfig } from 'vite';
import htmlInject from 'vite-plugin-html-inject';
import { resolve } from 'path';

export default defineConfig({
  base: './',
  plugins: [
    // HTML 파일 내에서 <load src="..." /> 문법을 사용할 수 있게 해줍니다.
    htmlInject(),
  ],
  resolve: {
    alias: {
      // '@'를 'src' 폴더로 인식하게 설정
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        guide: resolve(__dirname, 'src/pages/guide-ui.html'),
      },
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'assets/ui.style.css';
          }
          return 'assets/[name].[ext]';
        },
      },
    },
  },
  server: {
    open: true,

    // 서버 시작 화면 경로를 지정해야할때 경로를 지정해줄 수 있다. ex) /src/pages/guide-ui.html (가이드 화면을 첫 화면으로 로딩)
    // open: 'index.html',
  },
  // (선택사항) SCSS 전역 변수 자동 로드 설정이 필요하면 여기에 css 옵션 추가
});
