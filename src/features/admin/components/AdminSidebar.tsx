import { Link, useLocation } from 'react-router-dom'
import { BarChart3, LayoutDashboard, ShieldCheck, Users, Layers } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AdminSidebarProps {
  className?: string
  onNavigate?: () => void
}

const links = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/users', label: 'Utilizadores', icon: Users },
  { path: '/admin/conteudo', label: 'Moderacao', icon: ShieldCheck },
  { path: '/admin/recursos', label: 'Recursos', icon: Layers },
  { path: '/admin/stats', label: 'Estatisticas', icon: BarChart3 },
]

export default function AdminSidebar({ className, onNavigate }: AdminSidebarProps) {
  const location = useLocation()

  return (
    <aside className={cn('h-full w-72 border-r border-border bg-card', className)}>
      <nav className="space-y-1 p-4">
        {links.map((link) => {
          const isActive = location.pathname === link.path
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
