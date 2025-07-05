// src/components/noticias/api/useNews.ts - VERSÃO CORRIGIDA
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
 * Hook principal para notícias
 * Usa o store global com fallback para mock data
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
    // ❌ REMOVER: hasNews, - já não existe no store

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
  } = useNewsStore()

  // === COMPUTED VALUES (inclui hasNews correto) ===
  const {
    isLoading,
    isInitialLoading,
    hasError,
    hasNews, // ✅ AGORA vem do selector correto
    isDataFresh,
    totalPages,
    hasNextPage,
    hasPrevPage,
    hasActiveFilters,
    isEmpty,
    needsRefresh,
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

  // === RETURN INTERFACE (compatível com página existente) ===
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
    hasNews, // ✅ AGORA vem do selector correto
    isDataFresh,
    isEmpty,
    needsRefresh,
    hasActiveFilters,

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

    // === UTILITIES (propriedades que a página precisa) ===
    forceRefresh: () => loadNews(true), // Alias para loadNews(true)
    testAPI: (): Promise<HealthCheckResponse> => testConnection(),

    // === CONFIGURAÇÕES ===
    setAutoRefresh,
    setRefreshInterval,
  }
}

/**
 * Hook especializado para estatísticas apenas
 */
export const useNewsStats = (): NewsStats => {
  const { stats, loadNews } = useNewsStore()
  const { hasNews } = useNewsSelectors() // ✅ CORRETO - vem do selector

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
  const { loading } = useNewsStore()
  const selectors = useNewsSelectors()

  return {
    ...loading,
    ...selectors,
    isAnyLoading: selectors.isLoading,
  }
}

/**
 * Hook para filtros apenas
 */
export const useNewsFilters = () => {
  const { filters, setSearchTerm, setCategory, setFilters, clearFilters } = useNewsStore()

  const { hasActiveFilters } = useNewsSelectors()

  return {
    filters,
    hasActiveFilters,
    setSearchTerm,
    setCategory,
    setFilters,
    clearFilters,
  }
}
