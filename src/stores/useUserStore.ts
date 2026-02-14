/**
 * @deprecated Use useAuthStore from '@/features/auth/stores/useAuthStore' instead
 *
 * This is a compatibility wrapper that maps to the new useAuthStore.
 * Kept for backward compatibility during migration.
 */

import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import type { User } from '@/features/auth/types'

// Re-export types for compatibility
export type { User }
export { UserRole } from '@/features/auth/types'

// Re-export store with mapped methods for compatibility
export const useUserStore = () => {
  const authStore = useAuthStore()

  return {
    // State
    user: authStore.user,
    isAuthenticated: authStore.isAuthenticated,
    hydrated: authStore.hydrated,
    isLoading: authStore.isLoading,

    // Actions (mapped)
    setUser: (user: User) => {
      authStore.setUser(user, authStore.accessToken || '', authStore.refreshToken || '')
    },
    login: authStore.login,
    logout: authStore.logout,
    updateUser: authStore.updateUser,

    // Legacy getter
    getRole: () => authStore.user?.role ?? 'visitor' as const,
  }
}

// Default export for compatibility
export default useUserStore
