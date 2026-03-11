// eslint.config.js
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default [
  {
    ignores: [
      '**/*.d.ts', // ignora todos os declaration files
      'node_modules/**', // ignora node_modules
      'dist/**', // ignora builds
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
  {
    files: ['src/pages/**/*.{ts,tsx}'],
    rules: {
      // Vike pages export route metadata alongside components.
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    files: [
      'src/components/ui/**/*.{ts,tsx}',
      'src/features/admin/components/RiskSignals.tsx',
      'src/features/tools/stocks/components/quickAnalysis/QuickMetricGovernanceContext.tsx',
      'src/renderer/PageShell.tsx',
    ],
    rules: {
      // These files intentionally export helpers/constants together with components/hooks.
      'react-refresh/only-export-components': 'off',
    },
  },
]
