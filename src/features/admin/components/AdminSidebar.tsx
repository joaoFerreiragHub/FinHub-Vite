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
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { type AdminModuleKey, getAccessibleAdminModules } from '@/features/admin/lib/access'

interface AdminSidebarProps {
  className?: string
  onNavigate?: () => void
}

const links = [
  { key: 'dashboard' as AdminModuleKey, icon: LayoutDashboard, exact: true },
  { key: 'users' as AdminModuleKey, icon: Users, exact: false },
  { key: 'content' as AdminModuleKey, icon: ShieldCheck, exact: false },
  { key: 'support' as AdminModuleKey, icon: LifeBuoy, exact: false },
  { key: 'brands' as AdminModuleKey, icon: Layers, exact: false },
  { key: 'stats' as AdminModuleKey, icon: BarChart3, exact: false },
]

export default function AdminSidebar({ className, onNavigate }: AdminSidebarProps) {
  const location = useLocation()
  const user = useAuthStore((state) => state.user)

  const visibleLinks = getAccessibleAdminModules(user)
    .map((moduleConfig) => {
      const iconMeta = links.find((item) => item.key === moduleConfig.key)
      if (!iconMeta) return null
      return {
        path: moduleConfig.path,
        label: moduleConfig.label,
        icon: iconMeta.icon,
        exact: iconMeta.exact,
        operational: moduleConfig.operational,
      }
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))

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
            {user?.adminReadOnly ? (
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">
                Modo read-only
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <nav className="p-3">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
          Navegacao
        </p>
        <div className="space-y-0.5">
          {visibleLinks.map((link) => {
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
                {!link.operational && (
                  <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                    Em breve
                  </span>
                )}
              </Link>
            )
          })}
          {visibleLinks.length === 0 ? (
            <p className="rounded-md border border-dashed border-border/70 px-3 py-2 text-xs text-muted-foreground">
              Sem modulos visiveis para os escopos atuais.
            </p>
          ) : null}
        </div>
      </nav>
    </aside>
  )
}
