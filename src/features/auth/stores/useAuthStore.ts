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

// Mock user para desenvolvimento
const DEV_MOCK_USER: User = {
  id: 'dev-mock-id',
  name: 'Desenvolvedor',
  lastName: 'Teste',
  email: 'dev@finhub.test',
  username: 'dev_test',
  avatar: undefined,
  bio: 'Usuário de desenvolvimento',
  role: UserRole.CREATOR, // Full access para testar features
  isEmailVerified: true,
  favoriteTopics: ['investimentos', 'finanças'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

const DEV_MOCK_TOKENS = {
  accessToken: 'dev-mock-access-token',
  refreshToken: 'dev-mock-refresh-token',
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
          set({
            user: response.user,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true })
        try {
          const response = await authService.register(data)
          set({
            user: response.user,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: () => {
        // Limpar tokens do servidor (fire & forget)
        const { refreshToken } = get()
        if (refreshToken) {
          authService.logout(refreshToken).catch(console.error)
        }

        // Limpar state local
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

        try {
          const response = await authService.refreshToken(refreshToken)
          set({
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            user: response.user,
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

        const currentUser = get().user
        if (!currentUser) {
          console.warn('⚠️ Nenhum usuário logado para trocar role')
          return
        }

        const updatedUser: User = {
          ...currentUser,
          role,
          name: `Dev ${role.charAt(0).toUpperCase() + role.slice(1)}`,
        }

        set({ user: updatedUser })
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
        console.log('🔄 [AUTH] onRehydrateStorage called, state:', state)

        // Set hydrated IMMEDIATELY to unblock UI
        useAuthStore.setState({ hydrated: true })

        // APENAS EM DESENVOLVIMENTO: injetar mock user se não houver usuário
        const isDevEnv = isDevelopment()
        console.log('🔍 [AUTH] Environment check:', {
          isDevelopment: isDevEnv,
          hostname: typeof window !== 'undefined' ? window.location.hostname : 'SSR',
          hasUser: !!state?.user,
        })

        if (isDevEnv && !state?.user) {
          console.log('🔧 [DEV] Injetando mock user para desenvolvimento')
          useAuthStore.setState({
            user: DEV_MOCK_USER,
            accessToken: DEV_MOCK_TOKENS.accessToken,
            refreshToken: DEV_MOCK_TOKENS.refreshToken,
            isAuthenticated: true,
          })
        }

        console.log('✅ [AUTH] Store hidratado:', {
          isAuthenticated: useAuthStore.getState().isAuthenticated,
          role: useAuthStore.getState().user?.role,
          username: useAuthStore.getState().user?.username,
          hydrated: useAuthStore.getState().hydrated,
        })
      },
    },
  ),
)

// Inicialização para SSR - FALLBACK
if (typeof window !== 'undefined') {
  setTimeout(() => {
    const state = useAuthStore.getState()
    const isDevEnv = isDevelopment()
    console.log('⏰ [AUTH] SSR Fallback check - hydrated:', state.hydrated, 'isDev:', isDevEnv)

    if (!state.hydrated) {
      console.warn('⚠️ [AUTH] Forçando hidratação via SSR fallback!')
      useAuthStore.setState({ hydrated: true })

      // Mock user em desenvolvimento
      if (isDevEnv && !state.user) {
        console.log('🔧 [DEV] Injetando mock user (SSR fallback)')
        useAuthStore.setState({
          user: DEV_MOCK_USER,
          accessToken: DEV_MOCK_TOKENS.accessToken,
          refreshToken: DEV_MOCK_TOKENS.refreshToken,
          isAuthenticated: true,
        })
      }
    }
  }, 100) // Reduzido para 100ms para ser mais rápido
}
