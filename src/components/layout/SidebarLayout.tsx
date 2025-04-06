import {
  Home,
  BookOpen,
  Calendar,
  Settings2,
  Newspaper,
  LayoutDashboard,
  LogIn,
  UserPlus,
  Menu,
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '../ui/button'
import { cn } from '../../lib/utils'
import { ToggleTheme } from '../ui/toggle-theme' // usamos o principal agora

const links = [
  { label: 'Home', icon: Home, path: '/' },
  { label: 'Educadores', icon: BookOpen, path: '/educadores' },
  { label: 'Eventos', icon: Calendar, path: '/eventos' },
  { label: 'Glossário', icon: Settings2, path: '/glossario' },
  { label: 'Ferramentas', icon: Settings2, path: '/ferramentas' },
  { label: 'Notícias', icon: Newspaper, path: '/noticias' },
  { label: 'Conteúdos', icon: BookOpen, path: '/conteudos' },
]

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const isLoggedIn = false // substituir pelo teu estado de autenticação

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
        {/* BASE - Alternância de tema */}
        <div className="flex items-center justify-start px-4 py-3">
          <ToggleTheme />
        </div>

        {/* TOPO - Ações rápidas (login e criar conta) */}
        {/* AÇÕES: Criar Conta / Login */}
        <div className="px-2 py-4 border-b border-border">
          <Button
            variant="default"
            className="w-full justify-start mb-2"
            onClick={() => console.log('Criar Conta')}
          >
            <UserPlus className="w-5 h-5 mr-2" />
            {!collapsed && 'Criar Conta'}
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => console.log('Login')}
          >
            <LogIn className="w-5 h-5 mr-2" />
            {!collapsed && 'Login'}
          </Button>
        </div>

        {/* MENU PRINCIPAL */}
        <nav className="flex flex-col gap-1 p-2 flex-grow">
          {isLoggedIn && (
            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => console.log('Dashboard')}
            >
              <LayoutDashboard className="w-5 h-5 mr-2" />
              {!collapsed && 'Dashboard'}
            </Button>
          )}

          {links.map(({ label, icon: Icon, path }) => (
            <Button
              key={label}
              variant="ghost"
              className="justify-start"
              onClick={() => console.log(`Go to ${path}`)}
              // Podes usar navigate(path) aqui se estiveres com react-router
            >
              <Icon className="w-5 h-5 mr-2" />
              {!collapsed && label}
            </Button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 bg-background text-foreground p-6">{children}</main>
    </div>
  )
}
