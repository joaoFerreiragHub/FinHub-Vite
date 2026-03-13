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

interface ChangePasswordResponse {
  message: string
}

interface UpdateMyProfileRequest {
  name?: string
  avatar?: string | null
  bio?: string | null
  socialLinks?:
    | {
        website?: string | null
        twitter?: string | null
        linkedin?: string | null
        instagram?: string | null
      }
    | null
}

interface UpdateMyProfileResponse {
  message: string
  user: MeResponse['user']
}

interface DeleteMyAccountRequest {
  currentPassword: string
  confirmation: string
  reason: string
}

interface DeleteMyAccountResponse {
  message: string
}

interface ExportMyDataResponse {
  exportedAt: string
  formatVersion: string
  user: MeResponse['user']
  data: Record<string, unknown>
  summary?: {
    favoritesCount?: number
    followingCount?: number
    followersCount?: number
    claimRequestsCount?: number
    creatorSubscriptionsCount?: number
  }
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
   * Alterar password da conta autenticada
   */
  changePassword: async (
    currentPassword: string,
    newPassword: string,
  ): Promise<ChangePasswordResponse> => {
    const response = await apiClient.post<ChangePasswordResponse>('/auth/change-password', {
      currentPassword,
      newPassword,
    })
    return response.data
  },

  /**
   * Atualizar perfil da conta autenticada
   */
  updateMyProfile: async (payload: UpdateMyProfileRequest): Promise<UpdateMyProfileResponse> => {
    const response = await apiClient.patch<UpdateMyProfileResponse>('/users/me', payload)
    return response.data
  },

  /**
   * Exportar dados da conta autenticada (RGPD)
   */
  exportMyData: async (): Promise<ExportMyDataResponse> => {
    const response = await apiClient.get<ExportMyDataResponse>('/users/me/export')
    return response.data
  },

  /**
   * Eliminar conta autenticada (anonimizacao + desativacao)
   */
  deleteMyAccount: async (payload: DeleteMyAccountRequest): Promise<DeleteMyAccountResponse> => {
    const response = await apiClient.delete<DeleteMyAccountResponse>('/users/me', {
      data: payload,
    })
    return response.data
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
