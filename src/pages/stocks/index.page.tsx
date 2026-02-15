import { useStockSearch, useWatchlist } from '@/features/tools/stocks/components'
import { StockPeers, StocksSearchBar, StockDetails } from '@/features/tools/stocks/components'

import SidebarLayout from '@/shared/layouts/SidebarLayout'
import { Card, CardContent } from '@/components/ui'

export const Page = () => {
  const { ticker, setTicker, searchStock, data, loading, error } = useStockSearch()
  const { isInWatchlist, toggle } = useWatchlist()

  return (
    <SidebarLayout>
      <section className="max-w-6xl mx-auto px-4 py-10 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">🔎 Pesquisa de Ações</h1>
          <p className="text-muted-foreground mt-1">
            Pesquisa ações por ticker (ex: AAPL, MSFT) e analisa os principais indicadores.
          </p>
        </div>

        <StocksSearchBar
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          onSearch={searchStock}
        />

        {loading && <p className="text-sm text-muted-foreground">A carregar...</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}

        {data && (
          <>
            <Card>
              <CardContent className="p-6 space-y-4">
                <StockDetails
                  stockData={data}
                  isInWatchlist={isInWatchlist(data.symbol)}
                  onToggleWatchlist={() => toggle(data.symbol)}
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-2">👥 Ações Relacionadas</h2>
                <StockPeers peers={data.peers} onPeerClick={(symbol) => setTicker(symbol)} />
              </CardContent>
            </Card>
          </>
        )}
      </section>
    </SidebarLayout>
  )
}

export default { Page }
