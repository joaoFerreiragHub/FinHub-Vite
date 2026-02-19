// src/features/hub/news/hooks/useNews.ts

import { useEffect } from 'react'
import {
  useNewsStore,
  useNewsSelectors,
  type NewsStats,
  type HealthCheckResponse,
} from '@/features/hub/news/stores/useNewsStore'
import { NewsArticle, NewsFilters } from '../types/news'

// ✅ IMPORTAR o store de filtros que criamos
import {
  useNewsFilters as useNewsFiltersStore,
  useBasicFilters,
} from '@/features/hub/news/stores/useNewsFilters'

// ===== INTERFACES =====
interface UseNewsOptions {
  autoLoad?: boolean
  autoRefresh?: boolean
  refreshInterval?: number
}
interface SourceInfo {
  value: string
  label: string
  icon: string
  description: string
}

interface CategoryInfo {
  value: string
  label: string
  icon: string
}

interface UseNewsReturn {
  // === DADOS ===
  news: NewsArticle[]
  filteredNews: NewsArticle[]
  allNews: NewsArticle[] // Alias para compatibilidade
  stats: NewsStats
  totalCount: number
  loadedItems: number

  // === ESTADOS ===
  isLoading: boolean
  isInitialLoading: boolean
  isLoadingMore: boolean
  hasError: boolean
  error: string | null
  hasNews: boolean
  isEmpty: boolean
  isDataFresh: boolean
  needsRefresh: boolean
  isOffline: boolean

  // === FILTROS ===
  filters: NewsFilters
  hasActiveFilters: boolean

  // === PAGINAÇÃO ===
  currentPage: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
  itemsPerPage: number

  // === CARREGAMENTO INCREMENTAL ===
  hasMore: boolean
  canLoadMore: boolean
  loadingStats: {
    loaded: number
    total: number
    remaining: number
    percentage: number
  }

  // === CACHE ===
  cache: {
    lastUpdate: string | null
    isStale: boolean
    nextRefresh: number
  }
  lastUpdate: string | null

  // === ACTIONS PRINCIPAIS ===
  loadNews: (forceRefresh?: boolean) => Promise<void>
  refreshNews: () => Promise<void>
  forceRefresh: () => Promise<void>
  loadMoreNews: () => Promise<void>

  // === FILTROS ===
  setSearchTerm: (term: string) => void
  setCategory: (category: string) => void
  setSource: (source: string) => void // ✅ NOVO: Filtro por fonte
  setFilters: (filters: Partial<NewsFilters>) => void
  clearFilters: () => void

  // === PAGINAÇÃO ===
  setPage: (page: number) => void
  nextPage: () => void
  prevPage: () => void

  // === CONFIGURAÇÕES ===
  setAutoRefresh: (enabled: boolean) => void
  setRefreshInterval: (interval: number) => void
  setItemsPerPage: (count: number) => void

  // === UTILITIES ===
  clearError: () => void
  testAPI: () => Promise<HealthCheckResponse>

  // === UTILITIES AVANÇADAS ===
  loadSpecificAmount: (count: number) => Promise<void>
  canLoadMoreFromCategory: (category: string) => boolean
  getCurrentCategoryStats: () => {
    category: string
    loaded: number
    total: number
    hasMore: boolean
    percentage: number
  }
  getProgressInfo: () => {
    current: number
    total: number
    remaining: number
    percentage: number
    isComplete: boolean
    canLoadMore: boolean
  }

  // ✅ NOVOS: Específicos para filtros e fontes
  getSourceInfo: (sourceValue: string) => SourceInfo | null
  getCategoryInfo: (categoryValue: string) => CategoryInfo | null
  filterSummary: string
  activeFilterCount: number
}

// ===== HOOK PRINCIPAL =====
/**
 * Hook principal para notícias - API unificada e simplificada
 *
 * @param options - Configurações opcionais
 * @returns Interface completa para gerenciamento de notícias
 */
export const useNews = (options: UseNewsOptions = {}): UseNewsReturn => {
  const {
    autoLoad = true,
    autoRefresh = true,
    refreshInterval = 10 * 60 * 1000, // 10 minutos
  } = options

  // === STORE STATE ===
  const {
    news,
    filteredNews,
    error,
    stats,
    cache,
    currentPage,
    totalCount,
    itemsPerPage,
    hasMore,
    loadedItems,
    isLoadingMore,
    // Actions do store principal
    loadNews,
    refreshNews,
    setSearchTerm: setStoreSearchTerm,
    setCategory: setStoreCategory,
    setFilters: setStoreFilters,
    clearFilters: clearStoreFilters,
    setPage,
    nextPage,
    prevPage,
    setAutoRefresh,
    setRefreshInterval,
    clearError,
    testConnection,
    loadMoreNews,
    setItemsPerPage,
  } = useNewsStore()

  // ✅ NOVO: Store de filtros integrado
  const {
    filters: filtersStoreFilters,
    hasActiveFilters: filtersHasActive,
    setSearchTerm: filtersSetSearchTerm,
    setCategory: filtersSetCategory,
    setSource: filtersSetSource,
    clearFilters: filtersClearFilters,
    getSourceInfo,
    getCategoryInfo,
    filterSummary,
    activeFilterCount,
  } = useBasicFilters()

  // === SELECTORS ===
  const {
    isLoading,
    isInitialLoading,
    hasError,
    hasNews,
    isDataFresh,
    isOffline,
    totalPages,
    hasNextPage,
    hasPrevPage,
    isEmpty,
    needsRefresh,
    canLoadMore,
    loadingStats,
  } = useNewsSelectors()

  // ✅ SINCRONIZAÇÃO: Manter ambos os stores sincronizados
  useEffect(() => {
    // Quando filtros do store de filtros mudam, aplicar ao store principal
    setStoreFilters(filtersStoreFilters)
  }, [filtersStoreFilters, setStoreFilters])

  // === SETUP INICIAL ===
  useEffect(() => {
    setAutoRefresh(autoRefresh)
    if (refreshInterval) {
      setRefreshInterval(refreshInterval)
    }
  }, [autoRefresh, refreshInterval, setAutoRefresh, setRefreshInterval])

  // === AUTO-LOAD ===
  useEffect(() => {
    if (autoLoad && (!hasNews || needsRefresh)) {
      loadNews()
    }
  }, [autoLoad, hasNews, needsRefresh, loadNews])

  // === VISIBILITY CHANGE ===
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && needsRefresh) {
        loadNews(true)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [needsRefresh, loadNews])

  // ✅ FILTROS INTEGRADOS: Wrappers que mantêm ambos stores sincronizados
  const setSearchTerm = (term: string) => {
    filtersSetSearchTerm(term)
    setStoreSearchTerm(term)
  }

  const setCategory = (category: string) => {
    filtersSetCategory(category)
    setStoreCategory(category)
  }

  const setSource = (source: string) => {
    console.log(`🔄 [useNews] Setting source filter: ${source}`)
    filtersSetSource(source)

    // Aplicar filtro ao store principal também
    setStoreFilters({ ...filtersStoreFilters, source: source === 'all' ? undefined : source })

    // Recarregar notícias com novo filtro
    loadNews(true)
  }

  const setFilters = (newFilters: Partial<NewsFilters>) => {
    // Aplicar em ambos os stores
    setStoreFilters(newFilters)
    useNewsFiltersStore.getState().setFilters(newFilters)
  }

  const clearFilters = () => {
    filtersClearFilters()
    clearStoreFilters()
  }

  // === UTILITIES AVANÇADAS ===
  const loadSpecificAmount = async (count: number) => {
    const originalCount = itemsPerPage
    setItemsPerPage(count)
    await loadNews(true)
    setItemsPerPage(originalCount)
  }

  const canLoadMoreFromCategory = (category: string) => {
    return filtersStoreFilters.category === category && canLoadMore
  }

  const getCurrentCategoryStats = () => ({
    category: filtersStoreFilters.category,
    loaded: loadedItems,
    total: totalCount,
    hasMore,
    percentage: loadingStats.percentage,
  })

  const getProgressInfo = () => ({
    current: loadedItems,
    total: totalCount,
    remaining: loadingStats.remaining,
    percentage: loadingStats.percentage,
    isComplete: !hasMore,
    canLoadMore,
  })

  // === RETURN OBJECT ===
  return {
    // === DADOS ===
    news,
    filteredNews,
    allNews: news, // Alias para compatibilidade
    stats,
    totalCount,
    loadedItems,

    // === ESTADOS ===
    isLoading,
    isInitialLoading,
    isLoadingMore,
    hasError,
    error,
    hasNews,
    isEmpty,
    isDataFresh,
    needsRefresh,
    isOffline,

    // === FILTROS (priorizando o store de filtros) ===
    filters: filtersStoreFilters,
    hasActiveFilters: filtersHasActive,

    // === PAGINAÇÃO ===
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    itemsPerPage,

    // === CARREGAMENTO INCREMENTAL ===
    hasMore,
    canLoadMore,
    loadingStats,

    // === CACHE ===
    cache,
    lastUpdate: cache.lastUpdate,

    // === ACTIONS PRINCIPAIS ===
    loadNews,
    refreshNews,
    forceRefresh: () => loadNews(true),
    loadMoreNews,

    // === FILTROS (wrappers sincronizados) ===
    setSearchTerm,
    setCategory,
    setSource, // ✅ NOVO
    setFilters,
    clearFilters,

    // === PAGINAÇÃO ===
    setPage,
    nextPage,
    prevPage,

    // === CONFIGURAÇÕES ===
    setAutoRefresh,
    setRefreshInterval,
    setItemsPerPage,

    // === UTILITIES ===
    clearError,
    testAPI: testConnection,

    // === UTILITIES AVANÇADAS ===
    loadSpecificAmount,
    canLoadMoreFromCategory,
    getCurrentCategoryStats,
    getProgressInfo,

    // ✅ NOVOS: Específicos para filtros e fontes
    getSourceInfo,
    getCategoryInfo,
    filterSummary,
    activeFilterCount,
  }
}

// ===== HOOKS ESPECIALIZADOS =====

/**
 * Hook para controle de loading específico
 */
export const useNewsLoading = () => {
  const { loading, isLoadingMore } = useNewsStore()
  const selectors = useNewsSelectors()

  return {
    ...loading,
    ...selectors,
    isAnyLoading: selectors.isLoading || isLoadingMore,
    loadingStates: {
      initial: loading.initial,
      refresh: loading.refresh,
      pagination: loading.pagination,
      filter: loading.filter,
      loadingMore: isLoadingMore,
    },
  }
}

/**
 * ✅ RENOMEADO: Hook para filtros apenas (evita conflito)
 */
export const useNewsFiltersSimple = () => {
  const { setSearchTerm, setCategory, setSource, clearFilters } = useBasicFilters()
  const { hasActiveFilters, filters } = useBasicFilters()

  return {
    filters,
    hasActiveFilters,
    setSearchTerm,
    setCategory,
    setSource, // ✅ NOVO
    clearFilters,
    changeCategory: (category: string) => {
      setCategory(category)
      // Trigger reload if needed
      useNewsStore.getState().loadNewsByCategory(category, true)
    },
  }
}

/**
 * Hook especializado para carregamento incremental
 */
export const useInfiniteNews = () => {
  const { loadMoreNews, hasMore, isLoadingMore } = useNewsStore()
  const { canLoadMore, loadingStats } = useNewsSelectors()

  return {
    loadMore: loadMoreNews,
    hasMore,
    isLoading: isLoadingMore,
    canLoadMore,
    progress: loadingStats,
  }
}

/**
 * Hook especializado para estatísticas apenas
 */
export const useNewsStats = (): NewsStats => {
  const { stats, loadNews } = useNewsStore()
  const { hasNews } = useNewsSelectors()

  useEffect(() => {
    if (!hasNews) {
      loadNews()
    }
  }, [hasNews, loadNews])

  return stats
}

/**
 * ✅ NOVO: Hook específico para filtros de fonte (Yahoo Finance)
 */
export const useSourceFilters = () => {
  const { filters, setSource, getSourceInfo } = useBasicFilters()

  return {
    currentSource: filters.source || 'all',
    setSource,
    getSourceInfo,
    isYahooActive: filters.source === 'yahoo',
    isFMPActive: filters.source === 'fmp',
    isNewsAPIActive: filters.source === 'newsapi',
    isAlphaVantageActive: filters.source === 'alphavantage',
    isPolygonActive: filters.source === 'polygon',
    isAllSourcesActive: !filters.source || filters.source === 'all',
  }
}
