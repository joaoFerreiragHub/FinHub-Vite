import { Coins, LandPlot, ListPlus, TrendingUp, Waypoints } from 'lucide-react'
import { cn } from '@/lib/utils'

const MARKET_NAV_ITEMS = [
  { to: '/mercados/acoes', label: 'Acoes', icon: TrendingUp },
  { to: '/mercados/etfs', label: 'ETFs', icon: Waypoints },
  { to: '/mercados/reits', label: 'REITs', icon: LandPlot },
  { to: '/mercados/cripto', label: 'Cripto', icon: Coins },
  { to: '/mercados/watchlist', label: 'Watchlist', icon: ListPlus },
] as const

export function MarketsNav() {
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''

  return (
    <nav className="flex flex-wrap gap-2">
      {MARKET_NAV_ITEMS.map((item) => {
        const Icon = item.icon
        const isActive = currentPath === item.to

        return (
          <a
            key={item.to}
            href={item.to}
            className={cn(
              'inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm transition-colors',
              isActive
                ? 'border-primary/60 bg-primary/15 text-foreground'
                : 'border-border text-muted-foreground hover:border-primary/30 hover:bg-primary/10 hover:text-foreground',
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </a>
        )
      })}
    </nav>
  )
}
