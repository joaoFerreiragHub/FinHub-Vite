import { useEffect, useMemo, useState, type ComponentType, type ReactNode } from 'react'
import {
  Activity,
  Bell,
  ChevronRight,
  CreditCard,
  Heart,
  LayoutDashboard,
  Menu,
  Settings,
  Users,
  X,
} from 'lucide-react'
import { Badge, Button } from '@/components/ui'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { UserRole } from '@/features/auth/types'
import { cn } from '@/lib/utils'

interface UserAccountShellProps {
  children: ReactNode
}

interface AccountNavItem {
  href: string
  label: string
  icon: ComponentType<{ className?: string }>
  exact?: boolean
}

interface AccountNavSection {
  id: string
  label: string
  items: AccountNavItem[]
}

const accountSections: AccountNavSection[] = [
  {
    id: 'principal',
    label: 'Principal',
    items: [{ href: '/conta', label: 'Visao geral', icon: LayoutDashboard, exact: true }],
  },
  {
    id: 'conta',
    label: 'Conta',
    items: [
      { href: '/conta/definicoes', label: 'Definicoes', icon: Settings, exact: true },
      { href: '/notificacoes', label: 'Notificacoes', icon: Bell, exact: true },
    ],
  },
  {
    id: 'atividade',
    label: 'Atividade',
    items: [
      { href: '/feed', label: 'Feed', icon: Activity, exact: true },
      { href: '/favoritos', label: 'Favoritos', icon: Heart, exact: true },
      { href: '/seguindo', label: 'A seguir', icon: Users, exact: true },
    ],
  },
  {
    id: 'plano',
    label: 'Plano',
    items: [{ href: '/conta/plano', label: 'O meu plano', icon: CreditCard, exact: true }],
  },
]

function isItemActive(currentPath: string, item: AccountNavItem): boolean {
  if (item.exact) {
    return currentPath === item.href
  }

  return currentPath === item.href || currentPath.startsWith(`${item.href}/`)
}

function formatRole(role: UserRole | undefined): string {
  switch (role) {
    case UserRole.FREE:
      return 'Free'
    case UserRole.PREMIUM:
      return 'Premium'
    case UserRole.CREATOR:
      return 'Creator'
    case UserRole.ADMIN:
      return 'Admin'
    case UserRole.BRAND_MANAGER:
      return 'Brand'
    default:
      return 'Visitor'
  }
}

export function UserAccountShell({ children }: UserAccountShellProps) {
  const { user, isAuthenticated, hydrated, logout } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [currentPath, setCurrentPath] = useState('')

  useEffect(() => {
    if (typeof window === 'undefined') return

    const syncPath = () => setCurrentPath(window.location.pathname)
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false)
      }
    }

    syncPath()
    handleResize()

    window.addEventListener('popstate', syncPath)
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('popstate', syncPath)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    if (!hydrated || typeof window === 'undefined') return

    if (!isAuthenticated) {
      window.location.replace('/login')
      return
    }

    if (user?.role === UserRole.CREATOR) {
      window.location.replace('/creators/dashboard')
      return
    }

    if (user?.role === UserRole.ADMIN) {
      window.location.replace('/admin')
    }
  }, [hydrated, isAuthenticated, user?.role])

  const activeItem = useMemo(() => {
    for (const section of accountSections) {
      const item = section.items.find((navItem) => isItemActive(currentPath, navItem))
      if (item) {
        return { sectionLabel: section.label, itemLabel: item.label }
      }
    }

    return null
  }, [currentPath])

  const breadcrumb = activeItem
    ? `${activeItem.sectionLabel} ${String.fromCharCode(183)} ${activeItem.itemLabel}`
    : 'Minha conta'

  const handleLogout = () => {
    logout()
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    }
  }

  if (!hydrated || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (user?.role === UserRole.CREATOR || user?.role === UserRole.ADMIN) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">A redirecionar...</p>
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
            <a href="/conta" className="text-base font-semibold tracking-tight text-foreground">
              Minha conta
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
            {accountSections.map((section) => (
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
                        key={item.href}
                        href={item.href}
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
            <div className="flex items-center gap-3 rounded-lg border border-border/70 bg-background/60 px-3 py-2">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {user?.name?.charAt(0) ?? 'U'}
                </span>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{user?.name}</p>
                <p className="truncate text-xs text-muted-foreground">@{user?.username}</p>
                <Badge variant="outline" className="mt-1 text-[10px] uppercase">
                  {formatRole(user?.role)}
                </Badge>
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
              onClick={() => setSidebarOpen((isOpen) => !isOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>Conta</span>
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
