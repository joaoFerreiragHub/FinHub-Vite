import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import ssr from 'vite-plugin-ssr/plugin'

const rootDir = path.dirname(fileURLToPath(import.meta.url))
const srcDir = path.resolve(rootDir, 'src')

export default defineConfig({
  cacheDir: 'node_modules/.vite-e2e',
  plugins: [react(), ssr()],
  resolve: {
    alias: [
      { find: /^@\//, replacement: `${srcDir}/` },
      { find: /^~\//, replacement: `${srcDir}/` },
    ],
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
