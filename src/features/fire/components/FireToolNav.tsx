import { NavLink, useInRouterContext } from 'react-router-dom'
import { cn } from '@/lib/utils'

const FIRE_NAV_ITEMS = [
  {
    label: 'Visao geral',
    to: '/ferramentas/fire',
    match: '/ferramentas/fire',
  },
  {
    label: 'Portfolio',
    to: '/ferramentas/fire/portfolio',
    match: '/ferramentas/fire/portfolio',
  },
  {
    label: 'Simulador',
    to: '/ferramentas/fire/simulador',
    match: '/ferramentas/fire/simulador',
  },
  {
    label: 'Dashboard',
    to: '/ferramentas/fire/dashboard',
    match: '/ferramentas/fire/dashboard',
  },
]

function normalizePath(path: string) {
  if (path.length > 1 && path.endsWith('/')) {
    return path.slice(0, -1)
  }
  return path
}

export function FireToolNav() {
  const hasRouterContext = useInRouterContext()
  const currentPath = typeof window === 'undefined' ? '' : normalizePath(window.location.pathname)

  return (
    <nav className="flex flex-wrap gap-2">
      {FIRE_NAV_ITEMS.map((item) => {
        const inactiveClass =
          'border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground'
        const activeClass = 'border-primary bg-primary/10 text-primary'

        if (hasRouterContext) {
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'inline-flex h-9 items-center rounded-full border px-4 text-sm transition-colors',
                  isActive ? activeClass : inactiveClass,
                )
              }
              end={item.to === item.match}
            >
              {item.label}
            </NavLink>
          )
        }

        const isActive = currentPath === normalizePath(item.match)

        return (
          <a
            key={item.to}
            href={item.to}
            className={cn(
              'inline-flex h-9 items-center rounded-full border px-4 text-sm transition-colors',
              isActive ? activeClass : inactiveClass,
            )}
          >
            {item.label}
          </a>
        )
      })}
    </nav>
  )
}
