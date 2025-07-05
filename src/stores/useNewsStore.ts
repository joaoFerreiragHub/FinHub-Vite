// src/stores/useNewsStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { NewsArticle, NewsFilters } from '../types/news'
import { newsApi } from '../components/noticias/api/newsApi'

// ===== INTERFACES EXPORTADAS =====
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
  initial: boolean // Primeiro carregamento
  refresh: boolean // Refresh manual
  pagination: boolean // Mudança de página
  filter: boolean // Mudança de filtros
}

// Interface para os parâmetros do newsApi.getNews
export interface GetNewsParams {
  limit?: number
  offset?: number
  sortBy?: string
  sortOrder?: string
  category?: string
  searchTerm?: string // Mudança: era 'search', agora é 'searchTerm' como no NewsFilters
  sources?: string[]
}

// Interface para resposta de health check
export interface HealthCheckResponse {
  status: 'healthy' | 'error' | 'degraded'
  timestamp: string
  latency?: number
  error?: string
  endpoint?: string
}

interface NewsStore {
  // === ESTADO ===
  news: NewsArticle[]
  filteredNews: NewsArticle[]
  loading: LoadingStates
  error: string | null
  stats: NewsStats
  cache: CacheInfo

  // === FILTROS E PAGINAÇÃO ===
  filters: NewsFilters
  currentPage: number
  itemsPerPage: number
  totalCount: number

  // === CONFIGURAÇÕES ===
  autoRefresh: boolean
  refreshInterval: number // em ms

  // === COMPUTED PROPERTIES ===
  hasNews: boolean

  // === ACTIONS PRINCIPAIS ===
  loadNews: (forceRefresh?: boolean) => Promise<void>
  refreshNews: () => Promise<void>

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

  // === UTILITIES ===
  clearError: () => void
  clearCache: () => void
  isDataFresh: () => boolean
  testConnection: () => Promise<HealthCheckResponse>
}

// ===== CONSTANTES =====
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos
const DEFAULT_REFRESH_INTERVAL = 10 * 60 * 1000 // 10 minutos
const DEFAULT_ITEMS_PER_PAGE = 20

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

// ===== HELPERS =====
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

const applyFilters = (articles: NewsArticle[], filters: NewsFilters): NewsArticle[] => {
  return articles.filter((article) => {
    // Filtro de categoria
    if (filters.category && filters.category !== 'all' && article.category !== filters.category) {
      return false
    }

    // Filtro de pesquisa - usar 'summary' em vez de 'description'
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      const titleMatch = article.title.toLowerCase().includes(searchLower)
      const summaryMatch = article.summary?.toLowerCase().includes(searchLower)
      if (!titleMatch && !summaryMatch) return false
    }

    // Filtro de fonte
    if (filters.source && article.source !== filters.source) {
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

// ===== STORE PRINCIPAL =====
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

      // === COMPUTED PROPERTIES ===
      get hasNews() {
        return get().news.length > 0
      },

      // === LOAD NEWS ===
      loadNews: async (forceRefresh = false) => {
        const state = get()

        // Verificar se precisamos carregar
        if (!forceRefresh && state.news.length > 0 && !isDataStale(state.cache.lastUpdate)) {
          console.log('📰 Dados ainda frescos, pulando carregamento')
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
          console.log('📰 Carregando notícias...')

          const offset = (state.currentPage - 1) * state.itemsPerPage

          // Parâmetros corretos baseados na interface do newsApi
          const params: GetNewsParams = {
            limit: state.itemsPerPage,
            offset,
            sortBy: 'publishedDate',
            sortOrder: 'desc',
          }

          // Adicionar filtros opcionais
          if (state.filters.category && state.filters.category !== 'all') {
            params.category = state.filters.category
          }

          if (state.filters.searchTerm) {
            params.searchTerm = state.filters.searchTerm
          }

          const result = await newsApi.getNews(params)

          if (result?.articles) {
            const newArticles = result.articles
            const filteredArticles = applyFilters(newArticles, state.filters)
            const newStats = calculateStats(newArticles)
            newStats.filteredCount = filteredArticles.length

            const now = new Date().toISOString()

            set(() => ({
              news: newArticles,
              filteredNews: filteredArticles,
              totalCount: result.total || 0,
              stats: newStats,
              cache: {
                lastUpdate: now,
                isStale: false,
                nextRefresh: Date.now() + state.refreshInterval,
              },
              loading: initialLoadingState,
              error: null,
            }))

            console.log(`✅ ${newArticles.length} notícias carregadas`)
          } else {
            throw new Error('Formato de resposta inválido')
          }
        } catch (error) {
          console.error('❌ Erro ao carregar notícias:', error)
          set(() => ({
            loading: initialLoadingState,
            error:
              error instanceof Error ? error.message : 'Erro desconhecido ao carregar notícias',
          }))
        }
      },

      // === REFRESH NEWS ===
      refreshNews: async () => {
        console.log('🔄 Refresh manual solicitado')
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
            currentPage: 1, // Reset page when filters change
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
        // Carregar nova página se necessário
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
        })
      },

      isDataFresh: () => {
        const state = get()
        return !isDataStale(state.cache.lastUpdate)
      },

      testConnection: async (): Promise<HealthCheckResponse> => {
        try {
          // Usar método existente do newsApi se disponível
          if (typeof newsApi.testConnection === 'function') {
            const result = await newsApi.testConnection()

            // Garantir que o resultado está no formato correto usando type assertion
            if (typeof result === 'object' && result !== null) {
              const healthResult = result as Record<string, unknown>
              return {
                status: (healthResult.status as 'healthy' | 'error' | 'degraded') || 'healthy',
                timestamp: (healthResult.timestamp as string) || new Date().toISOString(),
                latency: healthResult.latency as number | undefined,
                error: healthResult.error as string | undefined,
                endpoint: healthResult.endpoint as string | undefined,
              }
            }
          }

          // Fallback: fazer uma chamada simples para testar conectividade
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
      // Não persistir loading states e alguns dados temporários
      partialize: (state) => ({
        news: state.news,
        filters: state.filters,
        currentPage: state.currentPage,
        cache: state.cache,
        autoRefresh: state.autoRefresh,
        refreshInterval: state.refreshInterval,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Verificar se dados precisam refresh após hidratação
          const needsRefresh = isDataStale(state.cache.lastUpdate)

          // Corrigir: usar set da store em vez de função externa
          const { setState } = useNewsStore
          setState((currentState: NewsStore) => ({
            ...currentState,
            cache: {
              ...state.cache,
              isStale: needsRefresh,
            },
            filteredNews: applyFilters(state.news, state.filters),
          }))

          // Auto-refresh se dados estão stale
          if (needsRefresh && state.autoRefresh) {
            setTimeout(() => {
              useNewsStore.getState().loadNews(true)
            }, 1000) // Delay pequeno para evitar race conditions
          }
        }
      },
    },
  ),
)

// ===== AUTO-REFRESH SYSTEM =====
let refreshIntervalId: NodeJS.Timeout | null = null

// Configurar auto-refresh quando store é inicializado
if (typeof window !== 'undefined') {
  // Corrigir: usar API correta do Zustand para subscriptions
  useNewsStore.subscribe((state) => {
    if (refreshIntervalId) {
      clearInterval(refreshIntervalId)
      refreshIntervalId = null
    }

    if (state.autoRefresh) {
      refreshIntervalId = setInterval(() => {
        const currentState = useNewsStore.getState()
        if (isDataStale(currentState.cache.lastUpdate)) {
          console.log('🔄 Auto-refresh ativado')
          currentState.loadNews(true)
        }
      }, state.refreshInterval)
    }
  })
}

// ===== COMPUTED VALUES (SELECTORS) =====
export const useNewsSelectors = () => {
  const store = useNewsStore()

  return {
    // Status helpers
    isLoading: Object.values(store.loading).some(Boolean),
    isInitialLoading: store.loading.initial,
    hasError: !!store.error,
    hasNews: store.hasNews,
    isDataFresh: store.isDataFresh(),

    // Pagination helpers
    totalPages: Math.ceil(store.totalCount / store.itemsPerPage),
    hasNextPage: store.currentPage * store.itemsPerPage < store.totalCount,
    hasPrevPage: store.currentPage > 1,

    // Filter status
    hasActiveFilters:
      store.filters.category !== 'all' || !!store.filters.searchTerm || !!store.filters.source,

    // Data helpers
    isEmpty: !store.hasNews && !Object.values(store.loading).some(Boolean),
    needsRefresh: isDataStale(store.cache.lastUpdate),
  }
}
