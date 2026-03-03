// apps/vue-docs/nuxt.config.ts
import { defineNuxtConfig } from 'nuxt/config'
import path from 'path'
import { fileURLToPath } from 'url'

// ESM 환경에서 __dirname 사용을 위한 설정
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  devServer: {
    port: 3001,
  },
  // 우리가 수정한 중앙 통제형 CSS를 품고 있는 파일 경로 (유지)
  css: [path.resolve(__dirname, 'assets/css/main.css')],
  
  // 패키지 참조 경로 (유지)
  alias: {
    'vue-ui': path.resolve(__dirname, '../../packages/vue-ui/src'),
    '@': path.resolve(__dirname, './'),
  },
})