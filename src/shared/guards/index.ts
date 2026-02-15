/**
 * Route Guards
 *
 * Componentes para proteger rotas baseado em autenticação e roles
 */

export { default as ProtectedRoute } from './ProtectedRoute'
export { RequireAuth, type RequireAuthProps } from './RequireAuth'
export { RequireRole, type RequireRoleProps } from './RequireRole'
