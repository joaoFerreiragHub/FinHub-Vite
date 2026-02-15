// src/stores/news/useNewsData.ts - Store de Gestão de Dados

import { create } from 'zustand'
import { NewsArticle } from '~/features/hub/news/types/news'

// ===== INTERFACES =====
export interface GetNewsParams {
  limit?: number
  offset?: number
  sortBy?: string
  sortOrder?: string
  category?: string
  searchTerm?: string
  sources?: string[]
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

// Interface do store
interface NewsDataStore {
  // === ESTADO ===
  articles: NewsArticle[] // Todas as notícias carregadas
  totalAvailable: number // Total disponível na API
  lastArticleIds: Set<string> // IDs dos últimos artigos (para detectar novos)
  duplicateCount: number // Contador de duplicatas removidas

  // === ACTIONS BÁSICAS ===
  setArticles: (articles: NewsArticle[]) => void
  addArticles: (articles: NewsArticle[]) => void
  prependArticles: (articles: NewsArticle[]) => void // Adicionar no início (notícias novas)
  removeArticle: (id: string) => void
  updateArticle: (id: string, updates: Partial<NewsArticle>) => void
  clearArticles: () => void

  // === GESTÃO DE DUPLICATAS ===
  removeDuplicates: (articles: NewsArticle[]) => NewsArticle[]
  isDuplicate: (article: NewsArticle) => boolean

  // === DETECÇÃO DE NOTÍCIAS NOVAS ===
  detectNewArticles: (freshArticles: NewsArticle[]) => NewsArticle[]
  updateLastArticleIds: (articles: NewsArticle[]) => void
  hasNewArticles: () => Promise<boolean>

  // === GETTERS AVANÇADOS ===
  getArticleById: (id: string) => NewsArticle | null
  getArticlesBySource: (source: string) => NewsArticle[]
  getArticlesByCategory: (category: string) => NewsArticle[]
  getRecentArticles: (hours: number) => NewsArticle[]
  getTopArticles: (limit: number) => NewsArticle[]

  // === ORDENAÇÃO E PROCESSAMENTO ===
  sortArticles: (articles: NewsArticle[], sortBy?: string, sortOrder?: string) => NewsArticle[]
  processApiResponse: (response: unknown) => { articles: NewsArticle[]; total: number }
  validateArticles: (articles: unknown[]) => NewsArticle[]
}

// ===== TYPE GUARDS E HELPERS =====

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

// Extrair artigos de diferentes formatos de resposta da API
function extractArticlesFromResponse(response: unknown): {
  articles: NewsArticle[]
  total: number
} {
  console.log('🔍 [NewsData] Extraindo artigos da resposta')

  // Formato 1: Array direto
  if (isArrayResponse(response)) {
    console.log('✅ [NewsData] Formato: Array direto')
    return { articles: response, total: response.length }
  }

  // Formato 2: { articles: [...], total?: number }
  if (hasArticlesProperty(response)) {
    console.log('✅ [NewsData] Formato: { articles: [...] }')
    const obj = response as unknown as Record<string, unknown>
    const articles = obj.articles as NewsArticle[]
    const total = typeof obj.total === 'number' ? obj.total : articles.length
    return { articles, total }
  }

  // Formato 3: { data: { articles: [...] } }
  if (hasDataProperty(response)) {
    console.log('✅ [NewsData] Formato: { data: { articles: [...] } }')
    const obj = response as unknown as Record<string, unknown>
    const data = obj.data as Record<string, unknown>
    const articles = data.articles as NewsArticle[]
    const total = typeof data.total === 'number' ? data.total : articles.length
    return { articles, total }
  }

  // Formato 4: { success: true, data: [...] }
  if (hasSuccessProperty(response)) {
    console.log('✅ [NewsData] Formato: { success: true, data: [...] }')
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

  console.warn('⚠️ [NewsData] Formato de resposta não reconhecido')
  return { articles: [], total: 0 }
}

// Validar se um artigo é válido
function isValidNewsArticle(article: unknown): article is NewsArticle {
  if (!isObject(article)) {
    return false
  }

  const obj = article as unknown as NewsArticle
  const isValid =
    typeof obj.id === 'string' &&
    typeof obj.title === 'string' &&
    obj.id.length > 0 &&
    obj.title.length > 0

  return isValid
}

// Verificar se dois artigos são similares (duplicatas)
function areArticlesSimilar(a: NewsArticle, b: NewsArticle): boolean {
  // Comparação por ID (mais confiável)
  if (a.id === b.id) return true

  // Comparação por URL (se não for placeholder)
  if (a.url === b.url && a.url !== '#' && a.url.length > 10) return true

  // Comparação por título e fonte
  const titleSimilar = a.title.toLowerCase().trim() === b.title.toLowerCase().trim()
  const sourceSame = a.source.toLowerCase() === b.source.toLowerCase()

  if (titleSimilar && sourceSame) return true

  // Comparação avançada por palavras-chave no título
  const aWords = a.title
    .toLowerCase()
    .split(' ')
    .filter((w) => w.length > 3)
  const bWords = b.title
    .toLowerCase()
    .split(' ')
    .filter((w) => w.length > 3)

  if (aWords.length < 3 || bWords.length < 3) return false

  const commonWords = aWords.filter((word) => bWords.includes(word))
  const similarity = commonWords.length / Math.max(aWords.length, bWords.length)

  return similarity >= 0.8 // 80% de similaridade
}

// ===== STORE PRINCIPAL =====
export const useNewsData = create<NewsDataStore>((set, get) => ({
  // === ESTADO INICIAL ===
  articles: [],
  totalAvailable: 0,
  lastArticleIds: new Set<string>(),
  duplicateCount: 0,

  // === ACTIONS BÁSICAS ===
  setArticles: (articles: NewsArticle[]) => {
    console.log(`📝 [NewsData] Definindo ${articles.length} artigos`)
    const cleanArticles = get().removeDuplicates(articles)

    set({
      articles: cleanArticles,
      lastArticleIds: new Set(cleanArticles.slice(0, 50).map((a) => a.id)), // Guardar últimos 50 IDs
    })
  },

  addArticles: (newArticles: NewsArticle[]) => {
    console.log(`➕ [NewsData] Adicionando ${newArticles.length} artigos`)
    const state = get()
    const allArticles = [...state.articles, ...newArticles]
    const cleanArticles = get().removeDuplicates(allArticles)

    set({
      articles: cleanArticles,
      lastArticleIds: new Set(cleanArticles.slice(0, 50).map((a) => a.id)),
    })
  },

  prependArticles: (newArticles: NewsArticle[]) => {
    console.log(
      `⬆️ [NewsData] Adicionando ${newArticles.length} artigos no início (notícias novas)`,
    )
    const state = get()
    const allArticles = [...newArticles, ...state.articles]
    const cleanArticles = get().removeDuplicates(allArticles)

    set({
      articles: cleanArticles,
      lastArticleIds: new Set(cleanArticles.slice(0, 50).map((a) => a.id)),
    })
  },

  removeArticle: (id: string) => {
    console.log(`🗑️ [NewsData] Removendo artigo: ${id}`)
    set((state) => ({
      articles: state.articles.filter((article) => article.id !== id),
    }))
  },

  updateArticle: (id: string, updates: Partial<NewsArticle>) => {
    console.log(`✏️ [NewsData] Atualizando artigo: ${id}`)
    set((state) => ({
      articles: state.articles.map((article) =>
        article.id === id ? { ...article, ...updates } : article,
      ),
    }))
  },

  clearArticles: () => {
    console.log('🧹 [NewsData] Limpando todos os artigos')
    set({
      articles: [],
      totalAvailable: 0,
      lastArticleIds: new Set(),
      duplicateCount: 0,
    })
  },

  // === GESTÃO DE DUPLICATAS ===
  removeDuplicates: (articles: NewsArticle[]) => {
    const uniqueArticles: NewsArticle[] = []
    const duplicates: string[] = []

    for (const article of articles) {
      // Verificar se é duplicata de algum artigo já processado
      const isDuplicate = uniqueArticles.some((existing) => areArticlesSimilar(article, existing))

      if (isDuplicate) {
        duplicates.push(article.id)
      } else {
        uniqueArticles.push(article)
      }
    }

    if (duplicates.length > 0) {
      console.log(`🔄 [NewsData] Removidas ${duplicates.length} duplicatas`)
      set((state) => ({ duplicateCount: state.duplicateCount + duplicates.length }))
    }

    return uniqueArticles
  },

  isDuplicate: (article: NewsArticle) => {
    const state = get()
    return state.articles.some((existing) => areArticlesSimilar(article, existing))
  },

  // === DETECÇÃO DE NOTÍCIAS NOVAS ===
  detectNewArticles: (freshArticles: NewsArticle[]) => {
    const state = get()
    const newArticles = freshArticles.filter((article) => !state.lastArticleIds.has(article.id))

    console.log(
      `🆕 [NewsData] Detectados ${newArticles.length} artigos novos de ${freshArticles.length}`,
    )
    return newArticles
  },

  updateLastArticleIds: (articles: NewsArticle[]) => {
    const latestIds = new Set(articles.slice(0, 50).map((a) => a.id))
    set({ lastArticleIds: latestIds })
  },

  hasNewArticles: async () => {
    // Esta função será implementada quando integrarmos com o loading
    // Por agora, retorna false
    return false
  },

  // === GETTERS AVANÇADOS ===
  getArticleById: (id: string) => {
    const state = get()
    return state.articles.find((article) => article.id === id) || null
  },

  getArticlesBySource: (source: string) => {
    const state = get()
    return state.articles.filter((article) => article.source.toLowerCase() === source.toLowerCase())
  },

  getArticlesByCategory: (category: string) => {
    const state = get()
    return state.articles.filter((article) => article.category === category)
  },

  getRecentArticles: (hours: number = 24) => {
    const state = get()
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000)

    return state.articles.filter((article) => {
      const articleDate = new Date(article.publishedDate)
      return articleDate >= cutoff
    })
  },

  getTopArticles: (limit: number = 10) => {
    const state = get()
    return state.articles.sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, limit)
  },

  // === ORDENAÇÃO E PROCESSAMENTO ===
  sortArticles: (articles: NewsArticle[], sortBy = 'publishedDate', sortOrder = 'desc') => {
    return articles.sort((a, b) => {
      const order = sortOrder === 'asc' ? 1 : -1

      switch (sortBy) {
        case 'publishedDate':
          return order * (new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())
        case 'title':
          return order * a.title.localeCompare(b.title)
        case 'source':
          return order * a.source.localeCompare(b.source)
        case 'views':
          return order * ((b.views || 0) - (a.views || 0))
        default:
          return order * (new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())
      }
    })
  },

  processApiResponse: (response: unknown) => {
    console.log('🔄 [NewsData] Processando resposta da API')
    const { articles, total } = extractArticlesFromResponse(response)
    const validArticles = get().validateArticles(articles)

    set({ totalAvailable: total })

    return { articles: validArticles, total }
  },

  validateArticles: (articles: unknown[]) => {
    if (!Array.isArray(articles)) {
      console.warn('⚠️ [NewsData] Articles não é um array')
      return []
    }

    const validArticles = articles.filter(isValidNewsArticle)

    console.log(`✅ [NewsData] ${validArticles.length} artigos válidos de ${articles.length}`)

    return validArticles
  },
}))

// ===== HOOKS ESPECIALIZADOS =====

/**
 * Hook para operações básicas de dados
 */
export const useNewsDataOperations = () => {
  const store = useNewsData()

  return {
    // Dados
    articles: store.articles,
    totalAvailable: store.totalAvailable,
    duplicateCount: store.duplicateCount,

    // Operações básicas
    setArticles: store.setArticles,
    addArticles: store.addArticles,
    clearArticles: store.clearArticles,

    // Detecção de novos
    detectNewArticles: store.detectNewArticles,

    // Getters
    getArticleById: store.getArticleById,
    getRecentArticles: store.getRecentArticles,

    // Stats rápidas
    totalArticles: store.articles.length,
    uniqueSources: new Set(store.articles.map((a) => a.source)).size,
    latestArticle: store.articles[0] || null,
  }
}

/**
 * Hook para detecção de notícias novas
 */
export const useNewArticleDetection = () => {
  const { detectNewArticles, updateLastArticleIds, lastArticleIds } = useNewsData()

  return {
    detectNewArticles,
    updateLastArticleIds,
    trackedArticlesCount: lastArticleIds.size,

    // Função auxiliar para verificar se há novidades
    checkForNewArticles: (freshArticles: NewsArticle[]) => {
      const newOnes = detectNewArticles(freshArticles)
      if (newOnes.length > 0) {
        updateLastArticleIds(freshArticles)
      }
      return newOnes
    },
  }
}

/**
 * Hook para análise de dados
 */
export const useNewsDataAnalysis = () => {
  const { articles, getArticlesBySource, getArticlesByCategory, getRecentArticles } = useNewsData()

  const getSourceStats = () => {
    const sources = articles.reduce(
      (acc, article) => {
        const source = article.source
        acc[source] = (acc[source] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(sources)
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count)
  }

  const getCategoryStats = () => {
    const categories = articles.reduce(
      (acc, article) => {
        const category = article.category || 'other'
        acc[category] = (acc[category] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(categories)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
  }

  return {
    totalArticles: articles.length,
    sourceStats: getSourceStats(),
    categoryStats: getCategoryStats(),
    recentCount: getRecentArticles(24).length,

    // Funções de análise
    getArticlesBySource,
    getArticlesByCategory,
    getRecentArticles,
  }
}
