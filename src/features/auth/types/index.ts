/**
 * User Roles - Hierarquia de permissões
 * Cada nível herda permissões do anterior
 */
export enum UserRole {
  VISITOR = 'visitor', // Nível 0 - Sem conta
  FREE = 'free', // Nível 1 - Com conta gratuita
  PREMIUM = 'premium', // Nível 2 - Assinatura premium
  CREATOR = 'creator', // Nível 3 - Criador de conteúdo
  ADMIN = 'admin', // Nível 4 - Administrador
}

/**
 * User interface
 */
export interface User {
  id: string
  name: string
  lastName?: string
  email: string
  username: string
  avatar?: string
  bio?: string
  role: UserRole
  isEmailVerified: boolean
  favoriteTopics?: string[]
  createdAt: string
  updatedAt: string
}

/**
 * Auth State
 */
export interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  hydrated: boolean
}

/**
 * Login Credentials
 */
export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

/**
 * Register Data
 */
export interface RegisterData {
  name: string
  lastName?: string
  email: string
  username: string
  password: string
  confirmPassword: string
}

/**
 * Auth Tokens
 */
export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

/**
 * Auth Response (Login/Register)
 */
export interface AuthResponse {
  user: User
  tokens: AuthTokens
}

/**
 * Refresh Response
 */
export interface RefreshResponse {
  tokens: AuthTokens
}

/**
 * Me Response
 */
export interface MeResponse {
  user: User
}
