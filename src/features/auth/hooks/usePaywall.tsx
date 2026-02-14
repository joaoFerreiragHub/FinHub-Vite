import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePermissions } from './usePermissions'
import { Permission } from '@/lib/permissions/config'
import { UserRole } from '../types'

export interface PaywallConfig {
  /**
   * Título do paywall
   */
  title?: string
  /**
   * Descrição do benefício
   */
  description?: string
  /**
   * Call to action
   */
  cta?: string
  /**
   * Rota de upgrade (padrão: /pricing)
   */
  upgradePath?: string
}

/**
 * Hook para verificar acesso e exibir paywall quando necessário
 *
 * @example
 * const { checkAccess, PaywallComponent } = usePaywall()
 *
 * if (!checkAccess(Permission.VIEW_ARTICLES_PREMIUM)) {
 *   return <PaywallComponent title="Conteúdo Premium" />
 * }
 *
 * return <ArticleContent />
 */
export function usePaywall() {
  const { can, isAtLeast, role } = usePermissions()
  const navigate = useNavigate()

  /**
   * Verifica se tem acesso a uma permissão
   * Retorna true se tem acesso, false caso contrário
   */
  const checkAccess = useCallback(
    (permission: Permission): boolean => {
      return can(permission)
    },
    [can]
  )

  /**
   * Verifica se tem pelo menos um nível de role
   */
  const checkRole = useCallback(
    (requiredRole: UserRole): boolean => {
      return isAtLeast(requiredRole)
    },
    [isAtLeast]
  )

  /**
   * Redireciona para upgrade se não tiver permissão
   */
  const requireAccessOrRedirect = useCallback(
    (permission: Permission, redirectPath = '/pricing'): boolean => {
      const hasAccess = can(permission)
      if (!hasAccess) {
        navigate(redirectPath)
      }
      return hasAccess
    },
    [can, navigate]
  )

  /**
   * Componente de Paywall customizável
   */
  const PaywallComponent = useCallback(
    ({
      title = 'Upgrade para Premium',
      description = 'Este conteúdo está disponível apenas para assinantes premium.',
      cta = 'Ver Planos',
      upgradePath = '/pricing',
    }: PaywallConfig = {}) => {
      return (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-primary/50 bg-muted/20 p-8 text-center">
          <svg
            className="mb-4 h-16 w-16 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>

          <h3 className="mb-2 text-2xl font-semibold">{title}</h3>
          <p className="mb-6 max-w-md text-muted-foreground">{description}</p>

          <div className="flex gap-4">
            <button
              onClick={() => navigate(upgradePath)}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {cta}
            </button>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center justify-center rounded-lg border border-input bg-transparent px-6 py-3 font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Voltar
            </button>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            Seu plano atual: <span className="font-semibold capitalize">{role}</span>
          </p>
        </div>
      )
    },
    [role, navigate]
  )

  return {
    checkAccess,
    checkRole,
    requireAccessOrRedirect,
    PaywallComponent,
    currentRole: role,
  }
}
