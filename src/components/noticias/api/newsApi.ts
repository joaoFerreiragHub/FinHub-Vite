// src/components/noticias/api/newsApi.ts - VERSÃO LIMPA E OTIMIZADA

import { NewsArticle } from '../../../types/news'
import { GetNewsParams } from '../../../stores/useNewsStore'

// ===== INTERFACES =====
interface NewsApiResponse {
  articles: NewsArticle[]
  total: number
}

interface ApiConfig {
  timeout: number
  retries: number
  baseUrl: string
}

// ===== CONFIGURAÇÃO =====
const API_CONFIG: ApiConfig = {
  timeout: 30000, // 30 segundos
  retries: 3,
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
}

// ===== CLASSE PRINCIPAL =====
class NewsApiService {
  private controller: AbortController | null = null

  /**
   * Método principal para buscar notícias
   */
  async getNews(params: GetNewsParams = {}): Promise<NewsApiResponse> {
    // Cancelar request anterior se ainda estiver pendente
    this.cancelPreviousRequest()

    // Criar novo controller para este request
    this.controller = new AbortController()

    const {
      limit = 20,
      offset = 0,
      sortBy = 'publishedDate',
      sortOrder = 'desc',
      category,
      searchTerm,
      sources,
    } = params

    try {
      const url = this.buildUrl('/news', {
        limit: limit.toString(),
        offset: offset.toString(),
        sortBy,
        sortOrder,
        ...(category && category !== 'all' && { category }),
        ...(searchTerm && { search: searchTerm }),
        ...(sources && sources.length > 0 && { sources: sources.join(',') }),
      })

      const response = await this.makeRequest(url)
      return this.processResponse(response)
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request cancelado')
      }
      throw this.handleError(error)
    } finally {
      this.controller = null
    }
  }

  /**
   * Testar conexão com a API
   */
  async testConnection(): Promise<{
    status: 'healthy' | 'error'
    latency?: number
    error?: string
  }> {
    const startTime = Date.now()

    try {
      await this.getNews({ limit: 1 })
      const latency = Date.now() - startTime

      return {
        status: 'healthy',
        latency,
      }
    } catch (error) {
      return {
        status: 'error',
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      }
    }
  }

  /**
   * Cancelar request em andamento
   */
  cancelRequest(): void {
    this.cancelPreviousRequest()
  }

  // ===== MÉTODOS PRIVADOS =====

  private cancelPreviousRequest(): void {
    if (this.controller) {
      this.controller.abort()
      this.controller = null
    }
  }

  private buildUrl(endpoint: string, params: Record<string, string>): string {
    const url = new URL(`${API_CONFIG.baseUrl}${endpoint}`)

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, value)
      }
    })

    return url.toString()
  }

  private async makeRequest(url: string): Promise<unknown> {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      signal: this.controller?.signal,
      // Timeout implementado via AbortController
      ...this.getTimeoutSignal(),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return response.json()
  }

  private getTimeoutSignal() {
    if (!this.controller) return {}

    const timeoutId = setTimeout(() => {
      this.controller?.abort()
    }, API_CONFIG.timeout)

    // Limpar timeout quando request terminar
    this.controller.signal.addEventListener('abort', () => {
      clearTimeout(timeoutId)
    })

    return {}
  }

  private processResponse(response: unknown): NewsApiResponse {
    // Tentar extrair articles e total de diferentes formatos de resposta
    if (Array.isArray(response)) {
      return {
        articles: response as NewsArticle[],
        total: response.length,
      }
    }

    if (this.isObjectWithArticles(response)) {
      const articles = response.articles as NewsArticle[]
      const total = typeof response.total === 'number' ? response.total : articles.length
      return { articles, total }
    }

    if (this.isObjectWithData(response)) {
      const data = response.data
      if (Array.isArray(data)) {
        return {
          articles: data as NewsArticle[],
          total: data.length,
        }
      }
      if (this.isObjectWithArticles(data)) {
        const articles = data.articles as NewsArticle[]
        const total = typeof data.total === 'number' ? data.total : articles.length
        return { articles, total }
      }
    }

    if (this.isSuccessResponse(response)) {
      const data = response.data
      if (Array.isArray(data)) {
        return {
          articles: data as NewsArticle[],
          total: data.length,
        }
      }
      if (this.isObjectWithArticles(data)) {
        const articles = data.articles as NewsArticle[]
        const total = typeof data.total === 'number' ? data.total : articles.length
        return { articles, total }
      }
    }

    // Fallback para resposta vazia
    return { articles: [], total: 0 }
  }

  private handleError(error: unknown): Error {
    if (error instanceof Error) {
      return error
    }
    if (typeof error === 'string') {
      return new Error(error)
    }
    return new Error('Erro desconhecido na API')
  }

  // Type guards
  private isObject(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === 'object'
  }

  private isObjectWithArticles(value: unknown): value is { articles: unknown; total?: unknown } {
    return this.isObject(value) && 'articles' in value && Array.isArray(value.articles)
  }

  private isObjectWithData(value: unknown): value is { data: unknown } {
    return this.isObject(value) && 'data' in value
  }

  private isSuccessResponse(value: unknown): value is { success: boolean; data: unknown } {
    return this.isObject(value) && 'success' in value && value.success === true && 'data' in value
  }
}

// ===== EXPORT SINGLETON =====
export const newsApi = new NewsApiService()

// ===== TIPOS AUXILIARES =====
export type { NewsApiResponse }
