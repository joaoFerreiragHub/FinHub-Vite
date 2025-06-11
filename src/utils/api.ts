// config/api.ts
export const API_CONFIG = {
  BASE_URL: '/api',  // ou 'http://localhost:3001/api' para desenvolvimento
  WS_URL: 'ws://localhost:3001',
  TIMEOUT: 30000,

  // Environment específico
  get baseUrl() {
    if (window.location.hostname === 'localhost') {
      return 'http://localhost:3001/api'
    }
    return '/api'
  },

  get wsUrl() {
    if (window.location.hostname === 'localhost') {
      return 'ws://localhost:3001'
    }
    return `wss://${window.location.host}`
  }
}
