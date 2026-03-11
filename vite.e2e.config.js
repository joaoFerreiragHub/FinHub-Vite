import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import ssr from 'vike/plugin'

const rootDir = path.dirname(fileURLToPath(import.meta.url))
const srcDir = path.resolve(rootDir, 'src')

const resolveSrcAliasForE2E = () => ({
  name: 'resolve-src-alias-for-e2e',
  enforce: 'pre',
  async resolveId(source, importer) {
    if (source.startsWith('@/') || source.startsWith('~/')) {
      return this.resolve(path.resolve(srcDir, source.slice(2)), importer, {
        skipSelf: true,
      })
    }

    return null
  },
})

export default defineConfig({
  cacheDir: 'node_modules/.vite-e2e',
  plugins: [resolveSrcAliasForE2E(), react(), ssr()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
