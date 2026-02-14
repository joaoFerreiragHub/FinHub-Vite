// src/components/layout/SidebarLayout.tsx

import {
  Home,
  BookOpen,
  Calendar,
  Settings2,
  Newspaper,
  LogIn,
  UserPlus,
  Menu,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { cn } from '../../lib/utils'
import { ToggleTheme } from '../ui/toggle-theme'
import { RegisterDialog } from '../auth/RegisterDialog'
import { UserRole, useUserStore } from '../../stores/useUserStore'

import { getRoutesByRole } from '@/lib/routing/getRoutesByRole'
import { LoginDialog } from '../auth/loginDialog'

// 🔓 Rotas públicas (sempre visíveis)
const publicLinks = [
  { label: 'Home', icon: Home, path: '/' },
  { label: 'Educadores', icon: BookOpen, path: '/creators' },
  { label: 'Eventos', icon: Calendar, path: '/eventos' },
  { label: 'Glossário', icon: Settings2, path: '/glossario' },
  { label: 'Ferramentas', icon: Settings2, path: '/ferramentas' },
  { label: 'Notícias', icon: Newspaper, path: '/noticias' },
  { label: 'Conteúdos', icon: BookOpen, path: '/conteudos' },
  { label: 'Ações', icon: BookOpen, path: '/stocks' },
]

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [registerOpen, setRegisterOpen] = useState(false)
  const [currentPath, setCurrentPath] = useState<string>('')

  const { isAuthenticated, user, logout,hydrated  } = useUserStore()
  const privateLinks = isAuthenticated ? getRoutesByRole(user?.role || 'visitor') : []

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname)
    }
  }, [])

if (typeof window !== 'undefined' && !hydrated && user === null && !isAuthenticated) {
  // Força a marcar como hidratado se falhou
  console.log("⚠️ Forçando hidratação")
  useUserStore.setState({ hydrated: true })
}

    if (!hydrated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        <span className="ml-2 text-sm text-muted-foreground">A carregar...</span>
      </div>
    )
  }
const handleLogin = async (email: string, password: string) => {
  console.log('Login com', email, password)

  const mockUser = {
    id: "123",
    name: "Sérgio Criador",
    email: "sergio@finhub.pt",
    role: "creator" as UserRole,
    avatar: "/avatars/criador.jpg",
    accessToken: "mock-token-123",
    username: "sergiocriador",
  }

  // Atualiza user + autenticação + hidratação
  useUserStore.setState({ user: mockUser, isAuthenticated: true, hydrated: true })
  setLoginOpen(false)
}


  return (
    <div className="flex min-h-screen">
      <aside
        className={cn(
          'bg-card text-card-foreground shadow-md transition-all duration-300 flex flex-col justify-between',
          collapsed ? 'w-16' : 'w-64',
        )}
      >
        {/* TOPO - Branding + Toggle Sidebar */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          {!collapsed && <span className="font-bold text-xl">FinHub</span>}
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto"
          >
            <Menu className="w-5 h-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </div>

        {/* Alternância de tema */}
        <div className="flex items-center justify-start px-4 py-3">
          <ToggleTheme />
        </div>

        {/* Ações rápidas */}
        <div className="px-2 py-4 border-b border-border">
          {!isAuthenticated ? (
            <>
              <Button
                variant="default"
                className="w-full justify-start mb-2"
                onClick={() => setRegisterOpen(true)}
              >
                <UserPlus className="w-5 h-5 mr-2" />
                {!collapsed && 'Criar Conta'}
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setLoginOpen(true)}
              >
                <LogIn className="w-5 h-5 mr-2" />
                {!collapsed && 'Login'}
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => logout()}
            >
              <LogIn className="w-5 h-5 mr-2 rotate-180" />
              {!collapsed && 'Sair'}
            </Button>
          )}
        </div>

        {/* Menu principal */}
        <nav className="flex flex-col gap-1 p-2 flex-grow">
          {/* Rotas públicas */}
          {publicLinks.map(({ label, icon: Icon, path }) => (
            <a key={label} href={path} className="w-full">
              <Button
                variant="ghost"
                className={cn("justify-start w-full", currentPath === path && "bg-muted text-primary")}
              >
                <Icon className="w-5 h-5 mr-2" />
                {!collapsed && label}
              </Button>
            </a>
          ))}

          {/* Separador visual e Rotas privadas */}
          {isAuthenticated && (
            <>
              <div className="border-t border-border my-3" />
              {!collapsed && (
                <span className="text-xs text-muted-foreground px-2 mb-1">Tua Área</span>
              )}

              {privateLinks.map(({ label, icon: Icon, path }) => (
                <a key={label} href={path} className="w-full">
                  <Button
                    variant="ghost"
                    className={cn("justify-start w-full", currentPath === path && "bg-muted text-primary")}
                  >
                    <Icon className="w-5 h-5 mr-2" />
                    {!collapsed && label}
                  </Button>
                </a>
              ))}
            </>
          )}
        </nav>
      </aside>

      <main className="flex-1 bg-background text-foreground p-6">{children}</main>

      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} onLogin={handleLogin} />
      {typeof window !== 'undefined' && (
        <RegisterDialog
          open={registerOpen}
          onOpenChange={setRegisterOpen}
          onRegister={(data) => {
            console.log('Novo registo:', data)
          }}
        />
      )}
    </div>
  )
}
