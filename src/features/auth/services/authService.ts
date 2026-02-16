import { apiClient } from '@/lib/api/client'
import { LoginCredentials, RegisterData, AuthResponse, RefreshResponse, MeResponse } from '../types'

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
    await apiClient.post('/auth/verify-email', { token })
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
   * Obter usuário atual
   */
  getCurrentUser: async (): Promise<MeResponse> => {
    const response = await apiClient.get<MeResponse>('/auth/me')
    return response.data
  },
}
