// config/api.ts
export const API_CONFIG = {
  BASE_URL: '/api', // ou 'http://localhost:3000/api' para desenvolvimento
  WS_URL: 'ws://localhost:3000', // ou 'wss://your-production-url' para produção
  TIMEOUT: 30000,

  // Environment específico
  get baseUrl() {
    if (window.location.hostname === 'localhost') {
      return 'http://localhost:3000/api'
    }
    return '/api'
  },

  get wsUrl() {
    if (window.location.hostname === 'localhost') {
      return 'ws://localhost:3000'
    }
    return `wss://${window.location.host}`
  },
}
