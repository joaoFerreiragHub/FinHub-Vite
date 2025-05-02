import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type UserRole = 'visitor' | 'regular' | 'premium' | 'creator' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  accessToken: string
  username: string
}

interface UserStore {
  user: User | null
  isAuthenticated: boolean
  hydrated: boolean
  setUser: (user: User) => void
  updateUser: (data: Partial<User>) => void
  logout: () => void
  getRole: () => UserRole
}

// Cria um mock de usuário para desenvolvimento
const mockUser: User = {
  id: "mock-id-123",
  name: "Utilizador de Teste",
  email: "teste@exemplo.com",
  role: "creator", // Para permitir acesso nas rotas protegidas
  accessToken: "mock-token-123",
  username: "teste_user"
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      hydrated: false,
      setUser: (user) => set({ user, isAuthenticated: true }),
      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),
      logout: () => set({ user: null, isAuthenticated: false }),
      getRole: () => get().user?.role ?? 'visitor',
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        // Definir hidratado como true após o processo de rehidratação
        setTimeout(() => {
          useUserStore.setState({ hydrated: true })

          // APENAS EM DESENVOLVIMENTO: inserir um usuário mock se não houver um
          if (process.env.NODE_ENV === 'development' && !state?.user) {
            useUserStore.setState({
              user: mockUser,
              isAuthenticated: true
            })
          }

          console.log("🔄 Zustand hidratado:", useUserStore.getState())
        }, 100)
      }
    }
  )
)

// Inicialização imediata para SSR
if (typeof window !== 'undefined') {
  // Verificar se estamos no ambiente do cliente
  setTimeout(() => {
    const state = useUserStore.getState()
    if (!state.hydrated) {
      useUserStore.setState({ hydrated: true })

      // APENAS EM DESENVOLVIMENTO: inserir um usuário mock se não houver um
      if (process.env.NODE_ENV === 'development' && !state.user) {
        useUserStore.setState({
          user: mockUser,
          isAuthenticated: true
        })
      }
    }
  }, 500)
}
