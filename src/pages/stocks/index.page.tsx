import { useStockSearch, useWatchlist } from '@/features/tools/stocks/components'
import { StockPeers, StocksSearchBar, StockDetails } from '@/features/tools/stocks/components'
import { HomepageLayout } from '@/components/home/HomepageLayout'
import { PageHero } from '@/components/public'
import { Card, CardContent } from '@/components/ui'
import { MarketSubNav } from '@/pages/mercados/_components/MarketSubNav'

export function Page() {
  const { ticker, setTicker, searchStock, data, loading, error } = useStockSearch()
  const { isInWatchlist, toggle } = useWatchlist()

  return (
    <HomepageLayout>
      <div className="min-h-screen bg-background">
        <PageHero
          title="Analise de Acoes"
          subtitle="Pesquisa por ticker e consulta os principais indicadores para estudar cada ativo."
          compact
          backgroundImage="https://images.unsplash.com/photo-1549421263-6f6b89f7e42c?w=1800&q=80"
        />

        <section className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 md:px-10 lg:px-12">
          <MarketSubNav current="/mercados/acoes" />

          <StocksSearchBar
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            onSearch={searchStock}
          />

          {loading && <p className="text-sm text-muted-foreground">A carregar...</p>}
          {error && <p className="text-sm text-red-500">{error}</p>}

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
        </section>
      </div>
    </HomepageLayout>
  )
}

export default { Page }
