import { useCallback } from 'react'
import { useUserStore } from '@/stores/useUserStore'
import { UserRole } from '../types'
import {
  Permission,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  isRoleAtLeast,
} from '@/lib/permissions/config'

/**
 * Hook para verificar permissões do usuário atual
 *
 * @example
 * const { can, canAny, canAll, isAtLeast, role } = usePermissions()
 *
 * if (can(Permission.CREATE_ARTICLES)) {
 *   // Mostrar botão de criar artigo
 * }
 *
 * if (isAtLeast(UserRole.PREMIUM)) {
 *   // Mostrar conteúdo premium
 * }
 */
export function usePermissions() {
  const { user, isAuthenticated } = useUserStore()

  const role = user?.role ?? UserRole.VISITOR

  /**
   * Verifica se o usuário tem uma permissão específica
   */
  const can = useCallback(
    (permission: Permission): boolean => {
      return hasPermission(role, permission)
    },
    [role]
  )

  /**
   * Verifica se o usuário tem pelo menos uma das permissões
   */
  const canAny = useCallback(
    (permissions: Permission[]): boolean => {
      return hasAnyPermission(role, permissions)
    },
    [role]
  )

  /**
   * Verifica se o usuário tem todas as permissões
   */
  const canAll = useCallback(
    (permissions: Permission[]): boolean => {
      return hasAllPermissions(role, permissions)
    },
    [role]
  )

  /**
   * Verifica se o role é pelo menos do nível especificado
   */
  const isAtLeast = useCallback(
    (requiredRole: UserRole): boolean => {
      return isRoleAtLeast(role, requiredRole)
    },
    [role]
  )

  /**
   * Verifica se é exatamente um role específico
   */
  const isExactly = useCallback(
    (targetRole: UserRole): boolean => {
      return role === targetRole
    },
    [role]
  )

  return {
    can,
    canAny,
    canAll,
    isAtLeast,
    isExactly,
    role,
    isAuthenticated,
    user,
  }
}
