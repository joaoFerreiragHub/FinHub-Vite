// services/newsApi.ts

import { NewsArticle, NewsFilters } from '../../../types/news'

// CORRIGIDO: Base URL da API para porta 3000
const API_BASE_URL = 'http://localhost:3000/api'

interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
  meta?: {
    total: number
    page: number
    limit: number
    fromCache?: boolean
  }
  pagination?: {
    total: number
    page: number
    limit: number
  }
}

interface NewsListResponse {
  articles: NewsArticle[]
  total: number
}

interface NewsStatsResponse {
  totalArticles: number
  categoriesBreakdown: Record<string, number>
  sentimentBreakdown: Record<string, number>
  topSources: Array<{ source: string; count: number }>
  topTickers: Array<{ ticker: string; count: number }>
  dateRange: { from: string; to: string }
}

interface TrendingTopicsResponse {
  topic: string
  count: number
  trend: 'up' | 'down' | 'stable'
}

interface MarketOverviewResponse {
  sentiment: { positive: number; negative: number; neutral: number }
  topStories: NewsArticle[]
  marketTrends: Array<{ sector: string; sentiment: string; change: number }>
}

interface DailySummaryResponse {
  date: string
  totalArticles: number
  topCategories: Array<{ category: string; count: number }>
  sentiment: Record<string, number>
  highlights: NewsArticle[]
}

interface AvailableSourcesResponse {
  sources: Array<{
    name: string
    type: string
    enabled: boolean
    status: 'healthy' | 'error'
    lastCheck: string
  }>
  activeCount: number
  totalCount: number
}

interface RefreshNewsResponse {
  articlesUpdated: number
  newArticles: number
  sourcesChecked: number
  executionTime: number
  lastRefresh: string
}

class NewsApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const fullUrl = `${API_BASE_URL}${endpoint}`

    try {
      console.log(`📡 Making request to: ${fullUrl}`)

      const response = await fetch(fullUrl, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      console.log(`📡 Response status: ${response.status} ${response.statusText}`)

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`❌ HTTP Error ${response.status}:`, errorText)
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`)
      }

      const data = (await response.json()) as ApiResponse<T>
      console.log('✅ Response data:', data)

      return data
    } catch (error) {
      console.error(`❌ API Error [${endpoint}]:`, error)
      throw error
    }
  }

  // GET /api/news - Buscar notícias com filtros
  // SUBSTITUIR a função getNews no ficheiro src/components/noticias/api/newsApi.ts

  // GET /api/news - Buscar notícias com filtros
  async getNews(
    filters: Partial<NewsFilters> & {
      limit?: number
      offset?: number
      sortBy?: string
      sortOrder?: string
    } = {},
  ): Promise<NewsListResponse> {
    console.log('📰 getNews called with filters:', filters)

    const params = new URLSearchParams()

    if (filters.category && filters.category !== 'all') {
      params.append('category', filters.category)
    }
    if (filters.searchTerm) {
      params.append('search', filters.searchTerm)
    }
    if (filters.source) {
      params.append('sources', filters.source)
    }
    if (filters.limit) {
      params.append('limit', filters.limit.toString())
    }
    if (filters.offset) {
      params.append('offset', filters.offset.toString())
    }
    if (filters.sortBy) {
      params.append('sortBy', filters.sortBy)
    }
    if (filters.sortOrder) {
      params.append('sortOrder', filters.sortOrder)
    }
    if (filters.dateRange) {
      params.append('from', filters.dateRange.from.toISOString())
      params.append('to', filters.dateRange.to.toISOString())
    }

    const queryString = params.toString()
    const endpoint = `/news${queryString ? `?${queryString}` : ''}`

    console.log('📡 Final endpoint:', endpoint)

    const response = await this.makeRequest<any>(endpoint) // Mudança aqui: any em vez de NewsListResponse

    console.log('🔍 Raw response structure:', response)

    // 🔥 CORREÇÃO PRINCIPAL: Adaptar para diferentes estruturas de resposta
    if (response.success && response.data) {
      console.log('✅ Resposta tem success=true e data')
      console.log('🔍 response.data:', response.data)
      console.log('🔍 response.data.articles:', response.data.articles)
      console.log('🔍 response.data.total:', response.data.total)

      // Formato esperado: {success: true, data: {articles: [...], total: number}}
      if (response.data.articles && Array.isArray(response.data.articles)) {
        console.log('✅ Encontrou articles array com', response.data.articles.length, 'items')

        return {
          articles: response.data.articles,
          total: response.data.total || response.data.articles.length,
        }
      }

      // Formato alternativo: {success: true, data: [...]} (array direto)
      if (Array.isArray(response.data)) {
        console.log('✅ data é array direto com', response.data.length, 'items')

        return {
          articles: response.data,
          total: response.data.length,
        }
      }

      console.warn('⚠️ response.data não tem articles nem é array:', response.data)
    }

    // Fallback para outros formatos
    if (response.data && response.data.articles) {
      console.log('✅ Fallback: encontrou data.articles')
      return {
        articles: response.data.articles,
        total: response.data.total || response.data.articles.length,
      }
    }

    if (Array.isArray(response.data)) {
      console.log('✅ Fallback: response.data é array')
      return {
        articles: response.data,
        total: response.data.length,
      }
    }

    if (Array.isArray(response)) {
      console.log('✅ Fallback: response é array direto')
      return {
        articles: response,
        total: response.length,
      }
    }

    console.error('❌ Formato de resposta não reconhecido:', response)
    return {
      articles: [],
      total: 0,
    }
  }

  // GET /api/news/featured - Notícias em destaque
  async getFeaturedNews(): Promise<NewsArticle[]> {
    console.log('⭐ getFeaturedNews called')
    const response = await this.makeRequest<NewsArticle[]>('/news/featured')
    return response.data
  }

  // GET /api/news/trending - Notícias trending
  async getTrendingNews(timeframe: string = '24h'): Promise<NewsArticle[]> {
    console.log('📈 getTrendingNews called with timeframe:', timeframe)
    const response = await this.makeRequest<NewsArticle[]>(`/news/trending?timeframe=${timeframe}`)
    return response.data
  }

  // GET /api/news/stats - Estatísticas
  async getNewsStats(filters: Partial<NewsFilters> = {}): Promise<NewsStatsResponse> {
    console.log('📊 getNewsStats called with filters:', filters)
    const params = new URLSearchParams()

    if (filters.category && filters.category !== 'all') {
      params.append('category', filters.category)
    }
    if (filters.dateRange) {
      params.append('from', filters.dateRange.from.toISOString())
      params.append('to', filters.dateRange.to.toISOString())
    }

    const queryString = params.toString()
    const endpoint = `/news/stats${queryString ? `?${queryString}` : ''}`

    const response = await this.makeRequest<NewsStatsResponse>(endpoint)
    return response.data
  }

  // POST /api/news/search - Pesquisa avançada
  async searchNews(searchParams: {
    q: string
    category?: string
    sources?: string[]
    tickers?: string[]
    limit?: number
    offset?: number
  }): Promise<NewsListResponse> {
    console.log('🔍 searchNews called with params:', searchParams)
    const response = await this.makeRequest<NewsListResponse>('/news/search', {
      method: 'POST',
      body: JSON.stringify(searchParams),
    })
    return response.data
  }

  // GET /api/news/ticker/:symbol - Notícias por ticker
  async getNewsByTicker(
    ticker: string,
    options: {
      limit?: number
      offset?: number
      from?: string
      to?: string
    } = {},
  ): Promise<NewsListResponse> {
    console.log('📊 getNewsByTicker called:', ticker, options)
    const params = new URLSearchParams()

    if (options.limit) params.append('limit', options.limit.toString())
    if (options.offset) params.append('offset', options.offset.toString())
    if (options.from) params.append('from', options.from)
    if (options.to) params.append('to', options.to)

    const queryString = params.toString()
    const endpoint = `/news/ticker/${ticker}${queryString ? `?${queryString}` : ''}`

    const response = await this.makeRequest<NewsListResponse>(endpoint)
    return response.data
  }

  // GET /api/news/category/:category - Notícias por categoria
  async getNewsByCategory(
    category: string,
    options: {
      limit?: number
      offset?: number
      from?: string
      to?: string
    } = {},
  ): Promise<NewsListResponse> {
    console.log('📂 getNewsByCategory called:', category, options)
    const params = new URLSearchParams()

    if (options.limit) params.append('limit', options.limit.toString())
    if (options.offset) params.append('offset', options.offset.toString())
    if (options.from) params.append('from', options.from)
    if (options.to) params.append('to', options.to)

    const queryString = params.toString()
    const endpoint = `/news/category/${category}${queryString ? `?${queryString}` : ''}`

    const response = await this.makeRequest<NewsListResponse>(endpoint)
    return response.data
  }

  // Teste de conectividade
  async testConnection(): Promise<boolean> {
    try {
      console.log('🧪 Testing connection to API...')
      const response = await fetch(`${API_BASE_URL.replace('/api', '')}/api`)

      if (response.ok) {
        const data = await response.json()
        console.log('✅ API connection successful:', data)
        return true
      } else {
        console.error('❌ API connection failed:', response.status, response.statusText)
        return false
      }
    } catch (error) {
      console.error('❌ API connection error:', error)
      return false
    }
  }

  // Health check
  async healthCheck(): Promise<{
    status: 'healthy' | 'error'
    latency?: number
    error?: string
    timestamp: string
    endpoint?: string
  }> {
    const startTime = Date.now()

    try {
      await this.testConnection()

      return {
        status: 'healthy',
        latency: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        endpoint: API_BASE_URL,
      }
    } catch (error) {
      return {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        endpoint: API_BASE_URL,
      }
    }
  }

  // Resto dos métodos...
  async getNewsBySentiment(
    sentiment: string,
    options: {
      limit?: number
      offset?: number
    } = {},
  ): Promise<NewsListResponse> {
    const params = new URLSearchParams()

    if (options.limit) params.append('limit', options.limit.toString())
    if (options.offset) params.append('offset', options.offset.toString())

    const queryString = params.toString()
    const endpoint = `/news/sentiment/${sentiment}${queryString ? `?${queryString}` : ''}`

    const response = await this.makeRequest<NewsListResponse>(endpoint)
    return response.data
  }

  async getTrendingTopics(
    options: {
      timeframe?: string
      limit?: number
    } = {},
  ): Promise<TrendingTopicsResponse[]> {
    const params = new URLSearchParams()

    if (options.timeframe) params.append('timeframe', options.timeframe)
    if (options.limit) params.append('limit', options.limit.toString())

    const queryString = params.toString()
    const endpoint = `/news/topics/trending${queryString ? `?${queryString}` : ''}`

    const response = await this.makeRequest<TrendingTopicsResponse[]>(endpoint)
    return response.data
  }

  async getMarketOverview(): Promise<MarketOverviewResponse> {
    const response = await this.makeRequest<MarketOverviewResponse>('/news/market/overview')
    return response.data
  }

  async getDailySummary(date?: string): Promise<DailySummaryResponse> {
    const endpoint = `/news/summary/daily${date ? `?date=${date}` : ''}`
    const response = await this.makeRequest<DailySummaryResponse>(endpoint)
    return response.data
  }

  async getAvailableSources(): Promise<AvailableSourcesResponse> {
    const response = await this.makeRequest<AvailableSourcesResponse>('/news/sources')
    return response.data
  }

  async refreshNews(): Promise<RefreshNewsResponse> {
    const response = await this.makeRequest<RefreshNewsResponse>('/news/refresh', {
      method: 'POST',
    })
    return response.data
  }
}

// Instância singleton
export const newsApi = new NewsApiService()

// Debug helper
export const debugApiUrl = () => {
  console.log('🔧 API Configuration:')
  console.log('- API_BASE_URL:', API_BASE_URL)
  console.log('- NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL)
}
