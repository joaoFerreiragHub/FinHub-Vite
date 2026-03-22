import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { ChevronRight, Menu, Shield, X } from 'lucide-react'
import { Button } from '@/components/ui'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { UserRole } from '@/features/auth/types'
import { type CreatorSidebarItem, creatorSidebarSections } from '@/routes/creator'
import { cn } from '@/lib/utils'

interface CreatorDashboardShellProps {
  children: ReactNode
}

const CREATOR_ALLOWED_ROLES: UserRole[] = [UserRole.CREATOR, UserRole.ADMIN]

const isItemActive = (currentPath: string, item: CreatorSidebarItem): boolean => {
  const paths = item.matchPaths && item.matchPaths.length > 0 ? item.matchPaths : [item.path]

  if (item.exact) {
    return paths.some((path) => currentPath === path)
  }

  return paths.some(
    (path) => currentPath === path || (path !== '/' && currentPath.startsWith(`${path}/`)),
  )
}

export function CreatorDashboardShell({ children }: CreatorDashboardShellProps) {
  const { user, isAuthenticated, logout } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [currentPath, setCurrentPath] = useState('')

  useEffect(() => {
    if (typeof window === 'undefined') return
    setCurrentPath(window.location.pathname)
    if (window.innerWidth < 1024) {
      setSidebarOpen(false)
    }
  }, [])

  const role = user?.role ?? UserRole.VISITOR
  const canAccessCreatorDashboard = isAuthenticated && CREATOR_ALLOWED_ROLES.includes(role)

  const sections = useMemo(
    () =>
      creatorSidebarSections
        .map((section) => ({
          ...section,
          items: section.items.filter((item) => item.allowedRoles.includes(role)),
        }))
        .filter((section) => section.items.length > 0),
    [role],
  )

  const activeInfo = useMemo(() => {
    for (const section of sections) {
      const activeItem = section.items.find((item) => isItemActive(currentPath, item))
      if (activeItem) {
        return {
          sectionLabel: section.label,
          itemLabel: activeItem.label,
        }
      }
    }
    return null
  }, [sections, currentPath])

  const breadcrumb = activeInfo
    ? `${activeInfo.sectionLabel} ${String.fromCharCode(183)} ${activeInfo.itemLabel}`
    : 'Creator Dashboard'

  const handleLogout = () => {
    logout()
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    }
  }

  if (!canAccessCreatorDashboard) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold text-foreground">Acesso Restrito</h1>
          <p className="text-sm text-muted-foreground">
            Esta area esta disponivel apenas para criadores e administradores.
          </p>
          <a
            href="/"
            className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
          >
            Voltar ao inicio
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-card transition-transform duration-300 lg:translate-x-0',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <div className="flex h-16 items-center justify-between border-b border-border px-4">
            <a
              href="/creators/dashboard"
              className="text-base font-semibold tracking-tight text-foreground"
            >
              Creator Dashboard
            </a>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex-1 overflow-y-auto p-4">
            {sections.map((section) => (
              <section key={section.id} className="mb-6">
                <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {section.label}
                </p>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon
                    const active = isItemActive(currentPath, item)

                    return (
                      <a
                        key={item.path}
                        href={item.path}
                        className={cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                          active
                            ? 'bg-accent text-accent-foreground'
                            : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground',
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </a>
                    )
                  })}
                </div>
              </section>
            ))}
          </nav>

          <div className="border-t border-border p-4">
            {role === UserRole.ADMIN ? (
              <a
                href="/admin"
                className="mb-3 flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <Shield className="h-4 w-4" />
                Admin Panel
              </a>
            ) : null}

            <div className="flex items-center gap-3 rounded-lg border border-border/70 bg-background/60 px-3 py-2">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-9 w-9 rounded-full object-cover"
                />
              ) : (
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {user?.name?.charAt(0) ?? 'U'}
                </span>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{user?.name}</p>
                <p className="truncate text-xs text-muted-foreground">{user?.role}</p>
              </div>
            </div>

            <Button type="button" variant="ghost" className="mt-2 w-full" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </aside>

        {sidebarOpen ? (
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Fechar menu"
          />
        ) : null}

        <div className="flex min-h-screen flex-1 flex-col lg:pl-72">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border bg-background/95 px-4 backdrop-blur sm:px-6">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => setSidebarOpen((open) => !open)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>Creator Dashboard</span>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="truncate text-foreground">{breadcrumb}</span>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  )
}
