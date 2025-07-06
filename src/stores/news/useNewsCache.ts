// src/components/noticias/hooks/useNewsCache.ts
import { useCallback, useMemo } from 'react'
import { useNewsStore, useNewsSelectors } from '../../../stores/useNewsStore'
import type { NewsFilters } from '../../../types/news'

// Cache strategies locais (caso não estejam exportados do service)
const CacheStrategies = {
  NEWS_SHORT: 300, // 5 minutos
  NEWS_FEATURED: 600, // 10 minutos
  STATS: 1800, // 30 minutos
  HEALTH: 60, // 1 minuto
  SEARCH: 120, // 2 minutos
  SOURCES: 3600, // 1 hora
  STATIC: 86400, // 24 horas
}

// Cache keys locais
const CacheKeys = {
  news: {
    list: (filters: string) => `news:list:${filters}`,
    featured: () => 'news:featured',
    trending: (timeframe: string) => `news:trending:${timeframe}`,
    byTicker: (ticker: string, filters: string) => `news:ticker:${ticker}:${filters}`,
    byCategory: (category: string, filters: string) => `news:category:${category}:${filters}`,
    single: (id: string) => `news:single:${id}`,
    search: (query: string, filters: string) => `news:search:${btoa(query)}:${filters}`,
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

interface UseNewsCacheOptions {
  enablePersistence?: boolean
  customTTL?: number
  autoInvalidate?: boolean
}

// Tipos mínimos para resolver os any
interface ExtendedCacheService {
  clearPattern?: (pattern: string) => Promise<number>
  keys?: (pattern?: string) => Promise<string[]>
  stats?: () => Promise<{ entries?: Record<string, unknown> }>
}

/**
 * Hook especializado para gestão de cache das notícias
 * Providencia controlo fino sobre cache, invalidação e estratégias de persistência
 */
export const useNewsCache = (options: UseNewsCacheOptions = {}) => {
  const {
    enablePersistence = true,
    customTTL = CacheStrategies.NEWS_SHORT,
    autoInvalidate = true,
  } = options

  // === STORE STATE ===
  const { cache, filters, news, clearCache, loadNews } = useNewsStore()

  const { isDataFresh, needsRefresh } = useNewsSelectors()

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
    const filterString = JSON.stringify({
      category: filters.category,
      searchTerm: filters.searchTerm,
      source: filters.source,
    })
    const baseKey = CacheKeys.news.list(btoa(filterString))
    return suffix ? `${baseKey}:${suffix}` : baseKey
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
    [enablePersistence, customTTL],
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
    [enablePersistence],
  )

  const invalidateCache = useCallback(async (pattern?: string) => {
    try {
      if (pattern) {
        const extendedCache = cacheService as typeof cacheService & ExtendedCacheService
        // Tentar usar clearPattern se existir, senão usar método alternativo
        if (extendedCache.clearPattern) {
          await extendedCache.clearPattern(pattern)
          console.log(`🗑️ Cache invalidado: ${pattern}`)
        } else {
          // Método alternativo: buscar keys e deletar individualmente
          const keys = extendedCache.keys ? await extendedCache.keys(pattern) : []
          for (const key of keys) {
            await cacheService.delete(key)
          }
          console.log(`🗑️ Cache invalidado (fallback): ${pattern} (${keys.length} keys)`)
        }
      } else {
        // Limpar cache de notícias
        if (cacheService.news?.clear) {
          await cacheService.news.clear()
        } else {
          await cacheService.clear()
        }
        console.log('🗑️ Cache de notícias limpo')
      }
    } catch (error) {
      console.error('❌ Erro ao invalidar cache:', error)
    }
  }, [])

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
      const key = CacheKeys.news.search(query, JSON.stringify(filters))
      await setCacheData(key, results, CacheStrategies.SEARCH)
    },
    [setCacheData, filters],
  )

  const getCachedSearchResults = useCallback(
    async (query: string) => {
      const key = CacheKeys.news.search(query, JSON.stringify(filters))
      return await getCacheData(key)
    },
    [getCacheData, filters],
  )

  // === SMART CACHE OPERATIONS ===
  const smartRefresh = useCallback(
    async (forceRefresh = false) => {
      const currentKey = getCurrentCacheKey()

      if (!forceRefresh) {
        // Tentar obter dados do cache primeiro
        const cachedData = await getCacheData(currentKey)
        if (cachedData && !needsRefresh) {
          console.log('💾 Usando dados do cache')
          return cachedData
        }
      }

      // Se não há cache ou force refresh, carregar dados
      console.log('🔄 Cache miss ou force refresh - carregando dados')
      await loadNews(forceRefresh)

      // Cache dos novos dados
      await setCacheData(currentKey, news)

      return news
    },
    [getCurrentCacheKey, getCacheData, needsRefresh, loadNews, setCacheData, news],
  )

  const preloadCategory = useCallback(
    async (category: string) => {
      const cached = await getCacheByCategory(category)
      if (!cached) {
        console.log(`🚀 Preloading categoria: ${category}`)
        // TODO: Implementar preload específico por categoria
        // Isto poderia fazer uma chamada em background para carregar dados da categoria
      }
    },
    [getCacheByCategory],
  )

  // === CACHE WARMING ===
  const warmCache = useCallback(
    async (categories: string[] = ['all', 'stocks', 'economy', 'politics']) => {
      console.log('🔥 Warming cache para categorias:', categories)

      for (const category of categories) {
        try {
          await preloadCategory(category)
        } catch (error) {
          console.error(`❌ Erro ao warm cache para ${category}:`, error)
        }
      }
    },
    [preloadCategory],
  )

  // === AUTO INVALIDATION ===
  const setupAutoInvalidation = useCallback(() => {
    if (!autoInvalidate) return

    // Invalidar cache automaticamente após TTL
    const invalidationTimer = setTimeout(async () => {
      if (needsRefresh) {
        console.log('🗑️ Auto-invalidação do cache')
        await invalidateCache('news:*')
      }
    }, customTTL * 1000)

    return () => clearTimeout(invalidationTimer)
  }, [autoInvalidate, needsRefresh, invalidateCache, customTTL])

  // === CACHE STATS ===
  const getCacheStats = useCallback(async () => {
    try {
      const extendedCache = cacheService as typeof cacheService & ExtendedCacheService
      const stats = extendedCache.stats ? await extendedCache.stats() : { entries: {} }
      const newsEntries = Object.keys(stats.entries || {}).filter((key) => key.startsWith('news:'))

      return {
        ...stats,
        newsEntries: newsEntries.length,
        newsCacheSize: newsEntries.reduce((acc, key) => {
          const entry = stats.entries?.[key] as { size?: number }
          return acc + (entry?.size || 0)
        }, 0),
        oldestNewsEntry: newsEntries.reduce(
          (oldest, key) => {
            const entry = stats.entries?.[key] as { created?: Date }
            if (!entry) return oldest
            return !oldest || (entry.created && entry.created < oldest)
              ? entry.created || null
              : oldest
          },
          null as Date | null,
        ),
      }
    } catch (error) {
      console.error('❌ Erro ao obter stats do cache:', error)
      return {
        newsEntries: 0,
        newsCacheSize: 0,
        oldestNewsEntry: null,
      }
    }
  }, [])

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

    // Configuração
    updateTTL: (newTTL: number) => {
      console.log(`⏱️ TTL atualizado para: ${newTTL}s`)
      // Em uma implementação real, isto poderia:
      // 1. Atualizar configuração no store
      // 2. Re-configurar timers ativos
      // 3. Invalidar cache existente se necessário
      return newTTL
    },

    // Helpers para componentes
    isCacheValid: !needsRefresh && isDataFresh,
    shouldRefresh: needsRefresh || !isDataFresh,
    cacheAge: cacheInfo.ageInMinutes,

    // Actions úteis para debug
    debugCache: async () => {
      const stats = await getCacheStats()
      console.table(stats)
      return stats
    },

    flushAll: async () => {
      await cacheService.clear()
      clearCache()
      console.log('🗑️ Todo o cache foi limpo')
    },
  }
}

export default useNewsCache
