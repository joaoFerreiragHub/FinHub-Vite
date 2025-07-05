// src/components/noticias/api/useNews.ts - VERSÃO COMPLETA MELHORADA
import { useEffect } from 'react'
import {
  useNewsStore,
  useNewsSelectors,
  type NewsStats,
  type HealthCheckResponse,
} from '../../../stores/useNewsStore'

interface UseNewsOptions {
  autoLoad?: boolean
  autoRefresh?: boolean
  refreshInterval?: number
}

/**
 * Hook principal para notícias com funcionalidades melhoradas
 * Inclui carregamento incremental, filtros por categoria e paginação configurável
 */
export const useNews = (options: UseNewsOptions = {}) => {
  const {
    autoLoad = true,
    autoRefresh = true,
    refreshInterval = 10 * 60 * 1000, // 10 minutos
  } = options

  // === ESTADO DO STORE ===
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
    // 🆕 Novos campos do store
    hasMore,
    loadedItems,
    isLoadingMore,

    // Actions existentes
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

    // 🆕 Novas actions
    loadMoreNews,
    setItemsPerPage,
    loadNewsByCategory,
  } = useNewsStore()

  // === COMPUTED VALUES (inclui novos selectors) ===
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
    // 🆕 Novos selectors
    canLoadMore,
    loadingStats,
  } = useNewsSelectors()

  // === SETUP INICIAL ===
  useEffect(() => {
    // Configurar auto-refresh
    setAutoRefresh(autoRefresh)
    if (refreshInterval) {
      setRefreshInterval(refreshInterval)
    }
  }, [autoRefresh, refreshInterval, setAutoRefresh, setRefreshInterval])

  // === AUTO-LOAD (SEM DELAY!) ===
  useEffect(() => {
    if (autoLoad && (!hasNews || needsRefresh)) {
      console.log('🚀 Auto-load ativado - carregando imediatamente')
      loadNews()
    }
  }, [autoLoad, hasNews, needsRefresh, loadNews])

  // === VISIBILITY CHANGE (reload quando volta à aba) ===
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && needsRefresh) {
        console.log('👁️ Página voltou a ser visível - refresh automático')
        loadNews(true)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [needsRefresh, loadNews])

  // === COMPUTED PROPERTIES PARA COMPATIBILIDADE ===
  const lastUpdate = cache.lastUpdate ? new Date(cache.lastUpdate) : null

  // === 🆕 HANDLERS MELHORADOS ===

  /**
   * Carrega mais notícias (append às existentes)
   */
  const handleLoadMore = async () => {
    console.log('🔄 Carregando mais notícias...')
    try {
      await loadMoreNews()
    } catch (error) {
      console.error('❌ Erro ao carregar mais notícias:', error)
    }
  }

  /**
   * Muda para uma categoria específica e recarrega
   */
  const handleCategoryChange = async (category: string) => {
    console.log(`🏷️ Mudando para categoria: ${category}`)
    try {
      await loadNewsByCategory(category, true)
    } catch (error) {
      console.error('❌ Erro ao mudar categoria:', error)
    }
  }

  /**
   * Carrega mais notícias da categoria atual
   */
  const handleLoadMoreFromCategory = async (category?: string) => {
    const targetCategory = category || filters.category
    console.log(`🏷️ Carregando mais da categoria: ${targetCategory}`)
    try {
      await loadNewsByCategory(targetCategory, false)
    } catch (error) {
      console.error('❌ Erro ao carregar mais da categoria:', error)
    }
  }

  /**
   * Altera quantas notícias carregar por vez
   */
  const handleItemsPerPageChange = (count: number) => {
    console.log(`📊 Alterando items per page para: ${count}`)
    setItemsPerPage(count)
  }

  /**
   * Refresh completo das notícias
   */
  const handleRefresh = async () => {
    console.log('🔄 Refresh completo solicitado')
    try {
      await loadNews(true)
    } catch (error) {
      console.error('❌ Erro no refresh:', error)
    }
  }

  /**
   * Refresh de uma categoria específica
   */
  const handleRefreshCategory = async (category?: string) => {
    const targetCategory = category || filters.category
    console.log(`🔄 Refresh da categoria: ${targetCategory}`)
    try {
      await loadNewsByCategory(targetCategory, true)
    } catch (error) {
      console.error('❌ Erro no refresh da categoria:', error)
    }
  }

  // === RETURN INTERFACE COMPLETA ===
  return {
    // === DADOS ===
    news: filteredNews, // Retorna dados filtrados por padrão
    allNews: news, // Todos os dados sem filtro
    loading: isLoading, // ✅ Para compatibilidade com página atual
    error,
    lastUpdate,
    totalCount,
    stats,

    // === PAGINAÇÃO ===
    currentPage,
    totalPages,
    itemsPerPage,
    hasNextPage,
    hasPrevPage,

    // === STATUS (propriedades que a página precisa) ===
    isLoading,
    isInitialLoading,
    hasError,
    hasNews,
    isDataFresh,
    isEmpty,
    needsRefresh,
    hasActiveFilters,

    // === 🆕 NOVOS STATUS ===
    hasMore,
    isLoadingMore,
    loadedItems,
    canLoadMore,
    loadingStats,

    // === FILTROS ===
    filters,
    setSearchTerm,
    setCategory,
    setFilters,
    clearFilters,

    // === PAGINAÇÃO ACTIONS ===
    setPage,
    nextPage,
    prevPage,

    // === LOADING ACTIONS ===
    loadNews,
    refreshNews,
    clearError,

    // === 🆕 NOVAS ACTIONS ===
    loadMoreNews,
    setItemsPerPage,
    loadNewsByCategory,

    // === 🆕 HANDLERS MELHORADOS ===
    handleLoadMore,
    handleCategoryChange,
    handleLoadMoreFromCategory,
    handleItemsPerPageChange,
    handleRefresh,
    handleRefreshCategory,

    // === UTILITIES (propriedades que a página precisa) ===
    forceRefresh: () => loadNews(true), // Alias para loadNews(true)
    testAPI: (): Promise<HealthCheckResponse> => testConnection(),

    // === CONFIGURAÇÕES ===
    setAutoRefresh,
    setRefreshInterval,

    // === 🆕 UTILITIES AVANÇADAS ===

    /**
     * Carrega uma quantidade específica de notícias
     */
    loadSpecificAmount: async (count: number) => {
      const originalCount = itemsPerPage
      setItemsPerPage(count)
      await loadNews(true)
      setItemsPerPage(originalCount) // Restaurar valor original
    },

    /**
     * Verifica se pode carregar mais de uma categoria específica
     */
    canLoadMoreFromCategory: (category: string) => {
      return filters.category === category && canLoadMore
    },

    /**
     * Retorna estatísticas da categoria atual
     */
    getCurrentCategoryStats: () => {
      const currentCategory = filters.category
      return {
        category: currentCategory,
        loaded: loadedItems,
        total: totalCount,
        hasMore,
        percentage: loadingStats.percentage,
      }
    },

    /**
     * Retorna informações de progresso para UI
     */
    getProgressInfo: () => ({
      current: loadedItems,
      total: totalCount,
      remaining: loadingStats.remaining,
      percentage: loadingStats.percentage,
      isComplete: !hasMore,
      canLoadMore,
    }),
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
    // 🆕 Função melhorada para mudança de categoria
    changeCategory: (category: string) => loadNewsByCategory(category, true),
  }
}

/**
 * 🆕 Hook especializado para carregamento incremental
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

    /**
     * Hook para scroll infinito
     */
    useScrollTrigger: (threshold = 300) => {
      useEffect(() => {
        if (!canLoadMore) return

        const handleScroll = () => {
          const scrollTop = document.documentElement.scrollTop
          const scrollHeight = document.documentElement.scrollHeight
          const clientHeight = document.documentElement.clientHeight

          if (scrollTop + clientHeight >= scrollHeight - threshold) {
            loadMoreNews()
          }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
      }, [canLoadMore, threshold])
    },
  }
}

/**
 * 🆕 Hook para gestão de categorias
 */
export const useCategoryManager = () => {
  const { filters, loadNewsByCategory, stats } = useNewsStore()
  const { loadingStats } = useNewsSelectors()

  const categories = [
    { value: 'all', label: 'Todas as Categorias' },
    { value: 'market', label: 'Mercados' },
    { value: 'crypto', label: 'Criptomoedas' },
    { value: 'economy', label: 'Economia' },
    { value: 'earnings', label: 'Resultados' },
    { value: 'general', label: 'Geral' },
  ]

  return {
    currentCategory: filters.category,
    categories: categories.map((cat) => ({
      ...cat,
      count: stats.categories[cat.value] || 0,
      isActive: filters.category === cat.value,
    })),

    changeCategory: (category: string) => loadNewsByCategory(category, true),
    loadMoreFromCategory: (category: string) => loadNewsByCategory(category, false),

    categoryStats: {
      current: filters.category,
      loaded: loadingStats.loaded,
      total: loadingStats.total,
      percentage: loadingStats.percentage,
    },
  }
}
