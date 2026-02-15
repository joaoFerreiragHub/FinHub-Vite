import { type ReactNode, useState } from 'react'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { getRoutesByRole } from '@/lib/routing/getRoutesByRole'
import { Button } from '@/components/ui'
import { Menu } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface DashboardLayoutProps {
  /**
   * Conteúdo da página
   */
  children: ReactNode
}

/**
 * Layout principal para páginas autenticadas
 *
 * Features:
 * - Sidebar com navegação baseada em role
 * - Header com user menu
 * - Responsive
 * - Usa configurações de rotas de src/routes/
 *
 * @example
 * <DashboardLayout>
 *   <MyPage />
 * </DashboardLayout>
 */
export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout, isAuthenticated } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const routes = isAuthenticated ? getRoutesByRole(user?.role || 'visitor') : []
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''

  const isPathActive = (path: string) =>
    currentPath === path || (path !== '/' && currentPath.startsWith(`${path}/`))

  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card transition-transform duration-300',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-border px-6">
          <a href="/" className="text-2xl font-bold text-primary">
            FinHub
          </a>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {routes.map((route) => {
            const Icon = route.icon
            return (
              <a
                key={route.path}
                href={route.path}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                  isPathActive(route.path) && 'bg-accent text-accent-foreground',
                )}
              >
                {Icon && <Icon className="h-5 w-5" />}
                <span>{route.label}</span>
              </a>
            )
          })}
        </nav>

        {/* User info */}
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="h-full w-full rounded-full" />
              ) : (
                <span className="text-sm font-medium">{user?.name?.charAt(0)}</span>
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium">{user?.name}</p>
              <p className="truncate text-xs text-muted-foreground capitalize">{user?.role}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="mt-2 w-full" onClick={handleLogout}>
            Sair
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div
        className={cn(
          'flex flex-1 flex-col transition-all duration-300',
          sidebarOpen ? 'ml-64' : 'ml-0',
        )}
      >
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-lg p-2 hover:bg-accent"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.name}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
