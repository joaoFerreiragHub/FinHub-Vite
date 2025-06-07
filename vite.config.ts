import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import ssr from 'vite-plugin-ssr/plugin'

export default defineConfig({
  plugins: [
    react(),
    ssr(),
  ],
  resolve: {
    alias: {
      '~': '/src',
      '@': '/src',
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  }
})
