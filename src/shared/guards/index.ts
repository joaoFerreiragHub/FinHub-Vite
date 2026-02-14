/**
 * Route Guards
 *
 * Componentes para proteger rotas baseado em autenticação e roles
 */

export { default as ProtectedRoute } from './ProtectedRoute'

// Re-export guards from features/auth for convenience
export { RequireAuth, RequireRole } from '@/features/auth'
