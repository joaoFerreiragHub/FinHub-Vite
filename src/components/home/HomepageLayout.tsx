import { useState, useEffect, useCallback } from 'react'
import {
  Home,
  BookOpen,
  FolderKanban,
  Newspaper,
  TrendingUp,
  Wrench,
  Menu,
  X,
  LogIn,
  UserPlus,
} from 'lucide-react'
import { Button } from '@/components/ui'
import { ToggleTheme } from '@/components/ui'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { LoginDialog, RegisterDialog } from '@/features/auth/components/forms'

type NavLink = {
  label: string
  icon: React.ComponentType<{ className?: string }>
  path: string
  matchPaths?: string[]
}

const navLinks = [
  { label: 'Home', icon: Home, path: '/' },
  { label: 'Educadores', icon: BookOpen, path: '/creators' },
  { label: 'Conteudos', icon: FolderKanban, path: '/hub/conteudos' },
  { label: 'Noticias', icon: Newspaper, path: '/noticias' },
  {
    label: 'Mercados',
    icon: TrendingUp,
    path: '/mercados',
    matchPaths: ['/mercados', '/stocks', '/recursos'],
  },
  { label: 'Ferramentas', icon: Wrench, path: '/ferramentas', matchPaths: ['/ferramentas'] },
] as NavLink[]

function isNavActive(currentPath: string, navLink: NavLink) {
  const patterns = navLink.matchPaths ?? [navLink.path]

  if (patterns.includes('/')) {
    return currentPath === '/'
  }

  return patterns.some(
    (pathPattern) => currentPath === pathPattern || currentPath.startsWith(`${pathPattern}/`),
  )
}

interface HomepageLayoutProps {
  children: React.ReactNode
}

export function HomepageLayout({ children }: HomepageLayoutProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [registerOpen, setRegisterOpen] = useState(false)

  const { isAuthenticated, user, logout } = useAuthStore()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogin = useCallback(async (email: string, password: string) => {
    // Mock login - will be replaced with API
    const { UserRole } = await import('@/features/auth/types')
    void password
    const mockUser = {
      id: '123',
      name: 'Sergio Criador',
      lastName: 'Criador',
      email,
      role: UserRole.CREATOR,
      avatar: '/avatars/criador.jpg',
      username: 'sergiocriador',
      bio: 'Criador de conteudo',
      isEmailVerified: true,
      favoriteTopics: ['investimentos', 'financas'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    useAuthStore.getState().setUser(mockUser, 'mock-token', 'mock-refresh')
    setLoginOpen(false)
  }, [])

  const handleRegister = useCallback(
    (data: { name: string; email: string; password: string; confirmPassword: string }) => {
      void data
      setRegisterOpen(false)
    },
    [],
  )

  const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ─── GLASSMORPHISM HEADER ─── */}
      <header className={`glass-header ${scrolled ? 'glass-header--scrolled' : ''}`}>
        <div className="flex items-center justify-between h-14 sm:h-16 px-4 sm:px-6 md:px-10 lg:px-12 max-w-[1920px] mx-auto">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Fin<span className="text-primary">Hub</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((navLink) => (
              <a
                key={navLink.path}
                href={navLink.path}
                className={`px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isNavActive(currentPath, navLink)
                    ? 'text-foreground bg-accent/60'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/40'
                }`}
              >
                {navLink.label}
              </a>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ToggleTheme />

            {!isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLoginOpen(true)}
                  className="text-sm"
                >
                  <LogIn className="h-4 w-4 mr-1.5" />
                  Login
                </Button>
                <Button size="sm" onClick={() => setRegisterOpen(true)} className="text-sm">
                  <UserPlus className="h-4 w-4 mr-1.5" />
                  Registar
                </Button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <a
                  href="/perfil"
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-accent/40"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-7 w-7 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                      {user?.name?.charAt(0) ?? 'U'}
                    </div>
                  )}
                  <span className="text-sm text-foreground hidden lg:inline">{user?.name}</span>
                </a>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => logout()}
                  className="text-sm text-muted-foreground"
                >
                  Sair
                </Button>
              </div>
            )}

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/30 bg-background/95 backdrop-blur-lg">
            <nav className="flex flex-col p-4 gap-1">
              {navLinks.map((navLink) => {
                const Icon = navLink.icon
                return (
                  <a
                    key={navLink.path}
                    href={navLink.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isNavActive(currentPath, navLink)
                        ? 'text-foreground bg-accent'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {navLink.label}
                  </a>
                )
              })}
              <div className="border-t border-border/30 mt-2 pt-2 flex flex-col gap-1">
                {!isAuthenticated ? (
                  <>
                    <Button
                      variant="ghost"
                      className="justify-start"
                      onClick={() => {
                        setLoginOpen(true)
                        setMobileMenuOpen(false)
                      }}
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      Login
                    </Button>
                    <Button
                      className="justify-start"
                      onClick={() => {
                        setRegisterOpen(true)
                        setMobileMenuOpen(false)
                      }}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Criar Conta
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="ghost"
                    className="justify-start text-muted-foreground"
                    onClick={() => logout()}
                  >
                    Sair
                  </Button>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <main>{children}</main>

      {/* ─── FOOTER ─── */}
      <footer className="home-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-12 py-10 sm:py-12">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
            <div className="col-span-2 sm:col-span-1">
              <span className="text-lg font-bold text-foreground">
                Fin<span className="text-primary">Hub</span>
              </span>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                A plataforma #1 de literacia financeira em Portugal.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Explorar</h4>
              <div className="flex flex-col gap-2">
                <a
                  href="/creators"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Criadores
                </a>
                <a
                  href="/hub/courses"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cursos
                </a>
                <a
                  href="/hub/conteudos"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Conteudos
                </a>
                <a
                  href="/hub/books"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Livros
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Recursos</h4>
              <div className="flex flex-col gap-2">
                <a
                  href="/corretoras"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Corretoras
                </a>
                <a
                  href="/noticias"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Noticias
                </a>
                <a
                  href="/ferramentas"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Ferramentas
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Sobre</h4>
              <div className="flex flex-col gap-2">
                <a
                  href="/sobre"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Quem somos
                </a>
                <a
                  href="/contacto"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contacto
                </a>
                <a
                  href="/termos"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Termos
                </a>
                <a
                  href="/privacidade"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacidade
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-border/30 mt-8 pt-6 text-center">
            <p className="text-xs text-muted-foreground">
              &copy; 2026 FinHub. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* Dialogs */}
      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} onLogin={handleLogin} />
      <RegisterDialog
        open={registerOpen}
        onOpenChange={setRegisterOpen}
        onRegister={handleRegister}
      />
    </div>
  )
}
