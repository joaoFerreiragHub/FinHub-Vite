// components/Stocks/StocksPage.tsx
import { StocksSearchBar } from './StocksSearchBar'
import { StockDetails } from './StockDetails'
import { useStockSearch } from './hooks/useStockSearch'
import { useWatchlist } from './hooks/useWatchlist'


export const StocksPage = () => {
  const {
    ticker,
    setTicker,
    searchStock,
    data: stockData,
    loading,
    error,
  } = useStockSearch()

  const { isInWatchlist, toggle: toggleWatchlist } = useWatchlist()

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <h2 className="text-2xl font-bold">Pesquisar Ações</h2>

      <StocksSearchBar ticker={ticker} setTicker={setTicker} onSearch={searchStock} />

      {loading && <p className="text-sm text-blue-500">A carregar...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {stockData && (
        <StockDetails
          stockData={stockData}
          isInWatchlist={isInWatchlist(stockData.symbol)}
          onToggleWatchlist={() => toggleWatchlist(stockData.symbol)}
          onPeerClick={(symbol) => {
            setTicker(symbol)
            searchStock()
          }}
        />
      )}
    </div>
  )
}
