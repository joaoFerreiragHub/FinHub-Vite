// src/stores/useNewsStore.ts - VERSÃO CORRIGIDA FINAL

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
  initial: boolean
  refresh: boolean
  pagination: boolean
  filter: boolean
}

// Interface para os parâmetros do newsApi.getNews
export interface GetNewsParams {
  limit?: number
  offset?: number
  sortBy?: string
  sortOrder?: string
  category?: string
  searchTerm?: string
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

// Type guards para validação de resposta da API
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

// Helper para verificar se valor é object não-null
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
  console.log('🔍 Extracting articles from response:', response)

  // Formato 1: Array direto
  if (isArrayResponse(response)) {
    console.log('✅ Formato: Array direto')
    return { articles: response, total: response.length }
  }

  // Formato 2: { articles: [...], total?: number }
  if (hasArticlesProperty(response)) {
    console.log('✅ Formato: { articles: [...] }')
    const obj = response as unknown as Record<string, unknown>
    const articles = obj.articles as NewsArticle[]
    const total = typeof obj.total === 'number' ? obj.total : articles.length
    return { articles, total }
  }

  // Formato 3: { data: { articles: [...] } }
  if (hasDataProperty(response)) {
    console.log('✅ Formato: { data: { articles: [...] } }')
    const obj = response as unknown as Record<string, unknown>
    const data = obj.data as Record<string, unknown>
    const articles = data.articles as NewsArticle[]
    const total = typeof data.total === 'number' ? data.total : articles.length
    return { articles, total }
  }

  // Formato 4: { success: true, data: [...] }
  if (hasSuccessProperty(response)) {
    console.log('✅ Formato: { success: true, data: [...] }')
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

  console.warn('⚠️ Formato de resposta não reconhecido:', response)
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
  refreshInterval: number

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

    // Filtro de pesquisa
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

          // Parâmetros para o newsApi
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

          console.log('📡 Chamando newsApi.getNews com params:', params)
          const result = await newsApi.getNews(params)

          console.log('📡 Resposta da API:', result)

          // Extrair artigos usando função type-safe
          const { articles, total } = extractArticlesFromResponse(result)

          console.log(`🔍 Processando resposta: ${articles.length} artigos encontrados`)

          // Validar se temos artigos válidos
          if (!Array.isArray(articles)) {
            console.error('❌ articles não é um array:', articles)
            throw new Error('Formato de resposta inválido: articles não é array')
          }

          // Filtrar artigos válidos usando type guard
          const validArticles = articles.filter(isValidNewsArticle)

          console.log(`✅ ${validArticles.length} artigos válidos de ${articles.length} totais`)

          if (validArticles.length > 0) {
            const filteredArticles = applyFilters(validArticles, state.filters)
            const newStats = calculateStats(validArticles)
            newStats.filteredCount = filteredArticles.length

            const now = new Date().toISOString()

            set(() => ({
              news: validArticles,
              filteredNews: filteredArticles,
              totalCount: total,
              stats: newStats,
              cache: {
                lastUpdate: now,
                isStale: false,
                nextRefresh: Date.now() + state.refreshInterval,
              },
              loading: initialLoadingState,
              error: null,
            }))

            console.log(`✅ ${validArticles.length} notícias carregadas com sucesso`)
            console.log('📊 Stats:', newStats)
            console.log('🔍 Primeira notícia:', validArticles[0])
          } else {
            console.warn('⚠️ Nenhum artigo válido encontrado')
            // Não tratar como erro, mas definir estado vazio
            set(() => ({
              news: [],
              filteredNews: [],
              totalCount: 0,
              stats: initialStats,
              loading: initialLoadingState,
              error: null,
            }))
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
          console.log('🧪 Testando conexão com API...')
          const startTime = Date.now()

          // Fazer um teste simples
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
