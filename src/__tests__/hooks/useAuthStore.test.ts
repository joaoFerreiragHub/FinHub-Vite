import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { UserRole } from '@/features/auth/types'
import { createMockUser, resetAuthStore } from '../utils'

beforeEach(() => {
  resetAuthStore()
})

describe('useAuthStore', () => {
  describe('initial state', () => {
    it('starts with no user', () => {
      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
      expect(state.isAuthenticated).toBe(false)
    })

    it('starts with null tokens', () => {
      const state = useAuthStore.getState()
      expect(state.accessToken).toBeNull()
      expect(state.refreshToken).toBeNull()
    })

    it('starts not loading', () => {
      const state = useAuthStore.getState()
      expect(state.isLoading).toBe(false)
    })
  })

  describe('setUser', () => {
    it('sets user and marks as authenticated', () => {
      const user = createMockUser(UserRole.FREE)
      useAuthStore.getState().setUser(user, 'access-123', 'refresh-456')

      const state = useAuthStore.getState()
      expect(state.user).toEqual(user)
      expect(state.accessToken).toBe('access-123')
      expect(state.refreshToken).toBe('refresh-456')
      expect(state.isAuthenticated).toBe(true)
    })
  })

  describe('updateUser', () => {
    it('updates user properties', () => {
      const user = createMockUser(UserRole.FREE)
      useAuthStore.getState().setUser(user, 'access', 'refresh')

      useAuthStore.getState().updateUser({ name: 'Updated Name', bio: 'New bio' })

      const state = useAuthStore.getState()
      expect(state.user?.name).toBe('Updated Name')
      expect(state.user?.bio).toBe('New bio')
      expect(state.user?.email).toBe(user.email) // unchanged fields preserved
    })

    it('does nothing when no user is set', () => {
      useAuthStore.getState().updateUser({ name: 'Should not work' })
      expect(useAuthStore.getState().user).toBeNull()
    })
  })

  describe('logout', () => {
    it('clears user and tokens', () => {
      const user = createMockUser(UserRole.CREATOR)
      useAuthStore.getState().setUser(user, 'access', 'refresh')

      useAuthStore.getState().logout()

      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
      expect(state.accessToken).toBeNull()
      expect(state.refreshToken).toBeNull()
      expect(state.isAuthenticated).toBe(false)
    })
  })

  describe('getRole', () => {
    it('returns VISITOR when no user is set', () => {
      expect(useAuthStore.getState().getRole()).toBe(UserRole.VISITOR)
    })

    it('returns the user role', () => {
      useAuthStore.getState().setUser(createMockUser(UserRole.PREMIUM), 'a', 'r')
      expect(useAuthStore.getState().getRole()).toBe(UserRole.PREMIUM)
    })
  })

  describe('setTokens', () => {
    it('updates tokens', () => {
      useAuthStore.getState().setTokens('new-access', 'new-refresh')

      const state = useAuthStore.getState()
      expect(state.accessToken).toBe('new-access')
      expect(state.refreshToken).toBe('new-refresh')
    })
  })

  describe('clearAuth', () => {
    it('clears all auth data', () => {
      useAuthStore.getState().setUser(createMockUser(UserRole.ADMIN), 'a', 'r')
      useAuthStore.getState().clearAuth()

      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
      expect(state.accessToken).toBeNull()
      expect(state.refreshToken).toBeNull()
      expect(state.isAuthenticated).toBe(false)
    })
  })

  describe('setLoading', () => {
    it('sets loading state', () => {
      useAuthStore.getState().setLoading(true)
      expect(useAuthStore.getState().isLoading).toBe(true)

      useAuthStore.getState().setLoading(false)
      expect(useAuthStore.getState().isLoading).toBe(false)
    })
  })
})
