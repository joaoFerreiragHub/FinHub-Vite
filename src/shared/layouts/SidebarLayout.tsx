import { Home, BookOpen, Newspaper, TrendingUp, LogIn, UserPlus, Menu } from 'lucide-react'
import { useEffect, useState, useCallback } from 'react'
import { Button, ToggleTheme } from '@/components/ui'
import { cn } from '@/lib/utils'
import { LoginDialog, RegisterDialog } from '@/features/auth/components/forms'
import { UserRole } from '@/features/auth/types'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { getRoutesByRole } from '@/lib/routing/getRoutesByRole'

const publicLinks = [
  { label: 'Home', icon: Home, path: '/' },
  { label: 'Educadores', icon: BookOpen, path: '/creators' },
  { label: 'Noticias', icon: Newspaper, path: '/noticias' },
  { label: 'Acoes', icon: TrendingUp, path: '/stocks' },
]

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  console.log('🏗️ [SIDEBAR] Renderizando SidebarLayout')

  const [collapsed, setCollapsed] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [registerOpen, setRegisterOpen] = useState(false)

  const { isAuthenticated, user, logout, hydrated } = useAuthStore()

  console.log('🔐 [SIDEBAR] Auth state:', {
    isAuthenticated,
    username: user?.username,
    role: user?.role,
    hydrated,
  })

  const privateLinks = isAuthenticated ? getRoutesByRole(user?.role || 'visitor') : []
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''
  const isPathActive = (path: string) =>
    currentPath === path || (path !== '/' && currentPath.startsWith(`${path}/`))

  // Force hydration after mount if not already hydrated
  useEffect(() => {
    if (typeof window !== 'undefined' && !hydrated) {
      const timer = setTimeout(() => {
        console.warn('⚠️ [SIDEBAR] Forcing hydration after timeout')
        useAuthStore.getState().setHydrated(true)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [hydrated])

  const handleLogin = useCallback(async (email: string, password: string) => {
    console.log('Login com', email, password)

    const mockUser = {
      id: '123',
      name: 'Sergio Criador',
      lastName: 'Criador',
      email: 'sergio@finhub.pt',
      role: 'creator' as UserRole,
      avatar: '/avatars/criador.jpg',
      username: 'sergiocriador',
      bio: 'Criador de conteudo',
      isEmailVerified: true,
      favoriteTopics: ['investimentos', 'financas'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const mockTokens = {
      accessToken: 'mock-token-123',
      refreshToken: 'mock-refresh-token-456',
    }

    useAuthStore.getState().setUser(mockUser, mockTokens.accessToken, mockTokens.refreshToken)
    setLoginOpen(false)
  }, [])

  const handleRegister = useCallback(
    (data: { name: string; email: string; password: string; confirmPassword: string }) => {
      console.log('Novo registo:', data)
      setRegisterOpen(false)
    },
    [],
  )

  // TEMPORARILY DISABLED: hydration check causing infinite loading
  // Will be re-enabled once hydration is guaranteed to work
  // if (!hydrated) {
  //   return (
  //     <div className="flex h-screen items-center justify-center">
  //       <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
  //       <span className="ml-2 text-sm text-muted-foreground">A carregar...</span>
  //     </div>
  //   )
  // }

  return (
    <div className="flex min-h-screen">
      <aside
        className={cn(
          'bg-card text-card-foreground shadow-md transition-all duration-300 flex flex-col justify-between',
          collapsed ? 'w-16' : 'w-64',
        )}
      >
        <div className="flex items-center justify-between border-b border-border p-4">
          {!collapsed && <span className="text-xl font-bold">FinHub</span>}
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </div>

        <div className="flex items-center justify-start px-4 py-3">
          <ToggleTheme />
        </div>

        <div className="border-b border-border px-2 py-4">
          {!isAuthenticated ? (
            <>
              <Button
                variant="default"
                className="mb-2 w-full justify-start"
                onClick={() => setRegisterOpen(true)}
              >
                <UserPlus className="mr-2 h-5 w-5" />
                {!collapsed && 'Criar Conta'}
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setLoginOpen(true)}
              >
                <LogIn className="mr-2 h-5 w-5" />
                {!collapsed && 'Login'}
              </Button>
            </>
          ) : (
            <Button variant="outline" className="w-full justify-start" onClick={() => logout()}>
              <LogIn className="mr-2 h-5 w-5 rotate-180" />
              {!collapsed && 'Sair'}
            </Button>
          )}
        </div>

        <nav className="flex flex-grow flex-col gap-1 p-2">
          {publicLinks.map(({ label, icon: Icon, path }) => (
            <a key={label} href={path} className="w-full">
              <Button
                variant="ghost"
                className={cn(
                  'w-full justify-start',
                  isPathActive(path) && 'bg-muted text-primary',
                )}
              >
                <Icon className="mr-2 h-5 w-5" />
                {!collapsed && label}
              </Button>
            </a>
          ))}

          {isAuthenticated && privateLinks.length > 0 && (
            <>
              <div className="my-3 border-t border-border" />
              {!collapsed && (
                <span className="mb-1 px-2 text-xs text-muted-foreground">Tua Area</span>
              )}
              {privateLinks.map(({ label, icon: Icon, path }) => (
                <a key={label} href={path} className="w-full">
                  <Button
                    variant="ghost"
                    className={cn(
                      'w-full justify-start',
                      isPathActive(path) && 'bg-muted text-primary',
                    )}
                  >
                    <Icon className="mr-2 h-5 w-5" />
                    {!collapsed && label}
                  </Button>
                </a>
              ))}
            </>
          )}
        </nav>
      </aside>

      <main className="flex-1 bg-background p-6 text-foreground">{children}</main>

      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} onLogin={handleLogin} />
      <RegisterDialog
        open={registerOpen}
        onOpenChange={setRegisterOpen}
        onRegister={handleRegister}
      />
    </div>
  )
}
