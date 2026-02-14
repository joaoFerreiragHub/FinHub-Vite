import { type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useUserStore } from '@/stores/useUserStore'

export interface RequireAuthProps {
  /**
   * Conteúdo a ser renderizado se autenticado
   */
  children: ReactNode
  /**
   * Rota para redirect se não autenticado
   */
  redirectTo?: string
  /**
   * Componente fallback enquanto hidrata
   */
  fallback?: ReactNode
}

/**
 * Guard component que requer autenticação
 *
 * @example
 * <RequireAuth redirectTo="/login">
 *   <DashboardPage />
 * </RequireAuth>
 */
export function RequireAuth({
  children,
  redirectTo = '/auth/login',
  fallback = <div>Carregando...</div>,
}: RequireAuthProps) {
  const { isAuthenticated, hydrated } = useUserStore()
  const location = useLocation()

  // Aguardar hidratação do Zustand
  if (!hydrated) {
    return <>{fallback}</>
  }

  // Se não autenticado, redirecionar para login preservando o destino original
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  return <>{children}</>
}
