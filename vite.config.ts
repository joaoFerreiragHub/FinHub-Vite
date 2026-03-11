import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import ssr from 'vike/plugin'

const devHost = process.env.VITE_HOST ?? 'localhost'
const devPort = Number(process.env.VITE_PORT ?? '5173')
const devStrictPort = process.env.VITE_STRICT_PORT === 'true'

export default defineConfig({
  plugins: [react(), ssr()],
  resolve: {
    alias: {
      '~': '/src',
      '@': '/src',
    },
  },
  server: {
    host: devHost,
    port: devPort,
    strictPort: devStrictPort,
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
