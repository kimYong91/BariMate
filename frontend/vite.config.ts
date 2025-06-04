import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Docker 컨테이너에서 외부 접근 허용
    port: 5173,
    watch: {
      usePolling: true, // Docker/WSL 환경에서 파일 변경 감지 개선
    },
    hmr: {
      clientPort: 5173, // HMR 클라이언트 포트 명시
    },
    proxy: {
      '/api': {
        target: 'http://barimate-backend-dev:8000', // Docker 서비스 이름 사용
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
