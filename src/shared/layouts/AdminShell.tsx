import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  BarChart3,
  ChevronRight,
  ClipboardList,
  Home,
  LayoutDashboard,
  Layers,
  LifeBuoy,
  Megaphone,
  Menu,
  Newspaper,
  Search,
  Settings2,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Users,
  Wallet,
  X,
  type LucideIcon,
} from 'lucide-react'
import {
  Button,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from '@/components/ui'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { UserRole } from '@/features/auth/types'
import {
  canAccessAdminPath,
  getAccessibleAdminModules,
  getDefaultAdminPath,
} from '@/features/admin/lib/access'
import {
  getAdminShortcutForModule,
  isTypingEventTarget,
  resolveAdminShortcutPath,
} from '@/features/admin/lib/keyboardShortcuts'
import adminRoutes from '@/routes/admin'
import { cn } from '@/lib/utils'

interface AdminShellProps {
  children: ReactNode
}

interface AdminNavItem {
  path: string
  label: string
  icon: LucideIcon
  exact?: boolean
  matchPaths?: string[]
  nested?: boolean
  alwaysVisible?: boolean
}

interface AdminNavSection {
  id: string
  label: string
  items: AdminNavItem[]
}

const GO_SHORTCUT_ARM_TIMEOUT_MS = 1200

const routeMetaByPath = new Map(adminRoutes.map((route) => [route.path, route]))

const getRouteItem = (
  path: string,
  fallbackLabel: string,
  fallbackIcon: LucideIcon,
  options: Omit<AdminNavItem, 'path' | 'label' | 'icon'> = {},
): AdminNavItem => {
  const route = routeMetaByPath.get(path)

  return {
    path,
    label: fallbackLabel,
    icon: route?.icon ?? fallbackIcon,
    ...options,
  }
}

const normalizeAdminAccessPath = (path: string): string => {
  if (path === '/admin/apelacoes') {
    return '/admin/conteudo/apelacoes'
  }

  return path
}

const isPathActive = (currentPath: string, item: AdminNavItem): boolean => {
  const normalizedCurrentPath = normalizeAdminAccessPath(currentPath)
  const paths = item.matchPaths && item.matchPaths.length > 0 ? item.matchPaths : [item.path]

  if (item.exact) {
    return paths.some((path) => normalizedCurrentPath === path)
  }

  return paths.some(
    (path) =>
      normalizedCurrentPath === path ||
      (path !== '/' && normalizedCurrentPath.startsWith(`${path}/`)),
  )
}

const adminSidebarSections: AdminNavSection[] = [
  {
    id: 'principal',
    label: 'Principal',
    items: [getRouteItem('/admin', 'Dashboard', LayoutDashboard, { exact: true })],
  },
  {
    id: 'gestao',
    label: 'Gestao',
    items: [
      getRouteItem('/admin/users', 'Utilizadores', Users),
      getRouteItem('/admin/creators', 'Creators', ShieldAlert),
      getRouteItem('/admin/conteudo', 'Moderacao', ShieldCheck, {
        matchPaths: ['/admin/conteudo', '/admin/apelacoes'],
      }),
      getRouteItem('/admin/conteudo/apelacoes', 'Moderacao Apelacoes', ShieldCheck, {
        nested: true,
      }),
      getRouteItem('/admin/editorial', 'Editorial CMS', Newspaper),
      getRouteItem('/admin/suporte', 'Suporte', LifeBuoy),
      getRouteItem('/admin/recursos', 'Recursos', Layers),
    ],
  },
  {
    id: 'monetizacao',
    label: 'Monetizacao',
    items: [
      getRouteItem('/admin/monetizacao', 'Monetizacao', Wallet),
      getRouteItem('/admin/monetizacao/subscricoes', 'Subscricoes', Wallet, { nested: true }),
    ],
  },
  {
    id: 'operacoes',
    label: 'Operacoes',
    items: [
      getRouteItem('/admin/operacoes', 'Operacoes', Settings2),
      getRouteItem('/admin/operacoes/comunicacoes', 'Comunicacoes', Megaphone, { nested: true }),
      getRouteItem('/admin/operacoes/anuncios', 'Anuncios', Megaphone, { nested: true }),
      getRouteItem('/admin/operacoes/delegacoes', 'Delegacoes', ShieldCheck, { nested: true }),
      getRouteItem('/admin/operacoes/integracoes', 'Integracoes', Settings2, { nested: true }),
    ],
  },
  {
    id: 'estatisticas',
    label: 'Estatisticas',
    items: [
      getRouteItem('/admin/stats', 'Estatisticas', BarChart3),
      getRouteItem('/admin/stats/ferramentas-financeiras', 'Ferramentas Financeiras', BarChart3, {
        nested: true,
      }),
    ],
  },
  {
    id: 'auditoria',
    label: 'Auditoria',
    items: [getRouteItem('/admin/auditoria', 'Auditoria', ClipboardList)],
  },
  {
    id: 'conta',
    label: 'Conta',
    items: [
      {
        path: '/',
        label: 'Voltar ao site',
        icon: Home,
        exact: true,
        alwaysVisible: true,
      },
    ],
  },
]

const COMMAND_MODULE_ICONS: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard,
  users: Users,
  creators: ShieldAlert,
  content: ShieldCheck,
  editorial: Newspaper,
  support: LifeBuoy,
  brands: Layers,
  monetization: Wallet,
  operations: Settings2,
  stats: BarChart3,
  audit: ClipboardList,
}

export function AdminShell({ children }: AdminShellProps) {
  const { user, isAuthenticated, hydrated, logout } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [commandOpen, setCommandOpen] = useState(false)
  const [currentPath, setCurrentPath] = useState<string>(
    typeof window === 'undefined' ? '' : window.location.pathname,
  )
  const goShortcutArmedRef = useRef(false)
  const goShortcutTimerRef = useRef<number | null>(null)

  const clearGoShortcutTimer = useCallback(() => {
    if (goShortcutTimerRef.current !== null && typeof window !== 'undefined') {
      window.clearTimeout(goShortcutTimerRef.current)
      goShortcutTimerRef.current = null
    }
  }, [])

  const resetGoShortcut = useCallback(() => {
    goShortcutArmedRef.current = false
    clearGoShortcutTimer()
  }, [clearGoShortcutTimer])

  const armGoShortcut = useCallback(() => {
    if (typeof window === 'undefined') return

    goShortcutArmedRef.current = true
    clearGoShortcutTimer()
    goShortcutTimerRef.current = window.setTimeout(() => {
      goShortcutArmedRef.current = false
      goShortcutTimerRef.current = null
    }, GO_SHORTCUT_ARM_TIMEOUT_MS)
  }, [clearGoShortcutTimer])

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
    if (!commandOpen) return
    resetGoShortcut()
  }, [commandOpen, resetGoShortcut])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()

      if ((event.ctrlKey || event.metaKey) && key === 'k') {
        event.preventDefault()
        setCommandOpen(true)
        resetGoShortcut()
        return
      }

      if (commandOpen) return
      if (isTypingEventTarget(event.target)) return
      if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return

      if (goShortcutArmedRef.current) {
        const nextPath = resolveAdminShortcutPath(user, key)
        resetGoShortcut()

        if (!nextPath || typeof window === 'undefined') {
          return
        }

        event.preventDefault()
        if (nextPath !== currentPath) {
          window.location.href = nextPath
        }
        return
      }

      if (key === 'g') {
        event.preventDefault()
        armGoShortcut()
      }
    }

    if (typeof document !== 'undefined') {
      document.addEventListener('keydown', onKeyDown)
    }

    return () => {
      if (typeof document !== 'undefined') {
        document.removeEventListener('keydown', onKeyDown)
      }
    }
  }, [armGoShortcut, commandOpen, currentPath, resetGoShortcut, user])

  useEffect(() => {
    return () => {
      clearGoShortcutTimer()
    }
  }, [clearGoShortcutTimer])

  const normalizedPath = normalizeAdminAccessPath(currentPath || '/admin')
  const hasAdminRole = isAuthenticated && user?.role === UserRole.ADMIN
  const hasPathAccess = hasAdminRole && canAccessAdminPath(user, normalizedPath)

  const sections = useMemo(
    () =>
      adminSidebarSections
        .map((section) => ({
          ...section,
          items: section.items.filter((item) => {
            if (item.alwaysVisible) return true
            return canAccessAdminPath(user, normalizeAdminAccessPath(item.path))
          }),
        }))
        .filter((section) => section.items.length > 0),
    [user],
  )

  const activeInfo = useMemo(() => {
    for (const section of sections) {
      const activeItem = section.items.find((item) => isPathActive(normalizedPath, item))
      if (activeItem) {
        return {
          sectionLabel: section.label,
          itemLabel: activeItem.label,
        }
      }
    }

    return null
  }, [normalizedPath, sections])

  const breadcrumb = activeInfo
    ? `${activeInfo.sectionLabel} ${String.fromCharCode(183)} ${activeInfo.itemLabel}`
    : 'Admin Panel'

  const commandModules = useMemo(() => getAccessibleAdminModules(user), [user])

  const navigateToPath = useCallback(
    (path: string) => {
      if (typeof window === 'undefined') return

      setCommandOpen(false)
      resetGoShortcut()

      if (path !== currentPath) {
        window.location.href = path
      }
    },
    [currentPath, resetGoShortcut],
  )

  const handleLogout = () => {
    logout()
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    }
  }

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!hasPathAccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-md text-center">
          <h1 className="mb-2 text-2xl font-bold text-foreground">Acesso Restrito</h1>
          <p className="text-sm text-muted-foreground">
            Esta area esta disponivel apenas para administradores autorizados.
          </p>
          <div className="mt-4 flex justify-center gap-3">
            {hasAdminRole ? (
              <a
                href={getDefaultAdminPath(user)}
                className="text-sm font-medium text-primary hover:underline"
              >
                Voltar ao painel admin
              </a>
            ) : null}
            <a href="/" className="text-sm font-medium text-primary hover:underline">
              Voltar ao inicio
            </a>
          </div>
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
              href="/admin"
              className="flex items-center gap-2 text-base font-semibold tracking-tight text-foreground"
            >
              <Shield className="h-4 w-4" />
              Admin Panel
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
                    const active = isPathActive(normalizedPath, item)

                    return (
                      <a
                        key={item.path}
                        href={item.path}
                        className={cn(
                          'flex items-center gap-3 rounded-lg py-2 text-sm font-medium transition-colors',
                          item.nested ? 'pl-8 pr-3' : 'px-3',
                          active
                            ? 'bg-accent text-accent-foreground'
                            : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground',
                        )}
                        onClick={() => {
                          setCurrentPath(item.path)
                          if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                            setSidebarOpen(false)
                          }
                        }}
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
                  className="h-9 w-9 rounded-full object-cover"
                />
              ) : (
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {user?.name?.charAt(0) ?? 'A'}
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

            <div className="flex min-w-0 items-center gap-1 text-sm text-muted-foreground">
              <span>Admin</span>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="truncate text-foreground">{breadcrumb}</span>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 gap-2"
                onClick={() => setCommandOpen(true)}
              >
                <Search className="h-4 w-4 text-muted-foreground" />
                <span className="hidden sm:inline">Command Palette</span>
                <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                  Ctrl+K
                </kbd>
              </Button>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>

      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
        <CommandInput placeholder="Navegar pelos modulos admin..." />
        <CommandList>
          <CommandEmpty>Sem comandos disponiveis para os escopos atuais.</CommandEmpty>
          <CommandGroup heading="Modulos admin">
            {commandModules.map((moduleConfig) => {
              const Icon = COMMAND_MODULE_ICONS[moduleConfig.key] ?? Shield
              const shortcut = getAdminShortcutForModule(moduleConfig.key).toUpperCase()

              return (
                <CommandItem
                  key={moduleConfig.key}
                  value={`${moduleConfig.label} ${moduleConfig.path}`}
                  onSelect={() => navigateToPath(moduleConfig.path)}
                >
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="flex-1">{moduleConfig.label}</span>
                  <CommandShortcut>{`G ${shortcut}`}</CommandShortcut>
                </CommandItem>
              )
            })}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  )
}
