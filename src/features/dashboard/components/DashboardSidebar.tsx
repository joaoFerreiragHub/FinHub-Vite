import { Link, useLocation } from '@/lib/reactRouterDomCompat'
import {
  BarChart3,
  Clapperboard,
  FolderKanban,
  LayoutDashboard,
  PenSquare,
  User,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface DashboardSidebarProps {
  className?: string
  onNavigate?: () => void
}

const links = [
  { path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { path: '/dashboard/conteudo/artigos', label: 'Artigos', icon: FolderKanban },
  { path: '/dashboard/conteudo/videos', label: 'Videos', icon: Clapperboard },
  { path: '/dashboard/criar', label: 'Criar artigo', icon: PenSquare },
  { path: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/dashboard/seguidores', label: 'Seguidores', icon: Users },
  { path: '/dashboard/perfil', label: 'Perfil', icon: User },
]

export default function DashboardSidebar({ className, onNavigate }: DashboardSidebarProps) {
  const location = useLocation()

  return (
    <aside className={cn('h-full w-72 border-r border-border bg-card', className)}>
      <nav className="space-y-1 p-4">
        {links.map((link) => {
          const isOverviewRoute = link.path === '/dashboard'
          const isActive = isOverviewRoute
            ? location.pathname === link.path
            : location.pathname.startsWith(link.path)
          return (
            <Link
              key={link.path}
              to={link.path}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-accent text-foreground'
                  : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground',
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
