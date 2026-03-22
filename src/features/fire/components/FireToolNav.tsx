import { cn } from '@/lib/utils'

const FIRE_NAV_ITEMS = [
  {
    label: 'Visao geral',
    href: '/ferramentas/fire',
  },
  {
    label: 'Portfolio',
    href: '/ferramentas/fire/portfolio',
  },
  {
    label: 'Simulador',
    href: '/ferramentas/fire/simulador',
  },
  {
    label: 'Dashboard',
    href: '/ferramentas/fire/dashboard',
  },
]

function normalizePath(path: string) {
  if (path.length > 1 && path.endsWith('/')) {
    return path.slice(0, -1)
  }
  return path
}

export function FireToolNav() {
  const currentPath = typeof window === 'undefined' ? '' : normalizePath(window.location.pathname)

  const inactiveClass =
    'border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground'
  const activeClass = 'border-primary bg-primary/10 text-primary'

  return (
    <nav className="flex flex-wrap gap-2">
      {FIRE_NAV_ITEMS.map((item) => {
        const isActive = currentPath === normalizePath(item.href)

        return (
          <a
            key={item.href}
            href={item.href}
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
