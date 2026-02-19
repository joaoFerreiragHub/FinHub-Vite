import { Card, CardContent, Button, Badge } from '@/components/ui'
import {
  StockDetails,
  StockPeers,
  StocksSearchBar,
  useStockSearch,
  useWatchlist,
} from '@/features/tools/stocks/components'
import { MarketsNav } from '@/features/markets/components/MarketsNav'

export default function MarketStocksPage() {
  const { ticker, setTicker, searchStock, data, loading, error } = useStockSearch()
  const { watchlist, isInWatchlist, toggle } = useWatchlist()

  return (
    <div className="px-4 pb-10 pt-6 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="rounded-2xl border border-border bg-card/70 p-5 sm:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Analise de Acoes</h1>
              <p className="text-sm text-muted-foreground">
                Pesquisa por ticker e consulta os indicadores principais para estudo.
              </p>
            </div>
            <Badge variant="outline">Migrado para Mercados</Badge>
          </div>
          <MarketsNav />
        </section>

        <Card className="border border-border/60 bg-card/75">
          <CardContent className="space-y-4 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <StocksSearchBar
                value={ticker}
                onChange={(event) => setTicker(event.target.value)}
                onSearch={searchStock}
              />
              <Button asChild variant="ghost">
                <a href="/mercados/watchlist">Abrir watchlist</a>
              </Button>
            </div>
            {loading && <p className="text-sm text-muted-foreground">A carregar...</p>}
            {error && <p className="text-sm text-red-500">{error}</p>}
          </CardContent>
        </Card>

        {data && (
          <>
            <Card className="border border-border/60 bg-card/75">
              <CardContent className="space-y-4 p-6">
                <StockDetails
                  stockData={data}
                  isInWatchlist={isInWatchlist(data.symbol)}
                  onToggleWatchlist={() => toggle(data.symbol)}
                />
              </CardContent>
            </Card>

            <Card className="border border-border/60 bg-card/75">
              <CardContent className="p-6">
                <h2 className="mb-2 text-lg font-semibold text-foreground">Acoes relacionadas</h2>
                <StockPeers peers={data.peers} onPeerClick={(symbol) => setTicker(symbol)} />
              </CardContent>
            </Card>
          </>
        )}

        {!data && !loading && !error && (
          <Card className="border border-dashed border-border bg-card/50">
            <CardContent className="space-y-3 p-6">
              <h2 className="text-lg font-semibold">Watchlist rapida</h2>
              <p className="text-sm text-muted-foreground">
                Enquanto a watchlist persistida e migrada, ja podes usar a lista local da sessao.
              </p>
              <div className="flex flex-wrap gap-2">
                {watchlist.length > 0 ? (
                  watchlist.map((symbol) => (
                    <Badge
                      key={symbol}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => setTicker(symbol)}
                    >
                      {symbol}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Sem tickers na watchlist local.
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
