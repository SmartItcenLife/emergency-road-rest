import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // '/api'로 시작하는 요청을 백엔드 서버(8089)로 전달
      '/api': {
        target: 'http://localhost:8089',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})