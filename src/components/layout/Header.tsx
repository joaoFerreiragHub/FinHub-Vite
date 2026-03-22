import { useMemo, useState } from 'react'
import { LayoutDashboard, LogOut, Menu, PanelLeft, Settings, User, X } from 'lucide-react'
import { Button, Popover, PopoverContent, PopoverTrigger } from '@/components/ui'
import { ToggleTheme } from '@/components/ui/toggle-theme'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { GlobalSearchBar } from '@/features/social/components/GlobalSearchBar'
import { NotificationBell } from '@/features/social/components/NotificationBell'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Educadores', to: '/criadores', activeWhen: ['/criadores', '/creators'] },
  {
    label: 'Conteudos',
    to: '/explorar/tudo',
    activeWhen: [
      '/explorar',
      '/artigos',
      '/videos',
      '/cursos',
      '/eventos',
      '/podcasts',
      '/livros',
      '/hub',
    ],
  },
  { label: 'Noticias', to: '/aprender/noticias', activeWhen: ['/aprender/noticias', '/noticias'] },
  {
    label: 'Mercados',
    to: '/mercados',
    activeWhen: ['/mercados', '/stocks', '/recursos'],
  },
  { label: 'Ferramentas', to: '/ferramentas', activeWhen: ['/ferramentas'] },
]

type NavItemConfig = {
  label: string
  to: string
  activeWhen: string[]
}

function isActivePath(pathname: string, activeWhen: string[]) {
  return activeWhen.some((pattern) => pathname === pattern || pathname.startsWith(`${pattern}/`))
}

function navigateTo(path: string) {
  if (typeof window !== 'undefined') {
    window.location.href = path
  }
}

function NavItem({
  item,
  currentPath,
  mobile = false,
  onSelect,
}: {
  item: NavItemConfig
  currentPath: string
  mobile?: boolean
  onSelect?: () => void
}) {
  const active = isActivePath(currentPath, item.activeWhen)

  return (
    <a
      href={item.to}
      onClick={onSelect}
      className={cn(
        mobile
          ? 'rounded-md px-3 py-2.5 text-sm font-medium transition-colors'
          : 'border-b-2 border-transparent px-1 py-4 text-sm transition-colors',
        mobile
          ? active
            ? 'bg-accent text-foreground'
            : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground'
          : active
            ? 'border-primary text-foreground font-medium'
            : 'text-muted-foreground hover:text-foreground',
      )}
    >
      {item.label}
    </a>
  )
}

interface HeaderProps {
  onSidebarToggle?: () => void
  sidebarToggleLabel?: string
  containerClassName?: string
}

export default function Header({
  onSidebarToggle,
  sidebarToggleLabel = 'Abrir menu lateral',
  containerClassName = 'max-w-7xl',
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuthStore()
  const pathname = typeof window !== 'undefined' ? window.location.pathname : ''

  const profilePath = useMemo(() => `/perfil/${user?.username ?? 'me'}`, [user?.username])
  const settingsPath = useMemo(
    () => (user?.role === 'creator' ? '/creators/definicoes' : '/perfil'),
    [user?.role],
  )
  const userInitial = useMemo(() => {
    const name = (user?.name ?? user?.username ?? 'U').trim()
    return name ? name.charAt(0).toUpperCase() : 'U'
  }, [user?.name, user?.username])

  const handleNavigate = (url: string) => {
    setMobileOpen(false)
    navigateTo(url)
  }

  const handleLogout = () => {
    logout()
    setMobileOpen(false)
    navigateTo('/login')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div
        className={cn(
          'mx-auto flex h-14 w-full items-center gap-4 px-4 sm:px-6',
          containerClassName,
        )}
      >
        <div className="flex items-center gap-2">
          {onSidebarToggle ? (
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onSidebarToggle}
              aria-label={sidebarToggleLabel}
            >
              <PanelLeft className="h-5 w-5" />
            </Button>
          ) : null}

          <a href="/" className="flex items-center gap-2 font-bold text-foreground">
            <span className="text-xl font-extrabold tracking-tight">
              Fin<span className="text-primary">Hub</span>
            </span>
          </a>
        </div>

        <nav className="hidden flex-1 items-center justify-center gap-5 lg:flex">
          {navItems.map((item) => (
            <NavItem key={item.to} item={item} currentPath={pathname} />
          ))}
        </nav>

        <div className="hidden min-w-0 flex-1 items-center justify-end gap-2 md:flex">
          <div className="w-full max-w-sm">
            <GlobalSearchBar onNavigate={handleNavigate} />
          </div>
          {isAuthenticated ? (
            <NotificationBell
              onNavigateToNotifications={() => handleNavigate('/notificacoes')}
              onClickNotification={(notification) =>
                handleNavigate(notification.targetUrl || '/notificacoes')
              }
            />
          ) : null}
          <ToggleTheme />
          {!isAuthenticated ? (
            <>
              <Button variant="ghost" asChild>
                <a href="/login">Entrar</a>
              </Button>
              <Button asChild>
                <a href="/registar">Registar</a>
              </Button>
            </>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-full border-border/60 bg-card p-0"
                  aria-label="Abrir menu de conta"
                >
                  <span className="text-sm font-semibold">{userInitial}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" sideOffset={10} className="w-56 p-1.5">
                <div className="border-b border-border px-2 py-1.5">
                  <p className="text-xs text-muted-foreground">Conta</p>
                  <p className="truncate text-sm font-medium text-foreground">
                    {user?.name ?? user?.username ?? 'Utilizador'}
                  </p>
                </div>
                <div className="mt-1 grid gap-1">
                  <a
                    href="/dashboard"
                    className="inline-flex items-center gap-2 rounded-md px-2 py-2 text-sm text-foreground hover:bg-accent"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </a>
                  <a
                    href={profilePath}
                    className="inline-flex items-center gap-2 rounded-md px-2 py-2 text-sm text-foreground hover:bg-accent"
                  >
                    <User className="h-4 w-4" />
                    Perfil
                  </a>
                  <a
                    href={settingsPath}
                    className="inline-flex items-center gap-2 rounded-md px-2 py-2 text-sm text-foreground hover:bg-accent"
                  >
                    <Settings className="h-4 w-4" />
                    Definicoes
                  </a>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center gap-2 rounded-md px-2 py-2 text-left text-sm text-foreground hover:bg-accent"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>

        <div className="ml-auto flex items-center gap-1 md:hidden">
          {isAuthenticated ? (
            <NotificationBell
              onNavigateToNotifications={() => handleNavigate('/notificacoes')}
              onClickNotification={(notification) =>
                handleNavigate(notification.targetUrl || '/notificacoes')
              }
            />
          ) : null}
          <ToggleTheme />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-border/70 bg-background/95 md:hidden">
          <div className={cn('mx-auto w-full space-y-3 px-4 py-3 sm:px-6', containerClassName)}>
            <GlobalSearchBar onNavigate={handleNavigate} />
            <nav className="grid gap-1">
              {navItems.map((item) => (
                <NavItem
                  key={item.to}
                  item={item}
                  currentPath={pathname}
                  mobile
                  onSelect={() => setMobileOpen(false)}
                />
              ))}
            </nav>
            <div className="grid gap-1 border-t border-border pt-3">
              {!isAuthenticated ? (
                <>
                  <Button variant="outline" asChild className="justify-start">
                    <a href="/login">Entrar</a>
                  </Button>
                  <Button asChild className="justify-start">
                    <a href="/registar">Registar</a>
                  </Button>
                </>
              ) : (
                <>
                  <a
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-accent"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </a>
                  <a
                    href={profilePath}
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-accent"
                  >
                    <User className="h-4 w-4" />
                    Perfil
                  </a>
                  <a
                    href={settingsPath}
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-accent"
                  >
                    <Settings className="h-4 w-4" />
                    Definicoes
                  </a>
                  <Button variant="ghost" className="justify-start" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
