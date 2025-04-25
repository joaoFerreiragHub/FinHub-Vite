import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      hydrated: false, // 👈 Garante estado inicial
      setUser: (user) => set({ user, isAuthenticated: true, hydrated: true }),

      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),
      logout: () => set({ user: null, isAuthenticated: false }),
      getRole: () => get().user?.role ?? 'visitor',
    }),
    {
      name: 'user-storage',
    onRehydrateStorage: () => {
      return (state, error) => {
        console.log("🔄 Zustand hidratado:", state, "Erro:", error)
        useUserStore.setState({ hydrated: true })

        // Confirma que o estado está como esperas:
        setTimeout(() => {
          console.log("📊 Estado após hidratação:", useUserStore.getState())
        }, 100)
      }
    },

    },
  ),
)

