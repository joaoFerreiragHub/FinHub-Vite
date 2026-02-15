import { ReactNode } from 'react'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { UserRole } from '@/features/auth/types'
import { Header } from './Header'

interface UserLayoutProps {
  children: ReactNode
}

/**
 * Layout para usuarios autenticados (nao creators/admins)
 *
 * Features:
 * - Header com search, notifications, user menu
 * - Nav bar simples
 * - Verifica autenticacao
 */
export function UserLayout({ children }: UserLayoutProps) {
  const { user, isAuthenticated } = useAuthStore()
  const hideTopNavForCreator = user?.role === UserRole.CREATOR || user?.role === UserRole.ADMIN

  if (!isAuthenticated || user?.role === UserRole.VISITOR) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Acesso Restrito</h1>
          <p className="text-muted-foreground">Faz login para continuares.</p>
          <a href="/" className="mt-4 inline-block text-primary hover:underline">
            Ir para Login
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      {!hideTopNavForCreator && (
        <nav className="border-b border-border bg-card px-6">
          <div className="mx-auto flex max-w-5xl gap-1 overflow-x-auto">
            <NavLink href="/perfil">Perfil</NavLink>
            <NavLink href="/feed">Feed</NavLink>
            <NavLink href="/favoritos">Favoritos</NavLink>
            <NavLink href="/seguindo">A Seguir</NavLink>
            <NavLink href="/notificacoes">Notificacoes</NavLink>
            <NavLink href="/pesquisar">Pesquisar</NavLink>
          </div>
        </nav>
      )}

      <main className="flex-1">{children}</main>
    </div>
  )
}

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  const isActive = typeof window !== 'undefined' && window.location.pathname === href

  return (
    <a
      href={href}
      className={`flex-shrink-0 border-b-2 px-4 py-3 text-sm font-medium transition-colors hover:text-foreground ${
        isActive ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground'
      }`}
    >
      {children}
    </a>
  )
}
