// hooks/useMLPredictionsCache.ts
import { useRef, useCallback } from 'react'

interface CacheEntry {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
  timestamp: number
  expires: number
}

interface CacheResult {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  earnings: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  full?: any
}

export function useMLPredictionsCache(enabled: boolean = true) {
  const cacheRef = useRef<Map<string, CacheEntry>>(new Map())

  // Generate cache key
  const getCacheKey = useCallback((symbol: string, fullAnalysis: boolean) => {
    return `ml-predictions-${symbol}-${fullAnalysis ? 'full' : 'earnings'}`
  }, [])

  // Get cached data
  const getCachedData = useCallback((symbol: string, fullAnalysis: boolean): CacheResult | null => {
    if (!enabled) return null

    const key = getCacheKey(symbol, fullAnalysis)
    const cached = cacheRef.current.get(key)

    if (!cached || Date.now() > cached.expires) {
      cacheRef.current.delete(key)
      return null
    }

    return cached.data
  }, [enabled, getCacheKey])

  // Set cached data
  const setCachedData = useCallback((
    symbol: string,
    fullAnalysis: boolean,
    data: CacheResult,
    ttl: number = 300000 // 5 minutes
  ) => {
    if (!enabled) return

    const key = getCacheKey(symbol, fullAnalysis)
    cacheRef.current.set(key, {
      data,
      timestamp: Date.now(),
      expires: Date.now() + ttl
    })
  }, [enabled, getCacheKey])

  // Clear all cache
  const clearCache = useCallback(() => {
    cacheRef.current.clear()
  }, [])

  // Clear specific symbol
  const clearSymbolCache = useCallback((symbol: string) => {
    const keysToDelete = Array.from(cacheRef.current.keys())
      .filter(key => key.includes(symbol))

    keysToDelete.forEach(key => cacheRef.current.delete(key))
  }, [])

  // Get cache stats
  const getCacheStats = useCallback(() => {
    const entries = Array.from(cacheRef.current.entries())
    const now = Date.now()

    return {
      total: entries.length,
      expired: entries.filter(([, entry]) => now > entry.expires).length,
      active: entries.filter(([, entry]) => now <= entry.expires).length,
      oldestEntry: entries.length > 0 ?
        Math.min(...entries.map(([, entry]) => entry.timestamp)) : null
    }
  }, [])

  // Cleanup expired entries
  const cleanupExpired = useCallback(() => {
    const now = Date.now()
    const keysToDelete: string[] = []

    cacheRef.current.forEach((entry, key) => {
      if (now > entry.expires) {
        keysToDelete.push(key)
      }
    })

    keysToDelete.forEach(key => cacheRef.current.delete(key))
    return keysToDelete.length
  }, [])

  return {
    getCachedData,
    setCachedData,
    clearCache,
    clearSymbolCache,
    getCacheStats,
    cleanupExpired,
    isEnabled: enabled
  }
}
