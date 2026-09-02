/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: './', // GitHub Pages 및 서브 경로 호환성을 위한 상대 경로 설정
  plugins: [react()],
  server: {
    port: 3000,
    open: false
  },
  test: {
    globals: true,
    environment: 'jsdom'
  }
})
