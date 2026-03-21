import React from 'react'
import ReactDOM from 'react-dom/client'
import * as Sentry from '@sentry/react'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/inter/800.css'
import App from './App'
import { initializeSentry, isSentryEnabled } from './lib/sentry'
import './styles/globals.css'

initializeSentry()

const appTree = isSentryEnabled() ? (
  <Sentry.ErrorBoundary
    fallback={
      <div className="flex min-h-screen items-center justify-center p-6 text-center text-sm text-muted-foreground">
        Ocorreu um erro inesperado. Recarrega a pagina.
      </div>
    }
  >
    <App />
  </Sentry.ErrorBoundary>
) : (
  <App />
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>{appTree}</React.StrictMode>,
)
