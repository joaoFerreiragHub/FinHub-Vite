
import { useState, useEffect, useCallback, useRef } from 'react'
import { NewsArticle, NewsFilters } from '../../../types/news'
import { newsApi } from './newsApi'

interface NewsStats {
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

interface GetNewsParams {
  limit: number
  offset: number
  sortBy: 'publishedDate'
  sortOrder: 'desc'
  category?: string
  search?: string
  sources?: string[]
}

interface UseNewsOptions {
  autoRefresh?: boolean
  refreshInterval?: number
}

export const useNews = ({ autoRefresh = false, refreshInterval = 5 * 60 * 1000 }: UseNewsOptions = {}) => {
  const [news, setNews] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [stats, setStats] = useState<NewsStats>({
    totalNews: 0,
    filteredCount: 0,
    categories: {},
    sources: 0,
    sentiments: { positive: 0, negative: 0, neutral: 0 }
  })

  const [filters, setFilters] = useState<NewsFilters>({
    category: 'all',
    searchTerm: ''
  })

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(20)

  const isLoadingRef = useRef(false)
  const hasInitialLoadRef = useRef(false)

  const calculateLocalStats = useCallback((articles: NewsArticle[]): NewsStats => {
    const categories = articles.reduce((acc, article) => {
      acc[article.category] = (acc[article.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const sentiments = articles.reduce((acc, article) => {
      const sentiment = article.sentiment || 'neutral'
      acc[sentiment as keyof typeof acc] = (acc[sentiment as keyof typeof acc] || 0) + 1
      return acc
    }, { positive: 0, negative: 0, neutral: 0 })

    const uniqueSources = new Set(articles.map(a => a.source)).size

    return {
      totalNews: articles.length,
      filteredCount: articles.length,
      categories,
      sources: uniqueSources,
      sentiments
    }
  }, [])

  const loadNews = useCallback(async (forceRefresh = false) => {
    if (isLoadingRef.current && !forceRefresh) return

    isLoadingRef.current = true
    setLoading(true)
    setError(null)

    try {
      const offset = (currentPage - 1) * itemsPerPage

      const apiParams: GetNewsParams = {
        limit: itemsPerPage,
        offset,
        sortBy: 'publishedDate',
        sortOrder: 'desc'
      }

      if (filters.category && filters.category !== 'all') {
        apiParams.category = filters.category
      }

      if (filters.searchTerm) {
        apiParams.search = filters.searchTerm
      }

      if (filters.source) {
        apiParams.sources = [filters.source]
      }

      const result = await newsApi.getNews(apiParams)

      if (result && result.articles) {
        setNews(result.articles)
        setTotalCount(result.total || 0)
        setLastUpdate(new Date())

        const localStats = calculateLocalStats(result.articles)
        localStats.filteredCount = result.total || 0
        setStats(localStats)

        hasInitialLoadRef.current = true
      } else {
        setError('Formato de resposta inválido da API')
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      setError(errorMessage)
    } finally {
      setLoading(false)
      isLoadingRef.current = false
    }
  }, [filters, currentPage, itemsPerPage, calculateLocalStats])

  const refreshNews = useCallback(() => {
    loadNews(true)
  }, [loadNews])

  const setSearchTerm = useCallback((searchTerm: string) => {
    setFilters(prev => ({ ...prev, searchTerm }))
    setCurrentPage(1)
  }, [])

  const setCategory = useCallback((category: string) => {
    setFilters(prev => ({ ...prev, category }))
    setCurrentPage(1)
  }, [])

  const setSource = useCallback((source: string) => {
    setFilters(prev => ({ ...prev, source }))
    setCurrentPage(1)
  }, [])

  const clearFilters = useCallback(() => {
    setFilters({
      category: 'all',
      searchTerm: ''
    })
    setCurrentPage(1)
  }, [])

  useEffect(() => {
    if (!hasInitialLoadRef.current) {
      const timer = setTimeout(() => {
        loadNews(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [loadNews])

  useEffect(() => {
    if (hasInitialLoadRef.current) {
      loadNews(false)
    }
  }, [filters, currentPage, loadNews])

  useEffect(() => {
    if (!autoRefresh) return
    const interval = setInterval(() => {
      loadNews(true)
    }, refreshInterval)
    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, loadNews])

  return {
    news,
    loading,
    error,
    lastUpdate,
    totalCount,
    stats,

    currentPage,
    totalPages: Math.ceil(totalCount / itemsPerPage),
    itemsPerPage,
    hasNextPage: currentPage * itemsPerPage < totalCount,
    hasPrevPage: currentPage > 1,

    filters,
    setSearchTerm,
    setCategory,
    setSource,
    clearFilters,

    loadNews,
    refreshNews,

    testAPI: () => loadNews(true)
  }
}
