/**
 * Auth Feature Module
 *
 * Sistema de autenticação e autorização
 */

// Types
export { UserRole, type User, type AuthState, type LoginCredentials, type RegisterData, type AuthResponse } from './types'

// Hooks
export { usePermissions, usePaywall, type PaywallConfig } from './hooks'

// Guards (re-export from shared)
export { RequireAuth, RequireRole, type RequireAuthProps, type RequireRoleProps } from '@/shared/guards'

// Permissions
export { Permission, hasPermission, hasAnyPermission, hasAllPermissions, isRoleAtLeast } from '@/lib/permissions/config'
