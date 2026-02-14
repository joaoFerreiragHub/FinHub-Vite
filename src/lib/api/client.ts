import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from 'axios'

/**
 * API Client com Axios
 *
 * Features:
 * - Auto-inject de access token
 * - Auto-refresh de tokens expirados
 * - Error handling global
 * - Request/Response interceptors
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Flag para evitar refresh loops
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}> = []

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })

  failedQueue = []
}

/**
 * Cria instância do axios client
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Request Interceptor
 * Injeta o access token em todas as requisições
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Obter token do localStorage (evitar import circular com store)
    const authStorage = localStorage.getItem('auth-storage')

    if (authStorage) {
      try {
        const { state } = JSON.parse(authStorage)
        const accessToken = state?.accessToken

        if (accessToken && config.headers) {
          config.headers.Authorization = `Bearer ${accessToken}`
        }
      } catch (error) {
        console.error('Error parsing auth storage:', error)
      }
    }

    // Log em desenvolvimento
    if (import.meta.env.DEV) {
      console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        data: config.data,
        params: config.params,
      })
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * Response Interceptor
 * Gerencia erros e refresh de tokens
 */
apiClient.interceptors.response.use(
  (response) => {
    // Log em desenvolvimento
    if (import.meta.env.DEV) {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      })
    }

    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // Log em desenvolvimento
    if (import.meta.env.DEV) {
      console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
        status: error.response?.status,
        message: error.message,
        data: error.response?.data,
      })
    }

    // Se erro 401 e não é retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Se é a rota de refresh, não tentar refresh novamente
      if (originalRequest.url?.includes('/auth/refresh')) {
        // Limpar auth e redirecionar para login
        localStorage.removeItem('auth-storage')
        window.location.href = '/auth/login'
        return Promise.reject(error)
      }

      // Se já está refreshing, adicionar à fila
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            return apiClient(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      // Tentar refresh
      try {
        const authStorage = localStorage.getItem('auth-storage')
        if (!authStorage) throw new Error('No auth storage')

        const { state } = JSON.parse(authStorage)
        const refreshToken = state?.refreshToken

        if (!refreshToken) throw new Error('No refresh token')

        // Fazer request de refresh
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken })

        const { accessToken, refreshToken: newRefreshToken, user } = response.data

        // Atualizar localStorage
        const updatedState = {
          ...state,
          accessToken,
          refreshToken: newRefreshToken,
          user,
        }

        localStorage.setItem('auth-storage', JSON.stringify({ state: updatedState }))

        // Processar fila de requests falhados
        processQueue(null, accessToken)

        // Retry original request
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
        }

        return apiClient(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError as Error, null)

        // Limpar auth e redirecionar
        localStorage.removeItem('auth-storage')
        window.location.href = '/auth/login'

        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // Outros erros
    return Promise.reject(error)
  }
)

/**
 * Helper para extrair mensagem de erro
 */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || 'Erro desconhecido'
  }

  if (error instanceof Error) {
    return error.message
  }

  return String(error)
}

/**
 * Helper para verificar se é erro de rede
 */
export function isNetworkError(error: unknown): boolean {
  return axios.isAxiosError(error) && !error.response
}

/**
 * Helper para verificar se é erro de autenticação
 */
export function isAuthError(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 401
}

/**
 * Helper para verificar se é erro de permissão
 */
export function isPermissionError(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 403
}
