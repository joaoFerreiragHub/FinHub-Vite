import { cn } from '@/lib/utils'

type MarketNavItem = {
  href: string
  label: string
}

const MARKET_NAV_ITEMS: MarketNavItem[] = [
  { href: '/mercados', label: 'Hub' },
  { href: '/mercados/acoes', label: 'Acoes' },
  { href: '/mercados/etfs', label: 'ETFs' },
  { href: '/mercados/reits', label: 'REITs' },
  { href: '/mercados/cripto', label: 'Cripto' },
  { href: '/mercados/watchlist', label: 'Watchlist' },
  { href: '/mercados/noticias', label: 'Noticias' },
  { href: '/mercados/recursos', label: 'Recursos' },
]

interface MarketSubNavProps {
  current: string
}

export function MarketSubNav({ current }: MarketSubNavProps) {
  return (
    <nav
      aria-label="Navegacao da area de mercados"
      className="flex flex-wrap items-center gap-2 rounded-xl border border-border/60 bg-card/70 p-2"
    >
      {MARKET_NAV_ITEMS.map((item) => {
        const isActive = current === item.href
        return (
          <a
            key={item.href}
            href={item.href}
            className={cn(
              'rounded-lg px-3 py-1.5 text-sm transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            {item.label}
          </a>
        )
      })}
    </nav>
  )
}
