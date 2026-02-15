// hooks/useWatchlist.ts
import { useState } from 'react'

export type TickerSymbol = string

export const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState<TickerSymbol[]>(['AAPL', 'GOOGL'])

  const isInWatchlist = (symbol: TickerSymbol): boolean => watchlist.includes(symbol.toUpperCase())

  const add = (symbol: TickerSymbol): void => {
    if (!isInWatchlist(symbol)) {
      setWatchlist((prev) => [...prev, symbol.toUpperCase()])
    }
  }

  const remove = (symbol: TickerSymbol): void => {
    setWatchlist((prev) => prev.filter((s) => s.toUpperCase() !== symbol.toUpperCase()))
  }

  const toggle = (symbol: TickerSymbol): void =>
    isInWatchlist(symbol) ? remove(symbol) : add(symbol)

  return {
    watchlist,
    isInWatchlist,
    add,
    remove,
    toggle,
  }
}
