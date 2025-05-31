import { useStockSearch } from "../../components/stocks/hooks/useStockSearch"
import { useWatchlist } from "../../components/stocks/hooks/useWatchlist"
import { StockDetails } from "../../components/stocks/StockDetails"
import { StockPeers } from "../../components/stocks/StockPeers"
import { StockRatings } from "../../components/stocks/StockRatings"
import { StocksSearchBar } from "../../components/stocks/StocksSearchBar"

export const Page = () => {
  const { ticker, setTicker, searchStock, data, loading, error } = useStockSearch()
  const { isInWatchlist, toggle } = useWatchlist()

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Pesquisa de Ações</h1>

      <StocksSearchBar
        value={ticker}
        onChange={(e) => setTicker(e.target.value)}
        onSearch={searchStock}
      />

      {loading && <p>A carregar...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {data && (
        <>
          <StockDetails
            stockData={data}
            isInWatchlist={isInWatchlist(data.symbol)}
            onToggleWatchlist={() => toggle(data.symbol)}
          />
          <StockRatings
            pe={data.pe}
            peg={data.pegRatio}
            dcf={data.dcf}
            roe={data.roe}
          />
          <StockPeers
            peers={data.peers}
            onPeerClick={(symbol) => setTicker(symbol)}
          />
        </>
      )}
    </div>
  )
}

export default { Page }
