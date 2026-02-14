import { useEffect } from 'react'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { UserRole } from '@/features/auth/types'

interface ProtectedRouteProps {
  allowedRoles: UserRole[]
  children: React.ReactNode
}

/**
 * Guard component que protege rotas baseado em roles
 *
 * Redireciona para login se não autenticado
 * Redireciona para unauthorized se role não permitido
 *
 * @example
 * <ProtectedRoute allowedRoles={['creator', 'admin']}>
 *   <CreatorDashboard />
 * </ProtectedRoute>
 */
export default function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const { user, isAuthenticated, hydrated } = useAuthStore()
  const isDevelopment = import.meta.env.DEV

  useEffect(() => {
    console.log('✅ ProtectedRoute:', { hydrated, isAuthenticated, user: user?.role })

    // Só redireciona em produção ou quando realmente hidratado em dev
    if (!hydrated && isDevelopment) return

    if (!isAuthenticated) {
      console.log('Redirecionando para login...')
      window.location.href = '/auth/login'
    } else if (user && !allowedRoles.includes(user.role)) {
      console.log('Redirecionando para unauthorized...')
      window.location.href = '/unauthorized'
    }
  }, [hydrated, isAuthenticated, user, allowedRoles, isDevelopment])

  // Em desenvolvimento, podemos mostrar o conteúdo mesmo sem hidratação completa
  if (!hydrated && !isDevelopment) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        <span className="ml-2 text-sm text-muted-foreground">A carregar...</span>
      </div>
    )
  }

  // Em desenvolvimento, podemos ser mais permissivos
  if (isDevelopment) {
    return <>{children}</>
  }

  // Em produção, verificar rigorosamente
  return <>{isAuthenticated && user && allowedRoles.includes(user.role) && children}</>
}
