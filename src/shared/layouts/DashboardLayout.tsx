import { type ReactNode, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { usePermissions } from '@/features/auth/hooks/usePermissions'
import { UserRole, Permission } from '@/features/auth'
import { Button } from '@/components/ui'

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
 * - Sidebar com navegação
 * - Header com user menu
 * - Breadcrumbs
 * - Responsive
 *
 * @example
 * <DashboardLayout>
 *   <MyPage />
 * </DashboardLayout>
 */
export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuthStore()
  const { can, isAtLeast } = usePermissions()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogout = () => {
    logout()
    navigate('/auth/login')
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-border px-6">
          <Link to="/dashboard" className="text-2xl font-bold text-primary">
            FinHub
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          <NavSection title="Principal">
            <NavItem to="/dashboard" icon="🏠">
              Dashboard
            </NavItem>
            <NavItem to="/hub/articles" icon="📰">
              Artigos
            </NavItem>
            {isAtLeast(UserRole.FREE) && (
              <NavItem to="/hub/courses" icon="🎓">
                Cursos
              </NavItem>
            )}
          </NavSection>

          {can(Permission.USE_CALCULATORS) && (
            <NavSection title="Ferramentas">
              <NavItem to="/tools/calculators" icon="🧮">
                Calculadoras
              </NavItem>
              {can(Permission.CREATE_PORTFOLIO) && (
                <NavItem to="/tools/portfolio" icon="📊">
                  Portfolio
                </NavItem>
              )}
            </NavSection>
          )}

          {isAtLeast(UserRole.FREE) && (
            <NavSection title="Social">
              <NavItem to="/social/forum" icon="💬">
                Fórum
              </NavItem>
              {can(Permission.USE_CHAT) && (
                <NavItem to="/social/chat" icon="✉️">
                  Chat
                </NavItem>
              )}
            </NavSection>
          )}

          {isAtLeast(UserRole.CREATOR) && (
            <NavSection title="Criador">
              <NavItem to="/creators/dashboard" icon="📝">
                Meu Conteúdo
              </NavItem>
              <NavItem to="/creators/analytics" icon="📈">
                Análises
              </NavItem>
            </NavSection>
          )}

          {isAtLeast(UserRole.ADMIN) && (
            <NavSection title="Admin">
              <NavItem to="/admin/users" icon="👥">
                Utilizadores
              </NavItem>
              <NavItem to="/admin/content" icon="📚">
                Conteúdo
              </NavItem>
            </NavSection>
          )}
        </nav>

        {/* User info */}
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="h-full w-full rounded-full" />
              ) : (
                <span className="text-sm font-medium">{user?.name.charAt(0)}</span>
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium">{user?.name}</p>
              <p className="truncate text-xs text-muted-foreground capitalize">{user?.role}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="mt-2" onClick={handleLogout}>
            Sair
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div
        className={`flex flex-1 flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}
      >
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-lg p-2 hover:bg-accent"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <div className="flex items-center gap-4">
            {!isAtLeast(UserRole.PREMIUM) && (
              <Button variant="default" size="sm" onClick={() => navigate('/pricing')}>
                ⭐ Upgrade
              </Button>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}

// Helper components
function NavSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      <div className="space-y-1">{children}</div>
    </div>
  )
}

function NavItem({ to, icon, children }: { to: string; icon: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
    >
      <span className="text-lg">{icon}</span>
      <span>{children}</span>
    </Link>
  )
}
