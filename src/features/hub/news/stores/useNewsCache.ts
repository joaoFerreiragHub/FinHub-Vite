// src/features/hub/news/stores/useNewsCache.ts
import { useCallback, useMemo, useRef, useEffect } from 'react'
import { useNewsSelectors, useNewsStore } from '~/features/hub/news/stores/useNewsStore'
import type { NewsFilters } from '~/features/hub/news/types/news'

// ✅ Cache strategies locais (não dependem de service externo)
const CacheStrategies = {
  NEWS_SHORT: 300, // 5 minutos
  NEWS_FEATURED: 600, // 10 minutos
  STATS: 1800, // 30 minutos
  HEALTH: 60, // 1 minuto
  SEARCH: 120, // 2 minutos
  SOURCES: 3600, // 1 hora
  STATIC: 86400, // 24 horas
}

// ✅ Cache keys locais
const CacheKeys = {
  news: {
    list: (filters: string) => `news:list:${filters}`,
    featured: () => 'news:featured',
    trending: (timeframe: string) => `news:trending:${timeframe}`,
    byTicker: (ticker: string, filters: string) => `news:ticker:${ticker}:${filters}`,
    byCategory: (category: string, filters: string) => `news:category:${category}:${filters}`,
    single: (id: string) => `news:single:${id}`,
    search: (query: string, filters: string) =>
      `news:search:${btoa(encodeURIComponent(query))}:${filters}`,
  },
  stats: {
    general: (filters: string) => `stats:general:${filters}`,
    sources: () => 'stats:sources',
    trending: (timeframe: string) => `stats:trending:${timeframe}`,
  },
  health: {
    sources: () => 'health:sources',
    system: () => 'health:system',
  },
  sources: {
    list: () => 'sources:list',
    active: () => 'sources:active',
  },
}

// ✅ Interface simples para cache frontend
interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
  hits: number
}

// ✅ Implementação de cache para o frontend (localStorage + memory)
class FrontendCacheService {
  private memoryCache = new Map<string, CacheEntry<unknown>>()
  private hitCount = 0
  private missCount = 0

  async get<T>(key: string): Promise<T | null> {
    try {
      // 1. Tentar memory cache primeiro
      const memEntry = this.memoryCache.get(key)
      if (memEntry && this.isValid(memEntry)) {
        memEntry.hits++
        this.hitCount++
        return memEntry.data as T
      }

      // 2. Tentar localStorage (apenas no cliente)
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(`cache:${key}`)
        if (stored) {
          const parsed: CacheEntry<T> = JSON.parse(stored)
          if (this.isValid(parsed)) {
            // Restaurar para memory cache
            this.memoryCache.set(key, parsed)
            parsed.hits++
            this.hitCount++
            return parsed.data
          }
          // Remover se expirado
          localStorage.removeItem(`cache:${key}`)
        }
      }

      this.missCount++
      return null
    } catch (error) {
      console.error('❌ Cache GET error:', error)
      this.missCount++
      return null
    }
  }

  async set<T>(key: string, data: T, ttlSeconds = 300): Promise<void> {
    try {
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        ttl: ttlSeconds,
        hits: 0,
      }

      // Salvar em memory cache
      this.memoryCache.set(key, entry)

      // Tentar salvar em localStorage (apenas no cliente)
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(`cache:${key}`, JSON.stringify(entry))
        } catch {
          console.warn('⚠️ localStorage full, using only memory cache')
        }
      }
    } catch (error) {
      console.error('❌ Cache SET error:', error)
    }
  }

  async delete(key: string): Promise<boolean> {
    try {
      const memoryDeleted = this.memoryCache.delete(key)

      if (typeof window !== 'undefined') {
        localStorage.removeItem(`cache:${key}`)
      }

      return memoryDeleted
    } catch (error) {
      console.error('❌ Cache DELETE error:', error)
      return false
    }
  }

  async clear(): Promise<void> {
    try {
      this.memoryCache.clear()
      this.hitCount = 0
      this.missCount = 0

      // Limpar localStorage cache (apenas no cliente)
      if (typeof window !== 'undefined') {
        const keys = Object.keys(localStorage).filter((k) => k.startsWith('cache:'))
        keys.forEach((k) => localStorage.removeItem(k))
      }
    } catch (error) {
      console.error('❌ Cache CLEAR error:', error)
    }
  }

  async clearPattern(pattern: string): Promise<number> {
    try {
      let deletedCount = 0
      const regex = new RegExp(pattern.replace(/\*/g, '.*'))

      // Memory cache
      for (const key of this.memoryCache.keys()) {
        if (regex.test(key)) {
          this.memoryCache.delete(key)
          deletedCount++
        }
      }

      // localStorage (apenas no cliente)
      if (typeof window !== 'undefined') {
        const keys = Object.keys(localStorage)
          .filter((k) => k.startsWith('cache:'))
          .map((k) => k.replace('cache:', ''))
          .filter((k) => regex.test(k))

        keys.forEach((k) => {
          localStorage.removeItem(`cache:${k}`)
          deletedCount++
        })
      }

      return deletedCount
    } catch (error) {
      console.error('❌ Cache CLEAR PATTERN error:', error)
      return 0
    }
  }

  async keys(pattern?: string): Promise<string[]> {
    try {
      const memoryKeys = Array.from(this.memoryCache.keys())
      let storageKeys: string[] = []

      // localStorage keys (apenas no cliente)
      if (typeof window !== 'undefined') {
        storageKeys = Object.keys(localStorage)
          .filter((k) => k.startsWith('cache:'))
          .map((k) => k.replace('cache:', ''))
      }

      const allKeys = [...new Set([...memoryKeys, ...storageKeys])]

      if (pattern) {
        const regex = new RegExp(pattern.replace(/\*/g, '.*'))
        return allKeys.filter((k) => regex.test(k))
      }

      return allKeys
    } catch (error) {
      console.error('❌ Cache KEYS error:', error)
      return []
    }
  }

  async has(key: string): Promise<boolean> {
    const data = await this.get(key)
    return data !== null
  }

  getStats() {
    const totalRequests = this.hitCount + this.missCount
    const hitRate = totalRequests > 0 ? (this.hitCount / totalRequests) * 100 : 0

    return {
      totalKeys: this.memoryCache.size,
      totalHits: this.hitCount,
      totalMisses: this.missCount,
      hitRate: Math.round(hitRate * 100) / 100,
      memoryUsage: `${this.memoryCache.size} keys`,
    }
  }

  async remember<T>(key: string, callback: () => Promise<T>, ttl = 300): Promise<T> {
    const cached = await this.get<T>(key)
    if (cached !== null) {
      return cached
    }

    const data = await callback()
    await this.set(key, data, ttl)
    return data
  }

  private isValid<T>(entry: CacheEntry<T>): boolean {
    const age = (Date.now() - entry.timestamp) / 1000
    return age <= entry.ttl
  }

  // Cleanup automático
  cleanup(): void {
    let cleaned = 0

    for (const [key, entry] of this.memoryCache.entries()) {
      if (!this.isValid(entry)) {
        this.memoryCache.delete(key)
        cleaned++
      }
    }

    if (cleaned > 0) {
      console.log(`💾 Cleaned ${cleaned} expired cache entries`)
    }
  }
}

interface UseNewsCacheOptions {
  enablePersistence?: boolean
  customTTL?: number
  autoInvalidate?: boolean
}

/**
 * Hook especializado para gestão de cache das notícias
 * ✅ FUNCIONA COM SSR/VITE SEM DEPENDÊNCIAS EXTERNAS
 */
export const useNewsCache = (options: UseNewsCacheOptions = {}) => {
  const {
    enablePersistence = true,
    customTTL = CacheStrategies.NEWS_SHORT,
    autoInvalidate = true,
  } = options

  // === CACHE SERVICE SINGLETON ===
  const cacheServiceRef = useRef<FrontendCacheService | null>(null)
  if (!cacheServiceRef.current) {
    cacheServiceRef.current = new FrontendCacheService()
  }
  const cacheService = cacheServiceRef.current

  // === STORE STATE ===
  const { cache, filters, news, clearCache, loadNews } = useNewsStore()
  const { isDataFresh, needsRefresh } = useNewsSelectors()

  // === TIMERS CLEANUP ===
  const timersRef = useRef<Set<NodeJS.Timeout>>(new Set())

  useEffect(() => {
    const timers = timersRef.current

    // Cleanup automático a cada 5 minutos (apenas no cliente)
    if (typeof window !== 'undefined') {
      const cleanupInterval = setInterval(
        () => {
          cacheService.cleanup()
        },
        5 * 60 * 1000,
      )

      timers.add(cleanupInterval)
    }

    return () => {
      timers.forEach((timer) => clearTimeout(timer))
      timers.clear()
    }
  }, [cacheService])

  // === COMPUTED VALUES ===
  const cacheInfo = useMemo(() => {
    const lastUpdate = cache.lastUpdate ? new Date(cache.lastUpdate) : null
    const now = new Date()
    const ageInMinutes = lastUpdate
      ? Math.floor((now.getTime() - lastUpdate.getTime()) / (1000 * 60))
      : null

    return {
      lastUpdate,
      ageInMinutes,
      isStale: cache.isStale,
      isFresh: isDataFresh,
      totalItems: news.length,
      hasData: news.length > 0,
      needsRefresh,
    }
  }, [cache, isDataFresh, news.length, needsRefresh])

  // === CACHE KEYS HELPERS ===
  const generateCacheKey = useCallback((filters: NewsFilters, suffix?: string) => {
    try {
      const filterString = JSON.stringify({
        category: filters.category,
        searchTerm: filters.searchTerm,
        source: filters.source,
      })
      const baseKey = CacheKeys.news.list(btoa(encodeURIComponent(filterString)))
      return suffix ? `${baseKey}:${suffix}` : baseKey
    } catch (error) {
      console.error('❌ Erro ao gerar cache key:', error)
      // Fallback simples se JSON.stringify ou btoa falharem
      const simpleKey = `${filters.category || 'all'}-${filters.searchTerm || ''}-${filters.source || ''}`
      return CacheKeys.news.list(simpleKey.replace(/[^a-zA-Z0-9-_]/g, '_'))
    }
  }, [])

  const getCurrentCacheKey = useCallback(() => {
    return generateCacheKey(filters)
  }, [filters, generateCacheKey])

  // === CACHE OPERATIONS ===
  const setCacheData = useCallback(
    async (key: string, data: unknown, ttl?: number) => {
      if (!enablePersistence) return

      try {
        await cacheService.set(key, data, ttl || customTTL)
        console.log(`💾 Cache set: ${key} (TTL: ${ttl || customTTL}s)`)
      } catch (error) {
        console.error('❌ Erro ao definir cache:', error)
      }
    },
    [enablePersistence, customTTL, cacheService],
  )

  const getCacheData = useCallback(
    async <T>(key: string): Promise<T | null> => {
      if (!enablePersistence) return null

      try {
        const data = await cacheService.get<T>(key)
        if (data) {
          console.log(`💾 Cache hit: ${key}`)
        }
        return data
      } catch (error) {
        console.error('❌ Erro ao obter cache:', error)
        return null
      }
    },
    [enablePersistence, cacheService],
  )

  const invalidateCache = useCallback(
    async (pattern?: string) => {
      try {
        if (pattern) {
          const cleared = await cacheService.clearPattern(pattern)
          console.log(`🗑️ Cache invalidado: ${pattern} (${cleared} keys)`)
        } else {
          await cacheService.clear()
          console.log('🗑️ Cache limpo completamente')
        }
      } catch (error) {
        console.error('❌ Erro ao invalidar cache:', error)
      }
    },
    [cacheService],
  )

  // === CACHE STRATEGIES ===
  const cacheByCategory = useCallback(
    async (category: string, data: unknown) => {
      const key = CacheKeys.news.byCategory(category, '')
      await setCacheData(key, data, CacheStrategies.NEWS_SHORT)
    },
    [setCacheData],
  )

  const getCacheByCategory = useCallback(
    async (category: string) => {
      const key = CacheKeys.news.byCategory(category, '')
      return await getCacheData(key)
    },
    [getCacheData],
  )

  const cacheSearchResults = useCallback(
    async (query: string, results: unknown) => {
      try {
        const key = CacheKeys.news.search(query, JSON.stringify(filters))
        await setCacheData(key, results, CacheStrategies.SEARCH)
      } catch (error) {
        console.error('❌ Erro ao cache search results:', error)
      }
    },
    [setCacheData, filters],
  )

  const getCachedSearchResults = useCallback(
    async (query: string) => {
      try {
        const key = CacheKeys.news.search(query, JSON.stringify(filters))
        return await getCacheData(key)
      } catch (error) {
        console.error('❌ Erro ao obter cached search results:', error)
        return null
      }
    },
    [getCacheData, filters],
  )

  // === SMART CACHE OPERATIONS ===
  const smartRefresh = useCallback(
    async (forceRefresh = false) => {
      const currentKey = getCurrentCacheKey()

      try {
        if (!forceRefresh) {
          const cachedData = await getCacheData(currentKey)
          if (cachedData && !needsRefresh) {
            console.log('💾 Usando dados do cache')
            return cachedData
          }
        }

        console.log('🔄 Cache miss ou force refresh - carregando dados')
        await loadNews(forceRefresh)

        if (news && Array.isArray(news) && news.length > 0) {
          await setCacheData(currentKey, news)
        }

        return news
      } catch (error) {
        console.error('❌ Erro no smart refresh:', error)
        const fallbackData = await getCacheData(currentKey)
        return fallbackData || []
      }
    },
    [getCurrentCacheKey, getCacheData, needsRefresh, loadNews, setCacheData, news],
  )

  const preloadCategory = useCallback(
    async (category: string) => {
      try {
        const cached = await getCacheByCategory(category)
        if (!cached) {
          console.log(`🚀 Preloading categoria: ${category}`)
        }
      } catch (error) {
        console.error(`❌ Erro no preload da categoria ${category}:`, error)
      }
    },
    [getCacheByCategory],
  )

  const warmCache = useCallback(
    async (categories: string[] = ['all', 'stocks', 'economy', 'politics']) => {
      console.log('🔥 Warming cache para categorias:', categories)

      const promises = categories.map(async (category) => {
        try {
          await preloadCategory(category)
        } catch (error) {
          console.error(`❌ Erro ao warm cache para ${category}:`, error)
        }
      })

      await Promise.allSettled(promises)
    },
    [preloadCategory],
  )

  // === AUTO INVALIDATION ===
  const setupAutoInvalidation = useCallback(() => {
    if (!autoInvalidate) return () => {}

    const timer = setTimeout(async () => {
      if (needsRefresh) {
        console.log('🗑️ Auto-invalidação do cache')
        await invalidateCache('news:*')
      }
    }, customTTL * 1000)

    timersRef.current.add(timer)

    return () => {
      clearTimeout(timer)
      timersRef.current.delete(timer)
    }
  }, [autoInvalidate, needsRefresh, invalidateCache, customTTL])

  // === CACHE STATS ===
  const getCacheStats = useCallback(async () => {
    try {
      const stats = cacheService.getStats()
      const allKeys = await cacheService.keys()
      const newsKeys = allKeys.filter((key) => key.startsWith('news:'))

      return {
        ...stats,
        newsEntries: newsKeys.length,
        newsKeys,
        totalKeys: allKeys.length,
      }
    } catch (error) {
      console.error('❌ Erro ao obter stats do cache:', error)
      return {
        newsEntries: 0,
        newsKeys: [],
        totalKeys: 0,
        hitRate: 0,
        memoryUsage: '0 keys',
      }
    }
  }, [cacheService])

  // === AUTO INVALIDATION SETUP ===
  useEffect(() => {
    if (autoInvalidate) {
      const cleanup = setupAutoInvalidation()
      return cleanup
    }
  }, [autoInvalidate, setupAutoInvalidation])

  // === RETORNO DO HOOK ===
  return {
    // Estado do cache
    cacheInfo,
    isEnabled: enablePersistence,
    currentKey: getCurrentCacheKey(),

    // Operações básicas
    set: setCacheData,
    get: getCacheData,
    clear: clearCache,
    invalidate: invalidateCache,

    // Operações específicas
    cacheByCategory,
    getCacheByCategory,
    cacheSearchResults,
    getCachedSearchResults,

    // Operações inteligentes
    smartRefresh,
    preloadCategory,
    warmCache,

    // Utilitários
    generateCacheKey,
    getCacheStats,
    setupAutoInvalidation,

    // Cache inteligente
    remember: useCallback(
      async <T>(key: string, callback: () => Promise<T>, ttl?: number): Promise<T> => {
        if (!enablePersistence) {
          return await callback()
        }
        return await cacheService.remember(key, callback, ttl || customTTL)
      },
      [enablePersistence, customTTL, cacheService],
    ),

    // Configuração
    updateTTL: (newTTL: number) => {
      console.log(`⏱️ TTL atualizado para: ${newTTL}s`)
      return newTTL
    },

    // Helpers para componentes
    isCacheValid: !needsRefresh && isDataFresh,
    shouldRefresh: needsRefresh || !isDataFresh,
    cacheAge: cacheInfo.ageInMinutes,

    // Actions úteis para debug
    debugCache: async () => {
      try {
        const stats = await getCacheStats()
        console.table(stats)
        return stats
      } catch (error) {
        console.error('❌ Erro no debug cache:', error)
        return null
      }
    },

    flushAll: async () => {
      try {
        await cacheService.clear()
        clearCache()
        console.log('🗑️ Todo o cache foi limpo')
      } catch (error) {
        console.error('❌ Erro ao limpar cache:', error)
      }
    },

    // Health check do cache
    healthCheck: async () => {
      try {
        const testKey = 'cache:health:test'
        const testData = { timestamp: Date.now(), test: true }

        await cacheService.set(testKey, testData, 10)
        const retrieved = await cacheService.get(testKey)
        const exists = await cacheService.has(testKey)
        await cacheService.delete(testKey)

        const isHealthy =
          retrieved !== null && exists && JSON.stringify(retrieved) === JSON.stringify(testData)

        console.log(`💊 Cache health: ${isHealthy ? '✅ OK' : '❌ FAIL'}`)

        return {
          healthy: isHealthy,
          timestamp: new Date().toISOString(),
          stats: cacheService.getStats(),
        }
      } catch (error) {
        console.error('❌ Cache health check failed:', error)
        return {
          healthy: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString(),
        }
      }
    },

    // Check if key exists
    has: useCallback(
      async (key: string): Promise<boolean> => {
        if (!enablePersistence) return false
        return await cacheService.has(key)
      },
      [enablePersistence, cacheService],
    ),

    // Get all keys matching pattern
    keys: useCallback(
      async (pattern?: string): Promise<string[]> => {
        return await cacheService.keys(pattern)
      },
      [cacheService],
    ),
  }
}

export default useNewsCache
