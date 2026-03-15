import { NavLink } from 'react-router-dom'
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

export function FireToolNav() {
  return (
    <nav className="flex flex-wrap gap-2">
      {FIRE_NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            cn(
              'inline-flex h-9 items-center rounded-full border px-4 text-sm transition-colors',
              isActive
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground',
            )
          }
          end={item.to === item.match}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}
