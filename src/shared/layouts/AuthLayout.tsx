import { type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { Card } from '@/shared/ui'

export interface AuthLayoutProps {
  /**
   * Conteúdo da página (form de login, registro, etc.)
   */
  children: ReactNode
  /**
   * Título da página
   */
  title?: string
  /**
   * Descrição/subtítulo
   */
  description?: string
  /**
   * Se true, redireciona usuário autenticado para dashboard
   */
  redirectIfAuthenticated?: boolean
}

/**
 * Layout para páginas de autenticação (Login, Register, etc.)
 *
 * Features:
 * - Design centralizado
 * - Logo da marca
 * - Redireciona usuários já autenticados
 *
 * @example
 * <AuthLayout title="Bem-vindo" description="Faça login para continuar">
 *   <LoginForm />
 * </AuthLayout>
 */
export function AuthLayout({
  children,
  title,
  description,
  redirectIfAuthenticated = true,
}: AuthLayoutProps) {
  const { isAuthenticated, hydrated } = useAuthStore()

  // Aguardar hidratação
  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  // Se autenticado e deve redirecionar, redirecionar para dashboard
  if (isAuthenticated && redirectIfAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Container centralizado */}
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        {/* Logo */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary">
            FinHub
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sua plataforma de literacia financeira
          </p>
        </div>

        {/* Card do formulário */}
        <Card className="w-full max-w-md" padding="lg">
          {/* Header do card */}
          {(title || description) && (
            <div className="mb-6 space-y-2 text-center">
              {title && (
                <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
              )}
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
            </div>
          )}

          {/* Conteúdo (formulário) */}
          {children}
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>© 2026 FinHub. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  )
}
