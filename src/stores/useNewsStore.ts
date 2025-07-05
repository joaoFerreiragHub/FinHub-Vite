// src/stores/useNewsStore.ts - VERSÃO COMPLETA COM FUNCIONALIDADES MELHORADAS

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
  console.log('🔥 DEBUG extractArticlesFromResponse recebeu:', response)
  console.log('🔥 DEBUG tipo da response:', typeof response)
  console.log('🔥 DEBUG é object?', isObject(response))
  console.log('🔥 DEBUG é array?', Array.isArray(response))

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
    console.log('🔥 DEBUG articles extraídos:', articles.length)
    console.log('🔥 DEBUG total extraído:', total)
    return { articles, total }
  }

  // Formato 3: { data: { articles: [...] } }
  if (hasDataProperty(response)) {
    console.log('✅ Formato: { data: { articles: [...] } }')
    const obj = response as unknown as Record<string, unknown>
    const data = obj.data as Record<string, unknown>
    const articles = data.articles as NewsArticle[]
    const total = typeof data.total === 'number' ? data.total : articles.length
    console.log('🔥 DEBUG articles extraídos do data:', articles.length)
    console.log('🔥 DEBUG total extraído do data:', total)
    return { articles, total }
  }

  // Formato 4: { success: true, data: [...] }
  if (hasSuccessProperty(response)) {
    console.log('✅ Formato: { success: true, data: [...] }')
    const obj = response as unknown as Record<string, unknown>
    const data = obj.data

    console.log('🔥 DEBUG data dentro de success:', data)
    console.log('🔥 DEBUG tipo do data:', typeof data)
    console.log('🔥 DEBUG data é array?', Array.isArray(data))

    if (Array.isArray(data)) {
      console.log('🔥 DEBUG data é array direto com', data.length, 'items')
      return { articles: data as NewsArticle[], total: data.length }
    }
    if (isObject(data) && 'articles' in data) {
      console.log('🔥 DEBUG data é object com articles')
      const dataObj = data as Record<string, unknown>
      if (Array.isArray(dataObj.articles)) {
        const articles = dataObj.articles as NewsArticle[]
        const total = typeof dataObj.total === 'number' ? dataObj.total : articles.length
        console.log('🔥 DEBUG articles extraídos do success.data:', articles.length)
        console.log('🔥 DEBUG total extraído do success.data:', total)
        return { articles, total }
      }
    }
  }

  console.warn('⚠️ Formato de resposta não reconhecido:', response)
  console.log('🔥 DEBUG hasArticlesProperty?', hasArticlesProperty(response))
  console.log('🔥 DEBUG hasDataProperty?', hasDataProperty(response))
  console.log('🔥 DEBUG hasSuccessProperty?', hasSuccessProperty(response))

  return { articles: [], total: 0 }
}

function isValidNewsArticle(article: unknown): article is NewsArticle {
  if (!isObject(article)) {
    console.log('🔥 DEBUG artigo inválido - não é object:', article)
    return false
  }

  const obj = article as unknown as NewsArticle
  const isValid =
    typeof obj.id === 'string' &&
    typeof obj.title === 'string' &&
    obj.id.length > 0 &&
    obj.title.length > 0

  if (!isValid) {
    console.log('🔥 DEBUG artigo inválido - campos em falta:', {
      id: typeof obj.id,
      title: typeof obj.title,
      idLength: obj.id?.length,
      titleLength: obj.title?.length,
    })
  }

  return isValid
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

  // === 🆕 NOVAS PROPRIEDADES ===
  hasMore: boolean
  loadedItems: number
  isLoadingMore: boolean

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

  // === 🆕 NOVAS AÇÕES ===
  loadMoreNews: () => Promise<void>
  setItemsPerPage: (count: number) => void
  loadNewsByCategory: (category: string, reset?: boolean) => Promise<void>
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
  console.log('🔥 DEBUG calculateStats com', articles.length, 'artigos')

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

  const stats = {
    totalNews: articles.length,
    filteredCount: articles.length,
    categories,
    sources: uniqueSources,
    sentiments,
  }

  console.log('🔥 DEBUG stats calculadas:', stats)
  return stats
}

const applyFilters = (articles: NewsArticle[], filters: NewsFilters): NewsArticle[] => {
  console.log('🔥 DEBUG applyFilters com', articles.length, 'artigos e filtros:', filters)

  const filtered = articles.filter((article) => {
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

  console.log('🔥 DEBUG filtros aplicados:', filtered.length, 'artigos restantes')
  return filtered
}

const isDataStale = (lastUpdate: string | null): boolean => {
  if (!lastUpdate) return true
  const updateTime = new Date(lastUpdate).getTime()
  const isStale = Date.now() - updateTime > CACHE_DURATION
  console.log('🔥 DEBUG isDataStale:', { lastUpdate, isStale, timeSince: Date.now() - updateTime })
  return isStale
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

      // === 🆕 NOVO ESTADO ===
      hasMore: true,
      loadedItems: 0,
      isLoadingMore: false,

      // === LOAD NEWS MELHORADO ===
      loadNews: async (forceRefresh = false) => {
        console.log('🔥 DEBUG loadNews INICIADA')
        const state = get()

        console.log('🔥 DEBUG loadNews estado inicial:', {
          forceRefresh,
          newsCount: state.news.length,
          isStale: isDataStale(state.cache.lastUpdate),
          lastUpdate: state.cache.lastUpdate,
          filters: state.filters,
          currentPage: state.currentPage,
        })

        // Verificar se precisamos carregar
        if (!forceRefresh && state.news.length > 0 && !isDataStale(state.cache.lastUpdate)) {
          console.log('📰 Dados ainda frescos, pulando carregamento')
          return
        }

        console.log('🔥 DEBUG prosseguindo com carregamento...')

        // Determinar tipo de loading
        const isInitial = state.news.length === 0
        const loadingKey = isInitial ? 'initial' : 'refresh'

        console.log('🔥 DEBUG definindo loading:', { isInitial, loadingKey })

        set((prevState) => ({
          loading: { ...prevState.loading, [loadingKey]: true },
          error: null,
        }))

        try {
          console.log('📰 Carregando notícias...')

          const offset = 0 // Reset para início nas novas implementações

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

          console.log('🔥 DEBUG parâmetros finais para API:', params)
          console.log('📡 Chamando newsApi.getNews com params:', params)

          const result = await newsApi.getNews(params)

          console.log('🔥 DEBUG resposta RAW da newsApi.getNews:', result)
          console.log('🔥 DEBUG tipo da resposta:', typeof result)
          console.log('🔥 DEBUG é array?', Array.isArray(result))
          console.log(
            '🔥 DEBUG keys da resposta:',
            isObject(result) ? Object.keys(result) : 'não é object',
          )

          // Extrair artigos usando função type-safe
          const { articles, total } = extractArticlesFromResponse(result)

          console.log('🔥 DEBUG após extractArticlesFromResponse:')
          console.log('🔥 DEBUG articles:', articles)
          console.log('🔥 DEBUG articles.length:', articles.length)
          console.log('🔥 DEBUG total:', total)
          console.log('🔥 DEBUG primeiro artigo:', articles[0])

          console.log(`🔍 Processando resposta: ${articles.length} artigos encontrados`)

          // Validar se temos artigos válidos
          if (!Array.isArray(articles)) {
            console.error('❌ articles não é um array:', articles)
            throw new Error('Formato de resposta inválido: articles não é array')
          }

          console.log('🔥 DEBUG iniciando validação de artigos...')

          // Filtrar artigos válidos usando type guard
          const validArticles = articles.filter(isValidNewsArticle)

          console.log('🔥 DEBUG validação concluída:')
          console.log(
            `🔥 DEBUG ${validArticles.length} artigos válidos de ${articles.length} totais`,
          )
          console.log(
            '🔥 DEBUG artigos válidos:',
            validArticles.map((a) => ({ id: a.id, title: a.title })),
          )

          if (validArticles.length > 0) {
            console.log('🔥 DEBUG processando artigos válidos...')

            const filteredArticles = applyFilters(validArticles, state.filters)
            const newStats = calculateStats(validArticles)
            newStats.filteredCount = filteredArticles.length

            const now = new Date().toISOString()

            // 🆕 Calcular se há mais itens
            const hasMore = total > validArticles.length

            console.log('🔥 DEBUG dados finais a serem salvos no store:')
            console.log('🔥 DEBUG validArticles:', validArticles.length)
            console.log('🔥 DEBUG filteredArticles:', filteredArticles.length)
            console.log('🔥 DEBUG total:', total)
            console.log('🔥 DEBUG hasMore:', hasMore)
            console.log('🔥 DEBUG newStats:', newStats)

            const newState = {
              news: validArticles,
              filteredNews: filteredArticles,
              totalCount: total,
              loadedItems: validArticles.length, // 🆕 NOVA LINHA
              hasMore, // 🆕 NOVA LINHA
              stats: newStats,
              cache: {
                lastUpdate: now,
                isStale: false,
                nextRefresh: Date.now() + state.refreshInterval,
              },
              loading: initialLoadingState,
              error: null,
            }

            console.log('🔥 DEBUG atualizando store com:', newState)

            set(() => newState)

            // Verificar estado após atualização
            const finalState = get()
            console.log('🔥 DEBUG estado final do store após set():')
            console.log('🔥 DEBUG finalState.news.length:', finalState.news.length)
            console.log('🔥 DEBUG finalState.filteredNews.length:', finalState.filteredNews.length)
            console.log('🔥 DEBUG finalState.hasMore:', finalState.hasMore)
            console.log('🔥 DEBUG finalState.loadedItems:', finalState.loadedItems)
            console.log('🔥 DEBUG finalState.loading:', finalState.loading)
            console.log('🔥 DEBUG finalState.error:', finalState.error)

            console.log(
              `✅ ${validArticles.length} notícias carregadas com sucesso. HasMore: ${hasMore}`,
            )
            console.log('📊 Stats:', newStats)
            console.log('🔍 Primeira notícia:', validArticles[0])
          } else {
            console.warn('⚠️ Nenhum artigo válido encontrado')
            console.log('🔥 DEBUG definindo estado vazio...')

            // Não tratar como erro, mas definir estado vazio
            set(() => ({
              news: [],
              filteredNews: [],
              totalCount: 0,
              loadedItems: 0, // 🆕 NOVA LINHA
              hasMore: false, // 🆕 NOVA LINHA
              stats: initialStats,
              loading: initialLoadingState,
              error: null,
            }))
          }
        } catch (error) {
          console.error('🔥 DEBUG ERRO na loadNews:', error)
          console.error('❌ Erro ao carregar notícias:', error)

          set(() => ({
            loading: initialLoadingState,
            error:
              error instanceof Error ? error.message : 'Erro desconhecido ao carregar notícias',
          }))
        }

        console.log('🔥 DEBUG loadNews FINALIZADA')
      },

      // === 🆕 NOVA FUNÇÃO: CARREGAR MAIS ===
      loadMoreNews: async () => {
        console.log('🔥 DEBUG loadMoreNews INICIADA')
        const state = get()

        if (state.isLoadingMore || !state.hasMore) {
          console.log('🚫 Já está a carregar ou não há mais itens')
          return
        }

        set({ isLoadingMore: true, error: null })

        try {
          const params: GetNewsParams = {
            limit: state.itemsPerPage,
            offset: state.loadedItems, // Começar onde parámos
            sortBy: 'publishedDate',
            sortOrder: 'desc',
          }

          // Aplicar filtros atuais
          if (state.filters.category && state.filters.category !== 'all') {
            params.category = state.filters.category
          }
          if (state.filters.searchTerm) {
            params.searchTerm = state.filters.searchTerm
          }

          console.log('📡 loadMoreNews params:', params)
          const result = await newsApi.getNews(params)
          const { articles, total } = extractArticlesFromResponse(result)
          const validArticles = articles.filter(isValidNewsArticle)

          if (validArticles.length > 0) {
            // APPEND às notícias existentes
            const newAllNews = [...state.news, ...validArticles]
            const newFilteredNews = applyFilters(newAllNews, state.filters)
            const newStats = calculateStats(newAllNews)
            newStats.filteredCount = newFilteredNews.length

            // Verificar se ainda há mais
            const newLoadedItems = state.loadedItems + validArticles.length
            const hasMore = total > newLoadedItems

            set(() => ({
              news: newAllNews,
              filteredNews: newFilteredNews,
              loadedItems: newLoadedItems,
              hasMore,
              stats: newStats,
              isLoadingMore: false,
              cache: {
                ...state.cache,
                lastUpdate: new Date().toISOString(),
              },
            }))

            console.log(
              `✅ +${validArticles.length} notícias adicionadas. Total: ${newLoadedItems}/${total}`,
            )
          } else {
            // Não há mais artigos
            set({ isLoadingMore: false, hasMore: false })
            console.log('✅ Não há mais notícias para carregar')
          }
        } catch (error) {
          console.error('❌ Erro ao carregar mais notícias:', error)
          set({
            isLoadingMore: false,
            error: error instanceof Error ? error.message : 'Erro ao carregar mais notícias',
          })
        }
      },

      // === 🆕 NOVA FUNÇÃO: ALTERAR ITEMS PER PAGE ===
      setItemsPerPage: (count: number) => {
        console.log(`📊 Alterando items per page para: ${count}`)
        set({ itemsPerPage: count })
        // Recarregar com novo limite
        get().loadNews(true)
      },

      // === 🆕 NOVA FUNÇÃO: CARREGAR POR CATEGORIA ===
      loadNewsByCategory: async (category: string, reset = true) => {
        console.log(`🏷️ Carregando notícias da categoria: ${category}`)

        const state = get()

        if (reset) {
          // Reset e carregar nova categoria
          set({
            filters: { ...state.filters, category },
            loading: { ...state.loading, filter: true },
            error: null,
          })

          // Carregar notícias da nova categoria
          await get().loadNews(true)
        } else {
          // Carregar mais da categoria atual
          if (state.filters.category !== category) {
            console.log('🔄 Categoria mudou, fazendo reset')
            return get().loadNewsByCategory(category, true)
          }

          // Carregar mais da mesma categoria
          await get().loadMoreNews()
        }
      },

      // === REFRESH NEWS ===
      refreshNews: async () => {
        console.log('🔄 Refresh manual solicitado')
        await get().loadNews(true)
      },

      // === FILTROS ===
      setFilters: (newFilters) => {
        console.log('🔥 DEBUG setFilters chamado com:', newFilters)

        set((state) => {
          const updatedFilters = { ...state.filters, ...newFilters }
          const filteredArticles = applyFilters(state.news, updatedFilters)

          console.log('🔥 DEBUG setFilters resultado:', {
            updatedFilters,
            filteredCount: filteredArticles.length,
          })

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
        console.log('🔥 DEBUG setSearchTerm:', searchTerm)
        get().setFilters({ searchTerm })
      },

      setCategory: (category) => {
        console.log('🔥 DEBUG setCategory:', category)
        get().setFilters({ category })
      },

      clearFilters: () => {
        console.log('🔥 DEBUG clearFilters chamado')
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
        console.log('🔥 DEBUG setPage:', page)
        set({ currentPage: page })
        get().loadNews()
      },

      nextPage: () => {
        console.log('🔥 DEBUG nextPage chamado')
        const state = get()
        const totalPages = Math.ceil(state.totalCount / state.itemsPerPage)
        if (state.currentPage < totalPages) {
          get().setPage(state.currentPage + 1)
        }
      },

      prevPage: () => {
        console.log('🔥 DEBUG prevPage chamado')
        const state = get()
        if (state.currentPage > 1) {
          get().setPage(state.currentPage - 1)
        }
      },

      // === CONFIGURAÇÕES ===
      setAutoRefresh: (enabled) => {
        console.log('🔥 DEBUG setAutoRefresh:', enabled)
        set({ autoRefresh: enabled })
      },

      setRefreshInterval: (interval) => {
        console.log('🔥 DEBUG setRefreshInterval:', interval)
        set({ refreshInterval: interval })
      },

      // === UTILITIES ===
      clearError: () => {
        console.log('🔥 DEBUG clearError chamado')
        set({ error: null })
      },

      clearCache: () => {
        console.log('🔥 DEBUG clearCache chamado')
        set({
          news: [],
          filteredNews: [],
          cache: {
            lastUpdate: null,
            isStale: true,
            nextRefresh: 0,
          },
          stats: initialStats,
          // 🆕 Reset dos novos campos
          hasMore: true,
          loadedItems: 0,
          isLoadingMore: false,
        })
      },

      isDataFresh: () => {
        const state = get()
        const fresh = !isDataStale(state.cache.lastUpdate)
        console.log('🔥 DEBUG isDataFresh:', fresh)
        return fresh
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
        // 🆕 Adicionar novos campos ao persist
        hasMore: state.hasMore,
        loadedItems: state.loadedItems,
      }),
      onRehydrateStorage: () => (state) => {
        console.log('🔥 DEBUG onRehydrateStorage executado com state:', state)

        if (state) {
          const needsRefresh = isDataStale(state.cache.lastUpdate)
          console.log('🔥 DEBUG needsRefresh:', needsRefresh)

          setTimeout(() => {
            console.log('🔥 DEBUG aplicando estado hidratado...')

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
              console.log('🔥 DEBUG auto-refresh ativado, carregando em 1s...')
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

  const selectors = {
    // Status helpers existentes
    isLoading: Object.values(store.loading).some(Boolean),
    isInitialLoading: store.loading.initial,
    hasError: !!store.error,
    hasNews: store.news.length > 0,
    isDataFresh: store.isDataFresh(),

    // Pagination helpers existentes
    totalPages: Math.ceil(store.totalCount / store.itemsPerPage),
    hasNextPage: store.currentPage * store.itemsPerPage < store.totalCount,
    hasPrevPage: store.currentPage > 1,

    // Filter status existentes
    hasActiveFilters:
      store.filters.category !== 'all' || !!store.filters.searchTerm || !!store.filters.source,

    // Data helpers existentes
    isEmpty: store.news.length === 0 && !Object.values(store.loading).some(Boolean),
    needsRefresh: isDataStale(store.cache.lastUpdate),

    // === 🆕 NOVOS SELECTORS ===
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

  console.log('🔥 DEBUG useNewsSelectors resultado:', selectors)
  return selectors
}

// Adicionar store ao window para debug
if (typeof window !== 'undefined') {
  window.useNewsStore = useNewsStore
}
