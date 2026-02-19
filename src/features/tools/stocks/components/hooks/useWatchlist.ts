// hooks/useWatchlist.ts
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type TickerSymbol = string

interface WatchlistStore {
  watchlist: TickerSymbol[]
  isInWatchlist: (symbol: TickerSymbol) => boolean
  add: (symbol: TickerSymbol) => void
  remove: (symbol: TickerSymbol) => void
  toggle: (symbol: TickerSymbol) => void
}

const WATCHLIST_STORAGE_KEY = 'markets-watchlist'
const DEFAULT_WATCHLIST: TickerSymbol[] = ['AAPL', 'GOOGL']

const normalizeSymbol = (symbol: TickerSymbol): TickerSymbol => symbol.trim().toUpperCase()

export const useWatchlist = create<WatchlistStore>()(
  persist(
    (set, get) => ({
      watchlist: DEFAULT_WATCHLIST,

      isInWatchlist: (symbol: TickerSymbol): boolean => {
        const normalized = normalizeSymbol(symbol)
        if (!normalized) return false
        return get().watchlist.includes(normalized)
      },

      add: (symbol: TickerSymbol): void => {
        const normalized = normalizeSymbol(symbol)
        if (!normalized) return

        set((state) => {
          if (state.watchlist.includes(normalized)) return state
          return { watchlist: [...state.watchlist, normalized] }
        })
      },

      remove: (symbol: TickerSymbol): void => {
        const normalized = normalizeSymbol(symbol)
        if (!normalized) return

        set((state) => ({
          watchlist: state.watchlist.filter((item) => item !== normalized),
        }))
      },

      toggle: (symbol: TickerSymbol): void => {
        const normalized = normalizeSymbol(symbol)
        if (!normalized) return

        if (get().isInWatchlist(normalized)) {
          get().remove(normalized)
          return
        }

        get().add(normalized)
      },
    }),
    {
      name: WATCHLIST_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ watchlist: state.watchlist }),
    },
  ),
)
