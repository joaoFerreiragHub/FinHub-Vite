import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { User, UserRole, AuthState, LoginCredentials, RegisterData } from '../types'
import { authService } from '../services/authService'
import { isDevelopment } from '@/lib/utils/env'

interface AuthStore extends AuthState {
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  refreshAccessToken: () => Promise<void>
  setUser: (user: User, accessToken: string, refreshToken: string) => void
  updateUser: (data: Partial<User>) => void
  setTokens: (accessToken: string, refreshToken: string) => void
  clearAuth: () => void
  getRole: () => UserRole

  // Dev Tools
  switchDevRole: (role: UserRole) => void

  // Internal
  setLoading: (isLoading: boolean) => void
  setHydrated: (hydrated: boolean) => void
}

// Mock user para desenvolvimento - Admin omnipresente
const DEV_MOCK_USER: User = {
  id: 'dev-admin-id',
  name: 'Admin',
  lastName: 'Dev',
  email: 'admin@admin.com',
  username: 'admin',
  avatar: undefined,
  bio: 'Admin de desenvolvimento - Omnipresente',
  role: UserRole.ADMIN, // Admin = acesso total
  isEmailVerified: true,
  favoriteTopics: ['investimentos', 'finanças', 'trading'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

const DEV_MOCK_TOKENS = {
  accessToken: 'dev-admin-access-token',
  refreshToken: 'dev-admin-refresh-token',
}

const DEV_ROLE_STORAGE_KEY = 'auth-dev-role'
const ASSISTED_BACKUP_STORAGE_KEY = 'assisted-session-admin-backup'

const isValidRole = (role: unknown): role is UserRole => {
  return typeof role === 'string' && Object.values(UserRole).includes(role as UserRole)
}

const isDevMockToken = (token: unknown): token is string => {
  return typeof token === 'string' && token.startsWith('dev-')
}

const getStoredDevRole = (): UserRole => {
  if (typeof window === 'undefined') return UserRole.CREATOR

  try {
    const rawRole = localStorage.getItem(DEV_ROLE_STORAGE_KEY)
    if (isValidRole(rawRole)) {
      return rawRole
    }
  } catch (error) {
    console.warn('⚠️ [DEV] Nao foi possivel ler auth-dev-role:', error)
  }

  return UserRole.CREATOR
}

const setStoredDevRole = (role: UserRole): void => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(DEV_ROLE_STORAGE_KEY, role)
  } catch (error) {
    console.warn('⚠️ [DEV] Nao foi possivel guardar auth-dev-role:', error)
  }
}

const buildDevUser = (role: UserRole): User => ({
  ...DEV_MOCK_USER,
  role,
  name: `Dev ${role.charAt(0).toUpperCase() + role.slice(1)}`,
})

const buildDevAuthState = (role: UserRole) => {
  const isVisitor = role === UserRole.VISITOR
  return {
    user: buildDevUser(role),
    accessToken: isVisitor ? null : DEV_MOCK_TOKENS.accessToken,
    refreshToken: isVisitor ? null : DEV_MOCK_TOKENS.refreshToken,
    isAuthenticated: !isVisitor,
  }
}

const setBetaSessionCookie = () => {
  // Beta session cookie — permite gate server-side
  if (typeof document !== 'undefined') {
    document.cookie = 'betaSession=valid; path=/; max-age=604800; SameSite=Lax'
  }
}

const clearBetaSessionCookie = () => {
  // Remover cookie de sessao beta
  if (typeof document !== 'undefined') {
    document.cookie = 'betaSession=; path=/; max-age=0; SameSite=Lax'
  }
}

/**
 * Store principal de autenticação usando Zustand
 *
 * Features:
 * - Persist no localStorage
 * - Auto-hidratação
 * - Mock user em desenvolvimento
 * - Token refresh automático
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State inicial
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      hydrated: typeof window === 'undefined', // SSR: true, Browser: false (will hydrate)

      // Actions
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true })
        try {
          const response = await authService.login(credentials)
          get().setUser(response.user, response.tokens.accessToken, response.tokens.refreshToken)
          set({ isLoading: false })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true })
        try {
          const response = await authService.register(data)
          get().setUser(response.user, response.tokens.accessToken, response.tokens.refreshToken)
          set({ isLoading: false })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: () => {
        // Limpar tokens do servidor (fire & forget)
        const { refreshToken } = get()
        if (refreshToken && !(isDevelopment() && isDevMockToken(refreshToken))) {
          authService.logout(refreshToken).catch(console.error)
        }

        // Limpar state local
        if (typeof window !== 'undefined') {
          localStorage.removeItem(ASSISTED_BACKUP_STORAGE_KEY)
        }
        clearBetaSessionCookie()
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        })
      },

      refreshAccessToken: async () => {
        const { refreshToken } = get()
        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        if (isDevelopment() && isDevMockToken(refreshToken)) {
          return
        }

        try {
          const response = await authService.refreshToken(refreshToken)
          set({
            accessToken: response.tokens.accessToken,
            refreshToken: response.tokens.refreshToken,
          })
        } catch (error) {
          // Se refresh falhar, fazer logout
          get().logout()
          throw error
        }
      },

      setUser: (user: User, accessToken: string, refreshToken: string) => {
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        })
        setBetaSessionCookie()
      },

      updateUser: (data: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        }))
      },

      setTokens: (accessToken: string, refreshToken: string) => {
        set({ accessToken, refreshToken })
      },

      clearAuth: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem(ASSISTED_BACKUP_STORAGE_KEY)
        }
        clearBetaSessionCookie()
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        })
      },

      getRole: () => {
        return get().user?.role ?? UserRole.VISITOR
      },

      // Dev Tools: trocar role em desenvolvimento
      switchDevRole: (role: UserRole) => {
        if (!isDevelopment()) {
          console.warn('⚠️ switchDevRole só funciona em desenvolvimento')
          return
        }

        setStoredDevRole(role)
        set(buildDevAuthState(role))
        console.log(`🔄 [DEV] Role alterado para: ${role}`)
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading })
      },

      setHydrated: (hydrated: boolean) => {
        set({ hydrated })
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),

      // Apenas persistir dados necessários (não persistir isLoading)
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),

      onRehydrateStorage: () => (state) => {
        console.log('🔄 [AUTH] onRehydrateStorage called')

        // Set hydrated IMMEDIATELY to unblock UI
        useAuthStore.setState({ hydrated: true })

        if (import.meta.env.DEV && import.meta.env.VITE_DEV_AUTO_LOGIN === 'true') {
          const hasRealUser = !!state?.user && state.user.id !== DEV_MOCK_USER.id
          if (!hasRealUser) {
            const preferredRole = isValidRole(state?.user?.role)
              ? state.user.role
              : getStoredDevRole()
            setStoredDevRole(preferredRole)
            useAuthStore.setState(buildDevAuthState(preferredRole))
            console.log(`🔧 [DEV] Sessao dev restaurada com role: ${preferredRole}`)
            return
          }
        }

        // Normaliza estado persistido legado para evitar flicker entre visitor/auth
        if (!state?.user && state?.isAuthenticated) {
          useAuthStore.setState({ isAuthenticated: false })
        } else if (state?.user?.role === UserRole.VISITOR && state?.isAuthenticated) {
          useAuthStore.setState({
            isAuthenticated: false,
          })
        }

        console.log('✅ [AUTH] Store hidratado')
      },
    },
  ),
)

// Inicialização para SSR - FALLBACK
if (typeof window !== 'undefined') {
  setTimeout(() => {
    const state = useAuthStore.getState()

    if (!state.hydrated) {
      console.warn('⚠️ [AUTH] Forçando hidratação via SSR fallback!')
      useAuthStore.setState({ hydrated: true })
    }

    if (import.meta.env.DEV && import.meta.env.VITE_DEV_AUTO_LOGIN === 'true' && !state.user) {
      const preferredRole = getStoredDevRole()
      useAuthStore.setState(buildDevAuthState(preferredRole))
      console.log(`🔧 [DEV] Sessao dev aplicada via fallback com role: ${preferredRole}`)
    }
  }, 100)
}
