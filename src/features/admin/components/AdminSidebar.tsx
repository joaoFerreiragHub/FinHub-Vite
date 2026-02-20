import { Link, useLocation } from 'react-router-dom'
import {
  BarChart3,
  LayoutDashboard,
  ShieldCheck,
  Users,
  Layers,
  Shield,
  LifeBuoy,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface AdminSidebarProps {
  className?: string
  onNavigate?: () => void
}

const links = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true, soon: false },
  { path: '/admin/users', label: 'Utilizadores', icon: Users, exact: false, soon: false },
  { path: '/admin/conteudo', label: 'Moderacao', icon: ShieldCheck, exact: false, soon: false },
  { path: '/admin/suporte', label: 'Suporte', icon: LifeBuoy, exact: false, soon: false },
  { path: '/admin/recursos', label: 'Recursos', icon: Layers, exact: false, soon: true },
  { path: '/admin/stats', label: 'Estatisticas', icon: BarChart3, exact: false, soon: false },
]

export default function AdminSidebar({ className, onNavigate }: AdminSidebarProps) {
  const location = useLocation()

  return (
    <aside className={cn('h-full w-72 border-r border-border bg-card', className)}>
      <div className="border-b border-border px-4 py-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Shield className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-bold leading-none text-foreground">FinHub Admin</p>
            <p className="mt-0.5 text-xs text-muted-foreground">Painel de controlo</p>
          </div>
        </div>
      </div>

      <nav className="p-3">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
          Navegacao
        </p>
        <div className="space-y-0.5">
          {links.map((link) => {
            const isActive = link.exact
              ? location.pathname === link.path
              : location.pathname.startsWith(link.path)

            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={onNavigate}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground',
                )}
              >
                <link.icon
                  className={cn(
                    'h-4 w-4 shrink-0',
                    isActive ? 'text-primary' : 'text-muted-foreground',
                  )}
                />
                <span className="flex-1 truncate">{link.label}</span>
                {link.soon && (
                  <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                    Em breve
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      </nav>
    </aside>
  )
}
