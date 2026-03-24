/**
 * User Roles - Hierarquia de permissÃµes
 * Cada nÃ­vel herda permissÃµes do anterior
 */
export enum UserRole {
  VISITOR = 'visitor', // NÃ­vel 0 - Sem conta
  FREE = 'free', // NÃ­vel 1 - Com conta gratuita
  PREMIUM = 'premium', // NÃ­vel 2 - Assinatura premium
  CREATOR = 'creator', // NÃ­vel 3 - Criador de conteÃºdo
  BRAND_MANAGER = 'brand_manager', // NÃ­vel 4 - Gestor de marca
  ADMIN = 'admin', // NÃ­vel 5 - Administrador
}

export type UserAccountStatus = 'active' | 'suspended' | 'banned'

export interface AssistedSessionContext {
  sessionId: string
  adminUserId: string
  targetUserId: string
  scope: 'read_only'
  expiresAt: string
}

export interface UserCookieConsent {
  essential: boolean
  analytics: boolean
  marketing: boolean
  preferences: boolean
  consentedAt?: string | null
  version?: string | null
}

export interface UserLegalAcceptance {
  termsAcceptedAt?: string | null
  privacyAcceptedAt?: string | null
  financialDisclaimerAcceptedAt?: string | null
  version?: string | null
}

export interface UserSocialLinks {
  website?: string
  twitter?: string
  linkedin?: string
  instagram?: string
  youtube?: string
}

export interface UserCreatorCardConfig {
  showWelcomeVideo?: boolean
  showBio?: boolean
  showCourses?: boolean
  showArticles?: boolean
  showProducts?: boolean
  showWebsite?: boolean
  showSocialLinks?: boolean
  showRatings?: boolean
  featuredContentIds?: string[]
}

export interface UserXpBadge {
  id: string
  unlockedAt: string
}

export interface RegisterLegalAcceptanceInput {
  termsAccepted: boolean
  privacyAccepted: boolean
  financialDisclaimerAccepted: boolean
  version?: string
}

export interface RegisterCookieConsentInput {
  analytics?: boolean
  marketing?: boolean
  preferences?: boolean
  version?: string
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
  welcomeVideoUrl?: string
  bio?: string
  cardConfig?: UserCreatorCardConfig
  socialLinks?: UserSocialLinks
  role: UserRole
  accountStatus?: UserAccountStatus
  adminReadOnly?: boolean
  adminScopes?: string[]
  assistedSession?: AssistedSessionContext
  legalAcceptance?: UserLegalAcceptance
  cookieConsent?: UserCookieConsent
  isEmailVerified: boolean
  favoriteTopics?: string[]
  level?: number
  levelName?: string
  totalXp?: number
  badges?: UserXpBadge[]
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
  captchaToken?: string
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
  captchaToken?: string
  legalAcceptance: RegisterLegalAcceptanceInput
  cookieConsent?: RegisterCookieConsentInput
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
