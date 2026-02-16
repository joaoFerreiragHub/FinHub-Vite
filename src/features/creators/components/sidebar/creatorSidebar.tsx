import { useCallback, useEffect, useMemo, useState, type ComponentType } from 'react'
import { Bell, ChevronDown, ChevronUp, ExternalLink, Heart, Rss, User, Users } from 'lucide-react'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { Button, Progress } from '@/components/ui'
import { cn } from '@/lib/utils'
import { creatorDashboardRouts } from '@/routes/creatorDashboardRouts'

type SidebarChild = {
  path: string
  label: string
}

type SidebarItem = {
  label: string
  icon: ComponentType<{ className?: string }>
  path?: string
  children?: SidebarChild[]
}

const baseSocialRoutes: SidebarItem[] = [
  { label: 'Perfil', path: '/perfil', icon: User },
  { label: 'Feed', path: '/feed', icon: Rss },
  { label: 'Favoritos', path: '/favoritos', icon: Heart },
  { label: 'A Seguir', path: '/seguindo', icon: Users },
  { label: 'Notificacoes', path: '/notificacoes', icon: Bell },
]

const toSidebarItem = (route: (typeof creatorDashboardRouts)[number]): SidebarItem => ({
  label: route.label,
  icon: route.icon,
  path: route.path,
  children: route.children,
})

export default function CreatorSidebar() {
  const { user } = useAuthStore()
  const [currentPath, setCurrentPath] = useState<string>('')
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])

  const painelRoute = creatorDashboardRouts.find((route) => route.path === '/creators/dashboard')
  const progressoRoute = creatorDashboardRouts.find((route) => route.path === '/creators/progresso')
  const gerirConteudosRoute = creatorDashboardRouts.find((route) => route.children?.length)
  const analyticsRoute = creatorDashboardRouts.find(
    (route) => route.path === '/creators/estatisticas',
  )
  const marketingRoute = creatorDashboardRouts.find((route) => route.path === '/creators/anuncios')
  const settingsRoute = creatorDashboardRouts.find((route) => route.path === '/creators/definicoes')
  const creatorPublicPath = user?.username
    ? `/creators/${encodeURIComponent(user.username)}`
    : '/creators'

  const socialRoutes: SidebarItem[] = useMemo(
    () => [
      { label: 'Pagina do Criador', path: creatorPublicPath, icon: ExternalLink },
      ...baseSocialRoutes,
    ],
    [creatorPublicPath],
  )

  const contentHubRoutes: SidebarItem[] = useMemo(
    () =>
      [painelRoute, progressoRoute, gerirConteudosRoute]
        .filter(Boolean)
        .map((route) => toSidebarItem(route!)),
    [painelRoute, progressoRoute, gerirConteudosRoute],
  )
  const analyticsRoutes: SidebarItem[] = useMemo(
    () => [analyticsRoute].filter(Boolean).map((route) => toSidebarItem(route!)),
    [analyticsRoute],
  )
  const marketingRoutes: SidebarItem[] = useMemo(
    () => [marketingRoute].filter(Boolean).map((route) => toSidebarItem(route!)),
    [marketingRoute],
  )
  const settingsRoutes: SidebarItem[] = useMemo(
    () => [settingsRoute].filter(Boolean).map((route) => toSidebarItem(route!)),
    [settingsRoute],
  )

  const allRoutes: SidebarItem[] = useMemo(
    () => [
      ...contentHubRoutes,
      ...socialRoutes,
      ...analyticsRoutes,
      ...marketingRoutes,
      ...settingsRoutes,
    ],
    [contentHubRoutes, socialRoutes, analyticsRoutes, marketingRoutes, settingsRoutes],
  )

  const isPathActive = useCallback(
    (path: string) => currentPath === path || (path !== '/' && currentPath.startsWith(`${path}/`)),
    [currentPath],
  )
  const isActiveGroup = useCallback(
    (children: SidebarChild[]) => children.some((child) => isPathActive(child.path)),
    [isPathActive],
  )

  const toggleMenu = (label: string, children?: SidebarChild[]) => {
    const hasActiveChild = children ? isActiveGroup(children) : false
    setExpandedMenus((prev) => {
      if (hasActiveChild) return [...new Set([...prev, label])]
      return prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    })
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname)
    }
  }, [])

  useEffect(() => {
    allRoutes.forEach((route) => {
      if (route.children && isActiveGroup(route.children)) {
        setExpandedMenus((prev) => [...new Set([...prev, route.label])])
      }
    })
  }, [allRoutes, currentPath, isActiveGroup])

  const renderNavItem = (item: SidebarItem) => {
    const Icon = item.icon

    if (item.path) {
      return (
        <a key={item.label} href={item.path} className="w-full">
          <Button
            variant="ghost"
            className={cn(
              'w-full justify-start',
              isPathActive(item.path) && 'bg-muted text-primary',
            )}
          >
            <Icon className="mr-2 h-5 w-5" />
            {item.label}
          </Button>
        </a>
      )
    }

    return (
      <div key={item.label}>
        <Button
          variant="ghost"
          className="flex w-full items-center justify-start"
          onClick={() => toggleMenu(item.label, item.children)}
        >
          <Icon className="mr-2 h-5 w-5" />
          {item.label}
          {expandedMenus.includes(item.label) ? (
            <ChevronUp className="ml-auto h-4 w-4" />
          ) : (
            <ChevronDown className="ml-auto h-4 w-4" />
          )}
        </Button>
        {expandedMenus.includes(item.label) && item.children && (
          <div className="ml-6 flex flex-col gap-1">
            {item.children.map((child) => (
              <a key={child.label} href={child.path}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'w-full justify-start text-sm',
                    isPathActive(child.path) && 'bg-muted text-primary',
                  )}
                >
                  {child.label}
                </Button>
              </a>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <aside className="flex min-h-screen w-64 flex-col justify-between bg-card p-4 text-card-foreground shadow-md">
      <div>
        <div className="mb-4 flex items-center gap-3">
          <img
            src={user?.avatar || '/placeholder-user.svg'}
            alt="Avatar do Criador"
            className="h-12 w-12 rounded-full border border-primary"
          />
          <div>
            <div className="font-semibold">{user?.username || 'Criador'}</div>
            <div className="text-xs text-muted-foreground">{user?.email}</div>
          </div>
        </div>

        <div className="mb-4">
          <div className="mb-1 text-xs font-medium">Nivel 3 - 120 XP</div>
          <Progress value={60} className="h-2" />
        </div>

        <nav className="flex flex-col gap-2">
          <span className="px-2 pt-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Conteudo para o Hub
          </span>
          {contentHubRoutes.map(renderNavItem)}

          <div className="my-2 border-t border-border" />
          <span className="px-2 pt-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Socials
          </span>
          {socialRoutes.map(renderNavItem)}

          <div className="my-2 border-t border-border" />
          <span className="px-2 pt-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Analytics
          </span>
          {analyticsRoutes.map(renderNavItem)}

          <div className="my-2 border-t border-border" />
          <span className="px-2 pt-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Marketing
          </span>
          {marketingRoutes.map(renderNavItem)}

          <div className="my-2 border-t border-border" />
          {settingsRoutes.map(renderNavItem)}
        </nav>
      </div>

      <div className="mt-6 border-t border-border pt-4 text-center text-xs text-muted-foreground">
        <span>FinHub © 2025</span>
      </div>
    </aside>
  )
}
