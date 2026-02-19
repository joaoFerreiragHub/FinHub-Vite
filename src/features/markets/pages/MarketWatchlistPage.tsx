import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { AlertCircle, BookmarkPlus, ListPlus, Trash2 } from 'lucide-react'
import { Badge, Card, CardContent } from '@/components/ui'
import { MarketsNav } from '@/features/markets/components/MarketsNav'
import {
  fetchWatchlistTickerSnapshot,
  type WatchlistTickerSnapshot,
} from '@/features/markets/services/marketToolsApi'
import { useWatchlist } from '@/features/tools/stocks/components'

function formatMoney(value?: number) {
  if (typeof value !== 'number' || Number.isNaN(value)) return 'N/A'
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value)
}

function formatMarketCap(value?: number) {
  if (typeof value !== 'number' || Number.isNaN(value)) return 'N/A'
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(value)
}

export default function MarketWatchlistPage() {
  const { watchlist, remove } = useWatchlist()

  const normalizedList = useMemo(
    () => [...new Set(watchlist.map((item) => item.toUpperCase()))],
    [watchlist],
  )

  return (
    <div className="px-4 pb-10 pt-6 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="rounded-2xl border border-border/60 bg-card/70 p-5 backdrop-blur-sm sm:p-6">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <BookmarkPlus className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Watchlist</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Acompanha os teus tickers favoritos num so lugar.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="inline-flex items-center gap-2 border-amber-500/40 bg-amber-500/10 text-amber-400"
              >
                <ListPlus className="h-3.5 w-3.5" />
                Local session
              </Badge>
              <Badge variant="secondary">{normalizedList.length} observados</Badge>
            </div>
          </div>
          <MarketsNav />
        </section>

        <Card className="border border-border/60 bg-card/75 backdrop-blur-sm">
          <CardContent className="p-5 sm:p-6">
            <div className="mb-5">
              <h2 className="text-lg font-semibold">Tickers observados</h2>
              <p className="text-xs text-muted-foreground">
                A adicao de tickers e feita na pagina de Acoes atraves da estrela.
              </p>
            </div>

            {normalizedList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted/50">
                  <BookmarkPlus className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">Watchlist vazia</h3>
                <p className="mb-4 max-w-sm text-sm text-muted-foreground">
                  Pesquisa um ticker em{' '}
                  <a href="/mercados/acoes" className="text-primary underline hover:no-underline">
                    Analise de Acoes
                  </a>{' '}
                  e usa a estrela para adicionares aqui.
                </p>
              </div>
            ) : (
              <>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {normalizedList.map((symbol) => (
                    <WatchlistCard key={symbol} symbol={symbol} onRemove={() => remove(symbol)} />
                  ))}
                </div>

                <div className="mt-5 rounded-lg border border-border/40 bg-background/50 p-3 text-xs text-muted-foreground">
                  <p>
                    Dados da watchlist carregados via FMP atraves do endpoint de quick analysis.
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

interface WatchlistCardProps {
  symbol: string
  onRemove: () => void
}

function WatchlistCard({ symbol, onRemove }: WatchlistCardProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['markets', 'watchlist-snapshot', symbol],
    queryFn: () => fetchWatchlistTickerSnapshot(symbol),
    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000,
    retry: 1,
  })

  const snapshot: WatchlistTickerSnapshot = data ?? {
    symbol,
    name: symbol,
  }

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border/60 bg-card/60 p-4 backdrop-blur-sm transition-all duration-200 hover:border-primary/40 hover:bg-card/80 hover:shadow-lg">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-2">
            {snapshot.image ? (
              <img
                src={snapshot.image}
                alt={`Logo ${symbol}`}
                className="h-8 w-8 rounded-full border border-border/70 bg-background object-cover"
                loading="lazy"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border/70 bg-muted text-xs font-semibold text-muted-foreground">
                {symbol.slice(0, 1)}
              </div>
            )}
            <h3 className="truncate text-lg font-bold text-foreground">{symbol}</h3>
          </div>
          <p className="truncate text-xs text-muted-foreground">
            {isLoading ? 'A carregar dados...' : snapshot.name}
          </p>
        </div>

        <button
          type="button"
          onClick={onRemove}
          className="rounded-lg p-1.5 text-muted-foreground opacity-0 transition-all hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
          aria-label={`Remover ${symbol}`}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <div className="h-6 w-24 animate-pulse rounded bg-muted/30" />
          <div className="h-4 w-32 animate-pulse rounded bg-muted/30" />
          <div className="h-4 w-20 animate-pulse rounded bg-muted/30" />
        </div>
      ) : isError ? (
        <div className="rounded-md border border-red-500/40 bg-red-500/10 p-2 text-xs text-red-300">
          <div className="mb-1 flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>Nao foi possivel carregar este ticker.</span>
          </div>
          <p>Confirma se o ticker existe na API.</p>
        </div>
      ) : (
        <div className="space-y-1">
          <p className="text-2xl font-bold text-foreground">{formatMoney(snapshot.price)}</p>
          <p className="text-xs text-muted-foreground">
            Market Cap: {formatMarketCap(snapshot.marketCap)}
          </p>
          <p className="text-xs text-muted-foreground">Setor: {snapshot.sector || 'N/A'}</p>
        </div>
      )}

      <a
        href={`/mercados/acoes?ticker=${symbol}`}
        className="mt-3 inline-flex items-center gap-1 text-xs text-primary opacity-0 transition-opacity hover:underline group-hover:opacity-100"
      >
        Ver analise completa -&gt;
      </a>
    </div>
  )
}
