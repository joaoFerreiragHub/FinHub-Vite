export type UserRole = 'visitor' | 'regular' | 'premium' | 'creator' | 'admin'
export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
}
interface UserStore {
  user: User | null
  isAuthenticated: boolean
  setUser: (user: User) => void
  updateUser: (data: Partial<User>) => void
  logout: () => void
}
export declare const useUserStore: import('zustand').UseBoundStore<
  Omit<import('zustand').StoreApi<UserStore>, 'persist'> & {
    persist: {
      setOptions: (
        options: Partial<import('zustand/middleware').PersistOptions<UserStore, UserStore>>,
      ) => void
      clearStorage: () => void
      rehydrate: () => Promise<void> | void
      hasHydrated: () => boolean
      onHydrate: (fn: (state: UserStore) => void) => () => void
      onFinishHydration: (fn: (state: UserStore) => void) => () => void
      getOptions: () => Partial<import('zustand/middleware').PersistOptions<UserStore, UserStore>>
    }
  }
>
export {}
