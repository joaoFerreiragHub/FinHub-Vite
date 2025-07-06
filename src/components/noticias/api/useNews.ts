// src/components/noticias/api/useNews.ts - VERSÃO LIMPA E SIMPLIFICADA

import { useEffect } from 'react'
import {
  useNewsStore,
  useNewsSelectors,
  type NewsStats,
  type HealthCheckResponse,
} from '../../../stores/useNewsStore'
import { NewsArticle, NewsFilters } from '../../../types/news'

// ===== INTERFACES =====
interface UseNewsOptions {
  autoLoad?: boolean
  autoRefresh?: boolean
  refreshInterval?: number
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
    filters,
    currentPage,
    totalCount,
    itemsPerPage,
    hasMore,
    loadedItems,
    isLoadingMore,
    // Actions
    loadNews,
    refreshNews,
    setSearchTerm,
    setCategory,
    setFilters,
    clearFilters,
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

  // === SELECTORS ===
  const {
    isLoading,
    isInitialLoading,
    hasError,
    hasNews,
    isDataFresh,
    totalPages,
    hasNextPage,
    hasPrevPage,
    hasActiveFilters,
    isEmpty,
    needsRefresh,
    canLoadMore,
    loadingStats,
  } = useNewsSelectors()

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

  // === UTILITIES AVANÇADAS ===
  const loadSpecificAmount = async (count: number) => {
    const originalCount = itemsPerPage
    setItemsPerPage(count)
    await loadNews(true)
    setItemsPerPage(originalCount)
  }

  const canLoadMoreFromCategory = (category: string) => {
    return filters.category === category && canLoadMore
  }

  const getCurrentCategoryStats = () => ({
    category: filters.category,
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

    // === FILTROS ===
    filters,
    hasActiveFilters,

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

    // === FILTROS ===
    setSearchTerm,
    setCategory,
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
 * Hook para filtros apenas
 */
export const useNewsFilters = () => {
  const { filters, setSearchTerm, setCategory, setFilters, clearFilters, loadNewsByCategory } =
    useNewsStore()
  const { hasActiveFilters } = useNewsSelectors()

  return {
    filters,
    hasActiveFilters,
    setSearchTerm,
    setCategory,
    setFilters,
    clearFilters,
    changeCategory: (category: string) => loadNewsByCategory(category, true),
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
