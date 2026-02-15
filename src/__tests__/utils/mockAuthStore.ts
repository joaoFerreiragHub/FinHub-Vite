import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { UserRole, type User } from '@/features/auth/types'

export function createMockUser(role: UserRole = UserRole.FREE): User {
  return {
    id: 'test-user-id',
    name: 'Test',
    lastName: 'User',
    email: 'test@finhub.test',
    username: 'test_user',
    role,
    isEmailVerified: true,
    favoriteTopics: ['investimentos'],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  }
}

export function mockAuthenticatedUser(role: UserRole = UserRole.FREE) {
  useAuthStore.setState({
    user: createMockUser(role),
    accessToken: 'test-access-token',
    refreshToken: 'test-refresh-token',
    isAuthenticated: true,
    isLoading: false,
    hydrated: true,
  })
}

export function mockUnauthenticatedUser() {
  useAuthStore.setState({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: false,
    hydrated: true,
  })
}

export function resetAuthStore() {
  useAuthStore.setState({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: false,
    hydrated: false,
  })
}
