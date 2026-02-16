import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { UserRole } from '@/features/auth/types'

interface ProtectedRouteProps {
  allowedRoles: UserRole[]
  children: React.ReactNode
}

/**
 * Guard component que protege rotas baseado em roles
 *
 * Em DEV mode: Sempre permite acesso (sem restrições)
 * Em produção: Verifica autenticação e roles
 */
export default function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const { user, isAuthenticated, hydrated } = useAuthStore()

  // DEV MODE: Sem restrições - vê tudo como qualquer user
  if (import.meta.env.DEV) {
    return <>{children}</>
  }

  // PRODUÇÃO: Aguardar hidratação
  if (!hydrated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        <span className="ml-2 text-sm text-muted-foreground">A carregar...</span>
      </div>
    )
  }

  // PRODUÇÃO: Não autenticado
  if (!isAuthenticated) {
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    }
    return null
  }

  // PRODUÇÃO: Verificar role
  if (user && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex items-center justify-center h-screen flex-col gap-4">
        <h1 className="text-2xl font-bold">Acesso Negado</h1>
        <p className="text-muted-foreground">Não tens permissão para aceder a esta página.</p>
        <button
          onClick={() => (window.location.href = '/')}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Voltar à Homepage
        </button>
      </div>
    )
  }

  return <>{children}</>
}
