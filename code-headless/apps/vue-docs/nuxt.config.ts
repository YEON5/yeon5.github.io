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
  css: [path.resolve(__dirname, 'assets/css/main.css')],
  alias: {
    // vue-ui 패키지의 src 폴더를 'vue-ui'라는 이름으로 참조
    'vue-ui': path.resolve(__dirname, '../../packages/vue-ui/src'),
    '@': path.resolve(__dirname, './'),
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
})
