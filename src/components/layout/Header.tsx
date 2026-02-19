import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, LayoutDashboard, PanelLeft, User, LogOut } from 'lucide-react'
import { Button } from '@/components/ui'
import { ToggleTheme } from '@/components/ui/toggle-theme'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
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

function NavItem({
  item,
  currentPath,
  mobile = false,
}: {
  item: NavItemConfig
  currentPath: string
  mobile?: boolean
}) {
  const active = isActivePath(currentPath, item.activeWhen)

  return (
    <Link
      to={item.to}
      className={cn(
        mobile
          ? 'rounded-lg px-3 py-2 text-sm font-medium transition-colors'
          : 'rounded-md px-3 py-2 text-sm font-medium transition-colors',
        active
          ? 'bg-accent text-foreground'
          : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground',
      )}
    >
      {item.label}
    </Link>
  )
}

interface HeaderProps {
  onSidebarToggle?: () => void
  sidebarToggleLabel?: string
}

export default function Header({
  onSidebarToggle,
  sidebarToggleLabel = 'Abrir menu lateral',
}: HeaderProps) {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuthStore()

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const profilePath = useMemo(() => `/perfil/${user?.username ?? 'me'}`, [user?.username])

  return (
    <header className="sticky top-0 z-50 isolate border-b border-border/70 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-10">
        <div className="flex items-center gap-2">
          {onSidebarToggle && (
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onSidebarToggle}
              aria-label={sidebarToggleLabel}
            >
              <PanelLeft className="h-5 w-5" />
            </Button>
          )}

          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <span className="text-sm font-bold">F</span>
            </div>
            <span className="text-lg font-semibold tracking-tight">
              Fin<span className="text-primary">Hub</span>
            </span>
          </Link>
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavItem key={item.to} item={item} currentPath={location.pathname} />
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ToggleTheme />
          {!isAuthenticated ? (
            <>
              <Button variant="ghost" asChild>
                <Link to="/login">Entrar</Link>
              </Button>
              <Button asChild>
                <Link to="/registar">Criar conta</Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link to="/dashboard">
                  <LayoutDashboard className="h-4 w-4" />
                  Painel
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to={profilePath}>
                  <User className="h-4 w-4" />
                  {user?.name ?? 'Conta'}
                </Link>
              </Button>
              <Button variant="ghost" onClick={logout}>
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-1 md:hidden">
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

      {mobileOpen && (
        <div className="border-t border-border/70 bg-background/95 md:hidden">
          <div className="mx-auto w-full max-w-[1600px] space-y-2 px-4 py-3 sm:px-6">
            <nav className="grid gap-1">
              {navItems.map((item) => (
                <NavItem key={item.to} item={item} currentPath={location.pathname} mobile />
              ))}
            </nav>
            <div className="grid gap-2 border-t border-border pt-3">
              {!isAuthenticated ? (
                <>
                  <Button variant="outline" asChild className="justify-start">
                    <Link to="/login">Entrar</Link>
                  </Button>
                  <Button asChild className="justify-start">
                    <Link to="/registar">Criar conta</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" asChild className="justify-start">
                    <Link to="/dashboard">
                      <LayoutDashboard className="h-4 w-4" />
                      Abrir painel
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="justify-start">
                    <Link to={profilePath}>
                      <User className="h-4 w-4" />
                      Ver perfil
                    </Link>
                  </Button>
                  <Button variant="ghost" className="justify-start" onClick={logout}>
                    <LogOut className="h-4 w-4" />
                    Terminar sessao
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
