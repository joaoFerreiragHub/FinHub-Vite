import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

// Desativar SSR em ambientes como o Storybook
const isSSRDisabled = process.env.DISABLE_SSR_PLUGIN === 'true'

// Importa o plugin SSR apenas se for necessário
const ssrPlugin = !isSSRDisabled ? (await import('vite-plugin-ssr/plugin')).default : null

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  plugins: [react(), ...(ssrPlugin ? [ssrPlugin()] : [])],
  base: '/',
  resolve: {
    alias: {
      '~': resolve(__dirname, 'src'),
      '@': resolve(__dirname, 'src'),
    },
  },
})
