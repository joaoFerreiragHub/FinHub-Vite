import { ReactNode } from 'react'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { UserRole } from '@/features/auth/types'

interface UserLayoutProps {
  children: ReactNode
}

/**
 * Layout para usuários autenticados (não creators/admins)
 *
 * Features:
 * - Header com user menu
 * - Sem sidebar complexa
 * - Verifica autenticação
 */
export function UserLayout({ children }: UserLayoutProps) {
  const { user, isAuthenticated } = useAuthStore()

  if (!isAuthenticated || user?.role === UserRole.VISITOR) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Acesso Restrito</h1>
          <p className="text-muted-foreground">Faz login para continuares.</p>
          <a href="/auth/login" className="mt-4 inline-block text-primary hover:underline">
            Ir para Login
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* TODO: Header com user menu */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
