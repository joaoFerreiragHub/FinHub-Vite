import { type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { usePermissions } from '@/features/auth/hooks/usePermissions'
import { UserRole } from '@/features/auth/types'
import { Permission } from '@/lib/permissions/config'

export interface RequireRoleProps {
  /**
   * Conteúdo a ser renderizado se tiver permissão
   */
  children: ReactNode
  /**
   * Role mínimo necessário
   */
  role?: UserRole
  /**
   * Permissão específica necessária
   */
  permission?: Permission
  /**
   * Múltiplas permissões (precisa de pelo menos uma)
   */
  anyPermission?: Permission[]
  /**
   * Múltiplas permissões (precisa de todas)
   */
  allPermissions?: Permission[]
  /**
   * Componente alternativo se não tiver permissão
   */
  fallback?: ReactNode
  /**
   * Rota para redirect se não autorizado
   */
  redirectTo?: string
}

/**
 * Guard component que requer role ou permissão específica
 *
 * @example
 * // Por role
 * <RequireRole role={UserRole.PREMIUM}>
 *   <PremiumContent />
 * </RequireRole>
 *
 * // Por permissão
 * <RequireRole permission={Permission.CREATE_ARTICLES}>
 *   <CreateArticleButton />
 * </RequireRole>
 *
 * // Com fallback customizado
 * <RequireRole
 *   permission={Permission.VIEW_ARTICLES_PREMIUM}
 *   fallback={<PaywallComponent />}
 * >
 *   <PremiumArticle />
 * </RequireRole>
 */
export function RequireRole({
  children,
  role,
  permission,
  anyPermission,
  allPermissions,
  fallback,
  redirectTo,
}: RequireRoleProps) {
  const { isAtLeast, can, canAny, canAll } = usePermissions()

  let hasAccess = false

  // Verificar por role
  if (role) {
    hasAccess = isAtLeast(role)
  }

  // Verificar por permissão única
  if (permission) {
    hasAccess = can(permission)
  }

  // Verificar por qualquer permissão
  if (anyPermission && anyPermission.length > 0) {
    hasAccess = canAny(anyPermission)
  }

  // Verificar por todas as permissões
  if (allPermissions && allPermissions.length > 0) {
    hasAccess = canAll(allPermissions)
  }

  // Se não tem acesso
  if (!hasAccess) {
    // Se tem redirect, redirecionar
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />
    }

    // Se tem fallback, mostrar fallback
    if (fallback) {
      return <>{fallback}</>
    }

    // Caso contrário, não renderizar nada
    return null
  }

  // Tem acesso, renderizar children
  return <>{children}</>
}
