import { renderHook } from '@testing-library/react'
import { usePermissions } from '@/features/auth/hooks/usePermissions'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { UserRole } from '@/features/auth/types'
import { Permission } from '@/lib/permissions/config'
import { createMockUser, resetAuthStore } from '../utils'

beforeEach(() => {
  resetAuthStore()
})

describe('usePermissions', () => {
  it('returns VISITOR role when not authenticated', () => {
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      hydrated: true,
    })

    const { result } = renderHook(() => usePermissions())
    expect(result.current.role).toBe(UserRole.VISITOR)
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('returns the authenticated user role', () => {
    useAuthStore.setState({
      user: createMockUser(UserRole.PREMIUM),
      isAuthenticated: true,
      hydrated: true,
    })

    const { result } = renderHook(() => usePermissions())
    expect(result.current.role).toBe(UserRole.PREMIUM)
    expect(result.current.isAuthenticated).toBe(true)
  })

  describe('can()', () => {
    it('returns true for allowed permission', () => {
      useAuthStore.setState({
        user: createMockUser(UserRole.FREE),
        isAuthenticated: true,
        hydrated: true,
      })

      const { result } = renderHook(() => usePermissions())
      expect(result.current.can(Permission.FOLLOW_CREATORS)).toBe(true)
    })

    it('returns false for disallowed permission', () => {
      useAuthStore.setState({
        user: createMockUser(UserRole.FREE),
        isAuthenticated: true,
        hydrated: true,
      })

      const { result } = renderHook(() => usePermissions())
      expect(result.current.can(Permission.CREATE_ARTICLES)).toBe(false)
    })
  })

  describe('canAny()', () => {
    it('returns true when at least one permission is allowed', () => {
      useAuthStore.setState({
        user: createMockUser(UserRole.FREE),
        isAuthenticated: true,
        hydrated: true,
      })

      const { result } = renderHook(() => usePermissions())
      expect(result.current.canAny([Permission.FOLLOW_CREATORS, Permission.ADMIN_PANEL])).toBe(true)
    })
  })

  describe('canAll()', () => {
    it('returns true when all permissions are allowed', () => {
      useAuthStore.setState({
        user: createMockUser(UserRole.CREATOR),
        isAuthenticated: true,
        hydrated: true,
      })

      const { result } = renderHook(() => usePermissions())
      expect(result.current.canAll([Permission.CREATE_ARTICLES, Permission.CREATE_COURSES])).toBe(
        true,
      )
    })

    it('returns false when some permissions are missing', () => {
      useAuthStore.setState({
        user: createMockUser(UserRole.FREE),
        isAuthenticated: true,
        hydrated: true,
      })

      const { result } = renderHook(() => usePermissions())
      expect(result.current.canAll([Permission.FOLLOW_CREATORS, Permission.CREATE_ARTICLES])).toBe(
        false,
      )
    })
  })

  describe('isAtLeast()', () => {
    it('CREATOR is at least PREMIUM', () => {
      useAuthStore.setState({
        user: createMockUser(UserRole.CREATOR),
        isAuthenticated: true,
        hydrated: true,
      })

      const { result } = renderHook(() => usePermissions())
      expect(result.current.isAtLeast(UserRole.PREMIUM)).toBe(true)
    })

    it('FREE is not at least PREMIUM', () => {
      useAuthStore.setState({
        user: createMockUser(UserRole.FREE),
        isAuthenticated: true,
        hydrated: true,
      })

      const { result } = renderHook(() => usePermissions())
      expect(result.current.isAtLeast(UserRole.PREMIUM)).toBe(false)
    })
  })

  describe('isExactly()', () => {
    it('returns true for exact role match', () => {
      useAuthStore.setState({
        user: createMockUser(UserRole.PREMIUM),
        isAuthenticated: true,
        hydrated: true,
      })

      const { result } = renderHook(() => usePermissions())
      expect(result.current.isExactly(UserRole.PREMIUM)).toBe(true)
      expect(result.current.isExactly(UserRole.CREATOR)).toBe(false)
    })
  })
})
