// src/stores/useNewsStore.ts - VERSÃO LIMPA APÓS REFATORAÇÃO

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { NewsArticle, NewsFilters } from '../types/news'
import { newsApi } from '../services/newsApi'

// ===== INTERFACES EXPORTADAS (MANTIDAS - usadas pelos hooks) =====
export interface NewsStats {
  totalNews: number
  filteredCount: number
  categories: Record<string, number>
  sources: number
  sentiments: {
    positive: number
    negative: number
    neutral: number
  }
}

export interface CacheInfo {
  lastUpdate: string | null
  isStale: boolean
  nextRefresh: number
}

export interface LoadingStates {
  initial: boolean
  refresh: boolean
  pagination: boolean
  filter: boolean
}

export interface GetNewsParams {
  limit?: number
  offset?: number
  sortBy?: string
  sortOrder?: string
  category?: string
  searchTerm?: string
  sources?: string[]
}

export interface HealthCheckResponse {
  status: 'healthy' | 'error' | 'degraded'
  timestamp: string
  latency?: number
  error?: string
  endpoint?: string
}

// ===== TYPE GUARDS E HELPERS (MANTIDOS - usados pelo store) =====
interface ApiResponseWithArticles {
  articles: NewsArticle[]
  total?: number
}

interface ApiResponseWithData {
  data: {
    articles: NewsArticle[]
    total?: number
  }
}

interface ApiResponseWithSuccess {
  success: boolean
  data: NewsArticle[] | { articles: NewsArticle[]; total?: number }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && value !== undefined && typeof value === 'object'
}

function isArrayResponse(response: unknown): response is NewsArticle[] {
  return Array.isArray(response)
}

function hasArticlesProperty(response: unknown): response is ApiResponseWithArticles {
  if (!isObject(response) || !('articles' in response)) {
    return false
  }
  const obj = response as Record<string, unknown>
  return Array.isArray(obj.articles)
}

function hasDataProperty(response: unknown): response is ApiResponseWithData {
  if (!isObject(response) || !('data' in response)) {
    return false
  }
  const obj = response as Record<string, unknown>
  const data = obj.data
  if (!isObject(data) || !('articles' in data)) {
    return false
  }
  const dataObj = data as Record<string, unknown>
  return Array.isArray(dataObj.articles)
}

function hasSuccessProperty(response: unknown): response is ApiResponseWithSuccess {
  if (!isObject(response) || !('success' in response) || !('data' in response)) {
    return false
  }
  const obj = response as Record<string, unknown>
  return obj.success === true
}

function extractArticlesFromResponse(response: unknown): {
  articles: NewsArticle[]
  total: number
} {
  // Formato 1: Array direto
  if (isArrayResponse(response)) {
    return { articles: response, total: response.length }
  }

  // Formato 2: { articles: [...], total?: number }
  if (hasArticlesProperty(response)) {
    const obj = response as unknown as Record<string, unknown>
    const articles = obj.articles as NewsArticle[]
    const total = typeof obj.total === 'number' ? obj.total : articles.length
    return { articles, total }
  }

  // Formato 3: { data: { articles: [...] } }
  if (hasDataProperty(response)) {
    const obj = response as unknown as Record<string, unknown>
    const data = obj.data as Record<string, unknown>
    const articles = data.articles as NewsArticle[]
    const total = typeof data.total === 'number' ? data.total : articles.length
    return { articles, total }
  }

  // Formato 4: { success: true, data: [...] }
  if (hasSuccessProperty(response)) {
    const obj = response as unknown as Record<string, unknown>
    const data = obj.data

    if (Array.isArray(data)) {
      return { articles: data as NewsArticle[], total: data.length }
    }
    if (isObject(data) && 'articles' in data) {
      const dataObj = data as Record<string, unknown>
      if (Array.isArray(dataObj.articles)) {
        const articles = dataObj.articles as NewsArticle[]
        const total = typeof dataObj.total === 'number' ? dataObj.total : articles.length
        return { articles, total }
      }
    }
  }

  return { articles: [], total: 0 }
}

function isValidNewsArticle(article: unknown): article is NewsArticle {
  if (!isObject(article)) {
    return false
  }
  const obj = article as unknown as NewsArticle
  return (
    typeof obj.id === 'string' &&
    typeof obj.title === 'string' &&
    obj.id.length > 0 &&
    obj.title.length > 0
  )
}

// ===== STORE INTERFACE (MANTIDA - usada pelos hooks) =====
interface NewsStore {
  // === ESTADO CORE ===
  news: NewsArticle[]
  filteredNews: NewsArticle[]
  loading: LoadingStates
  error: string | null
  stats: NewsStats
  cache: CacheInfo
  isOffline: boolean

  // === FILTROS E PAGINAÇÃO ===
  filters: NewsFilters
  currentPage: number
  itemsPerPage: number
  totalCount: number

  // === CONFIGURAÇÕES ===
  autoRefresh: boolean
  refreshInterval: number

  // === CARREGAMENTO INCREMENTAL ===
  hasMore: boolean
  loadedItems: number
  isLoadingMore: boolean

  // === ACTIONS CORE (usadas pelos hooks especializados) ===
  loadNews: (forceRefresh?: boolean) => Promise<void>
  refreshNews: () => Promise<void>
  loadMoreNews: () => Promise<void>
  loadNewsByCategory: (category: string, reset?: boolean) => Promise<void>

  // === FILTROS ===
  setFilters: (filters: Partial<NewsFilters>) => void
  setSearchTerm: (searchTerm: string) => void
  setCategory: (category: string) => void
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
  clearCache: () => void
  isDataFresh: () => boolean
  testConnection: () => Promise<HealthCheckResponse>
}

// ===== CONSTANTES =====
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos
const DEFAULT_REFRESH_INTERVAL = 10 * 60 * 1000 // 10 minutos
const DEFAULT_ITEMS_PER_PAGE = 50 // Aumentado de 20 para 50

const initialLoadingState: LoadingStates = {
  initial: false,
  refresh: false,
  pagination: false,
  filter: false,
}

const initialStats: NewsStats = {
  totalNews: 0,
  filteredCount: 0,
  categories: {},
  sources: 0,
  sentiments: { positive: 0, negative: 0, neutral: 0 },
}

// ===== HELPER FUNCTIONS (MANTIDAS - usadas pelo store) =====
const calculateStats = (articles: NewsArticle[]): NewsStats => {
  const categories = articles.reduce(
    (acc, article) => {
      const cat = article.category || 'other'
      acc[cat] = (acc[cat] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const sentiments = articles.reduce(
    (acc, article) => {
      const sentiment = article.sentiment || 'neutral'
      acc[sentiment as keyof typeof acc] = (acc[sentiment as keyof typeof acc] || 0) + 1
      return acc
    },
    { positive: 0, negative: 0, neutral: 0 },
  )

  const uniqueSources = new Set(articles.map((a) => a.source || 'unknown')).size

  return {
    totalNews: articles.length,
    filteredCount: articles.length,
    categories,
    sources: uniqueSources,
    sentiments,
  }
}

export const applyFilters = (articles: NewsArticle[], filters: NewsFilters): NewsArticle[] => {
  const matchesSource = (articleSource: string, selectedSource: string): boolean => {
    const normalizedSource = selectedSource.toLowerCase().trim()
    const normalizedArticleSource = articleSource.toLowerCase().trim()

    if (normalizedSource === normalizedArticleSource) return true
    if (normalizedSource === 'yahoo') return normalizedArticleSource.includes('yahoo')
    if (normalizedSource === 'fmp') return normalizedArticleSource.includes('fmp')
    if (normalizedSource === 'newsapi') return normalizedArticleSource.includes('newsapi')
    if (normalizedSource === 'alphavantage') return normalizedArticleSource.includes('alpha')
    if (normalizedSource === 'polygon') return normalizedArticleSource.includes('polygon')

    return normalizedArticleSource.includes(normalizedSource)
  }

  return articles.filter((article) => {
    // Filtro de categoria
    if (filters.category && filters.category !== 'all' && article.category !== filters.category) {
      return false
    }

    // Filtro de pesquisa
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      const titleMatch = article.title.toLowerCase().includes(searchLower)
      const summaryMatch = article.summary?.toLowerCase().includes(searchLower)
      if (!titleMatch && !summaryMatch) return false
    }

    // Filtro de fonte
    if (
      filters.source &&
      filters.source !== 'all' &&
      !matchesSource(article.source || '', filters.source)
    ) {
      return false
    }

    return true
  })
}

const isDataStale = (lastUpdate: string | null): boolean => {
  if (!lastUpdate) return true
  const updateTime = new Date(lastUpdate).getTime()
  return Date.now() - updateTime > CACHE_DURATION
}

// ===== STORE PRINCIPAL (CORE - usado por todos os hooks) =====
export const useNewsStore = create<NewsStore>()(
  persist(
    (set, get) => ({
      // === ESTADO INICIAL ===
      news: [],
      filteredNews: [],
      loading: initialLoadingState,
      error: null,
      stats: initialStats,
      cache: {
        lastUpdate: null,
        isStale: true,
        nextRefresh: 0,
      },
      isOffline: false,

      // === FILTROS E PAGINAÇÃO ===
      filters: {
        category: 'all',
        searchTerm: '',
        source: undefined,
      },
      currentPage: 1,
      itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
      totalCount: 0,

      // === CONFIGURAÇÕES ===
      autoRefresh: true,
      refreshInterval: DEFAULT_REFRESH_INTERVAL,

      // === CARREGAMENTO INCREMENTAL ===
      hasMore: true,
      loadedItems: 0,
      isLoadingMore: false,

      // === ACTIONS PRINCIPAIS ===
      loadNews: async (forceRefresh = false) => {
        const state = get()

        // Verificar se precisamos carregar
        if (!forceRefresh && state.news.length > 0 && !isDataStale(state.cache.lastUpdate)) {
          return
        }

        // Determinar tipo de loading
        const isInitial = state.news.length === 0
        const loadingKey = isInitial ? 'initial' : 'refresh'

        set((prevState) => ({
          loading: { ...prevState.loading, [loadingKey]: true },
          error: null,
        }))

        try {
          const offset = (state.currentPage - 1) * state.itemsPerPage

          const params: GetNewsParams = {
            limit: state.itemsPerPage,
            offset,
            sortBy: 'publishedDate',
            sortOrder: 'desc',
          }

          // Aplicar filtros
          if (state.filters.category && state.filters.category !== 'all') {
            params.category = state.filters.category
          }
          if (state.filters.searchTerm) {
            params.searchTerm = state.filters.searchTerm
          }

          const result = await newsApi.getNews(params)
          const { articles, total } = extractArticlesFromResponse(result)
          const validArticles = articles.filter(isValidNewsArticle)

          if (validArticles.length > 0) {
            const filteredArticles = applyFilters(validArticles, state.filters)
            const newStats = calculateStats(validArticles)
            newStats.filteredCount = filteredArticles.length

            const hasMore = total > validArticles.length

            set(() => ({
              news: validArticles,
              filteredNews: filteredArticles,
              totalCount: total,
              loadedItems: validArticles.length,
              hasMore,
              stats: newStats,
              cache: {
                lastUpdate: new Date().toISOString(),
                isStale: false,
                nextRefresh: Date.now() + state.refreshInterval,
              },
              loading: initialLoadingState,
              error: null,
              isOffline: false,
            }))
          } else {
            set(() => ({
              news: [],
              filteredNews: [],
              totalCount: 0,
              loadedItems: 0,
              hasMore: false,
              stats: initialStats,
              loading: initialLoadingState,
              error: null,
              isOffline: false,
            }))
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar notícias'
          const isOfflineError = errorMessage.startsWith('OFFLINE:')

          // Se offline e temos cache, usar cache
          if (isOfflineError && state.news.length > 0) {
            // Silenciar erro, apenas marcar como offline
            console.warn('📡 API offline - usando dados em cache')
            set(() => ({
              loading: initialLoadingState,
              error: null,
              isOffline: true,
            }))
          } else if (isOfflineError && state.news.length === 0) {
            // Offline sem cache - mostrar erro mas não spam
            console.warn('📡 API offline - sem dados em cache')
            set(() => ({
              loading: initialLoadingState,
              error: 'Sem conexão com o servidor. Tente novamente mais tarde.',
              isOffline: true,
            }))
          } else {
            // Erro real (não offline)
            set(() => ({
              loading: initialLoadingState,
              error: errorMessage,
              isOffline: false,
            }))
          }
        }
      },

      loadMoreNews: async () => {
        const state = get()

        if (state.isLoadingMore || !state.hasMore) {
          return
        }

        set({ isLoadingMore: true, error: null })

        try {
          const params: GetNewsParams = {
            limit: state.itemsPerPage,
            offset: state.loadedItems,
            sortBy: 'publishedDate',
            sortOrder: 'desc',
          }

          if (state.filters.category && state.filters.category !== 'all') {
            params.category = state.filters.category
          }
          if (state.filters.searchTerm) {
            params.searchTerm = state.filters.searchTerm
          }

          const result = await newsApi.getNews(params)
          const { articles, total } = extractArticlesFromResponse(result)
          const validArticles = articles.filter(isValidNewsArticle)

          if (validArticles.length > 0) {
            const newAllNews = [...state.news, ...validArticles]
            const newFilteredNews = applyFilters(newAllNews, state.filters)
            const newStats = calculateStats(newAllNews)
            newStats.filteredCount = newFilteredNews.length

            const newLoadedItems = state.loadedItems + validArticles.length
            const hasMore = total > newLoadedItems

            set(() => ({
              news: newAllNews,
              filteredNews: newFilteredNews,
              loadedItems: newLoadedItems,
              hasMore,
              stats: newStats,
              isLoadingMore: false,
              isOffline: false,
              cache: {
                ...state.cache,
                lastUpdate: new Date().toISOString(),
              },
            }))
          } else {
            set({ isLoadingMore: false, hasMore: false })
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Erro ao carregar mais notícias'
          const isOfflineError = errorMessage.startsWith('OFFLINE:')

          if (isOfflineError) {
            // Offline - silenciar erro
            console.warn('📡 API offline - não é possível carregar mais')
            set({ isLoadingMore: false, isOffline: true })
          } else {
            set({
              isLoadingMore: false,
              error: errorMessage,
              isOffline: false,
            })
          }
        }
      },

      loadNewsByCategory: async (category: string, reset = true) => {
        const state = get()

        if (reset) {
          set({
            filters: { ...state.filters, category },
            loading: { ...state.loading, filter: true },
            error: null,
          })
          await get().loadNews(true)
        } else {
          if (state.filters.category !== category) {
            return get().loadNewsByCategory(category, true)
          }
          await get().loadMoreNews()
        }
      },

      refreshNews: async () => {
        await get().loadNews(true)
      },

      // === FILTROS ===
      setFilters: (newFilters) => {
        set((state) => {
          const updatedFilters = { ...state.filters, ...newFilters }
          const filteredArticles = applyFilters(state.news, updatedFilters)

          return {
            filters: updatedFilters,
            filteredNews: filteredArticles,
            currentPage: 1,
            stats: {
              ...state.stats,
              filteredCount: filteredArticles.length,
            },
          }
        })
      },

      setSearchTerm: (searchTerm) => {
        get().setFilters({ searchTerm })
      },

      setCategory: (category) => {
        get().setFilters({ category })
      },

      clearFilters: () => {
        set((state) => ({
          filters: {
            category: 'all',
            searchTerm: '',
            source: undefined,
          },
          filteredNews: state.news,
          currentPage: 1,
          stats: {
            ...state.stats,
            filteredCount: state.news.length,
          },
        }))
      },

      // === PAGINAÇÃO ===
      setPage: (page) => {
        set({ currentPage: page })
        get().loadNews()
      },

      nextPage: () => {
        const state = get()
        const totalPages = Math.ceil(state.totalCount / state.itemsPerPage)
        if (state.currentPage < totalPages) {
          get().setPage(state.currentPage + 1)
        }
      },

      prevPage: () => {
        const state = get()
        if (state.currentPage > 1) {
          get().setPage(state.currentPage - 1)
        }
      },

      // === CONFIGURAÇÕES ===
      setAutoRefresh: (enabled) => {
        set({ autoRefresh: enabled })
      },

      setRefreshInterval: (interval) => {
        set({ refreshInterval: interval })
      },

      setItemsPerPage: (count) => {
        set({ itemsPerPage: count })
        get().loadNews(true)
      },

      // === UTILITIES ===
      clearError: () => {
        set({ error: null })
      },

      clearCache: () => {
        set({
          news: [],
          filteredNews: [],
          cache: {
            lastUpdate: null,
            isStale: true,
            nextRefresh: 0,
          },
          stats: initialStats,
          hasMore: true,
          loadedItems: 0,
          isLoadingMore: false,
        })
      },

      isDataFresh: () => {
        const state = get()
        return !isDataStale(state.cache.lastUpdate)
      },

      testConnection: async (): Promise<HealthCheckResponse> => {
        try {
          const startTime = Date.now()
          await newsApi.getNews({ limit: 1 })
          const latency = Date.now() - startTime

          return {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            latency,
          }
        } catch (error) {
          return {
            status: 'error',
            error: error instanceof Error ? error.message : 'Connection test failed',
            timestamp: new Date().toISOString(),
          }
        }
      },
    }),
    {
      name: 'finhub-news-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        news: state.news,
        filters: state.filters,
        currentPage: state.currentPage,
        cache: state.cache,
        autoRefresh: state.autoRefresh,
        refreshInterval: state.refreshInterval,
        hasMore: state.hasMore,
        loadedItems: state.loadedItems,
        isOffline: state.isOffline,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          const needsRefresh = isDataStale(state.cache.lastUpdate)

          setTimeout(() => {
            const { setState } = useNewsStore
            setState((currentState: NewsStore) => ({
              ...currentState,
              cache: {
                ...state.cache,
                isStale: needsRefresh,
              },
              filteredNews: applyFilters(state.news, state.filters),
            }))

            if (needsRefresh && state.autoRefresh) {
              setTimeout(() => {
                useNewsStore.getState().loadNews(true)
              }, 1000)
            }
          }, 100)
        }
      },
    },
  ),
)

// ===== SELECTORS (MANTIDOS - usados pelos hooks especializados) =====
export const useNewsSelectors = () => {
  const store = useNewsStore()

  return {
    // Status helpers
    isLoading: Object.values(store.loading).some(Boolean),
    isInitialLoading: store.loading.initial,
    hasError: !!store.error,
    hasNews: store.news.length > 0,
    isDataFresh: store.isDataFresh(),
    isOffline: store.isOffline,

    // Pagination helpers
    totalPages: Math.ceil(store.totalCount / store.itemsPerPage),
    hasNextPage: store.currentPage * store.itemsPerPage < store.totalCount,
    hasPrevPage: store.currentPage > 1,

    // Filter status
    hasActiveFilters:
      store.filters.category !== 'all' || !!store.filters.searchTerm || !!store.filters.source,

    // Data helpers
    isEmpty: store.news.length === 0 && !Object.values(store.loading).some(Boolean),
    needsRefresh: isDataStale(store.cache.lastUpdate),

    // Carregamento incremental
    hasMore: store.hasMore,
    isLoadingMore: store.isLoadingMore,
    loadedItems: store.loadedItems,
    canLoadMore:
      store.hasMore && !store.isLoadingMore && !Object.values(store.loading).some(Boolean),

    // Stats de carregamento
    loadingStats: {
      loaded: store.loadedItems,
      total: store.totalCount,
      remaining: store.totalCount - store.loadedItems,
      percentage:
        store.totalCount > 0 ? Math.round((store.loadedItems / store.totalCount) * 100) : 0,
    },
  }
}
