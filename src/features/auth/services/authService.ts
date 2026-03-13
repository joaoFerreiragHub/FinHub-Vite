import { apiClient } from '@/lib/api/client'
import {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  RefreshResponse,
  MeResponse,
  UserCookieConsent,
} from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

interface UpdateCookieConsentRequest {
  analytics?: boolean
  marketing?: boolean
  preferences?: boolean
  version?: string
}

interface UpdateCookieConsentResponse {
  message: string
  cookieConsent: UserCookieConsent
}

interface ResendVerificationResponse {
  message: string
}

/**
 * Authentication Service
 *
 * Responsável por todas as chamadas de API relacionadas a autenticação
 */
export const authService = {
  /**
   * Login do usuário
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials)
    return response.data
  },

  /**
   * Registro de novo usuário
   */
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', data)
    return response.data
  },

  /**
   * Logout do usuário
   */
  logout: async (refreshToken: string): Promise<void> => {
    await apiClient.post('/auth/logout', { refreshToken })
  },

  /**
   * Refresh do access token
   */
  refreshToken: async (refreshToken: string): Promise<RefreshResponse> => {
    const response = await apiClient.post<RefreshResponse>('/auth/refresh', { refreshToken })
    return response.data
  },

  /**
   * Verificar email do usuário
   */
  verifyEmail: async (token: string): Promise<void> => {
    await apiClient.get('/auth/verify-email', {
      params: {
        token,
      },
    })
  },

  /**
   * Solicitar recuperação de senha
   */
  forgotPassword: async (email: string): Promise<void> => {
    await apiClient.post('/auth/forgot-password', { email })
  },

  /**
   * Resetar senha
   */
  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await apiClient.post('/auth/reset-password', { token, newPassword })
  },

  /**
   * Reenviar email de verificacao para utilizador autenticado
   */
  resendVerification: async (): Promise<ResendVerificationResponse> => {
    const response = await apiClient.post<ResendVerificationResponse>('/auth/resend-verification')
    return response.data
  },

  /**
   * Atualizar consentimento de cookies do utilizador autenticado.
   */
  updateCookieConsent: async (
    payload: UpdateCookieConsentRequest,
  ): Promise<UpdateCookieConsentResponse> => {
    const response = await apiClient.patch<UpdateCookieConsentResponse>(
      '/auth/cookie-consent',
      payload,
    )
    return response.data
  },

  /**
   * Obter usuário atual
   */
  getCurrentUser: async (): Promise<MeResponse> => {
    const response = await apiClient.get<MeResponse>('/auth/me')
    return response.data
  },

  /**
   * Obter usuÃ¡rio atual com token explicito (callback OAuth)
   */
  getCurrentUserWithAccessToken: async (accessToken: string): Promise<MeResponse> => {
    const response = await apiClient.get<MeResponse>('/auth/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    return response.data
  },

  /**
   * URL para iniciar OAuth Google no backend
   */
  getGoogleOAuthStartUrl: (redirectPath = '/dashboard'): string => {
    const params = new URLSearchParams()
    params.set('redirectPath', redirectPath)
    return `${API_BASE_URL}/auth/google/start?${params.toString()}`
  },
}
