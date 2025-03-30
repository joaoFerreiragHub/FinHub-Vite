import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

// 🧠 Importa e inicia os analytics
import { initAnalytics } from './lib/analyticsProviders'
initAnalytics() // ✅ executa apenas em produção (verificado dentro da função)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
