import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Tipos de utilizador que a app reconhece
export type UserRole = 'visitor' | 'regular' | 'premium' | 'creator' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  // mais campos que aches úteis (token, settings, etc)
}

interface UserStore {
  user: User | null
  isAuthenticated: boolean
  setUser: (user: User) => void
  updateUser: (data: Partial<User>) => void
  logout: () => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: true }),
      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'user-storage', // localStorage key
    },
  ),
)
