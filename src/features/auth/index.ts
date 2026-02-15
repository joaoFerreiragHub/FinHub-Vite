/**
 * Auth Feature Module
 *
 * Sistema de autenticação e autorização
 */

// Types
export {
  UserRole,
  type User,
  type AuthState,
  type LoginCredentials,
  type RegisterData,
  type AuthResponse,
} from './types'

// Hooks
export { usePermissions, usePaywall, type PaywallConfig } from './hooks'

// Permissions
export {
  Permission,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  isRoleAtLeast,
} from '@/lib/permissions/config'

// Note: Para usar Guards, importe diretamente de '@/shared/guards'
// Não re-exportamos aqui para evitar dependências circulares
