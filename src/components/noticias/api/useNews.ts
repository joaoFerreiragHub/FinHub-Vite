// hooks/useNews.ts

import { useState, useEffect, useCallback } from 'react'
import { NewsArticle, NewsFilters } from '../../../types/news'
import { mockNews } from './mockNews'


export const useNews = () => {
  const [news, setNews] = useState<NewsArticle[]>([])
  const [filteredNews, setFilteredNews] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  // Estados dos filtros
  const [filters, setFilters] = useState<NewsFilters>({
    category: 'all',
    searchTerm: ''
  })

  // Carregar notícias (por agora usa dados mock)
  const loadNews = useCallback(async (useMockData: boolean = true) => {
    setLoading(true)
    setError(null)

    try {
      if (useMockData) {
        // Simular delay da API
        await new Promise(resolve => setTimeout(resolve, 800))
        setNews(mockNews)
        setLastUpdate(new Date())
      } else {
        // TODO: Implementar chamada à API FMP
        // const fmpNews = await fetchFMPNews()
        // setNews(fmpNews)
        throw new Error('API FMP ainda não implementada')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      setError(errorMessage)
      console.error('Erro ao carregar notícias:', error)

      // Fallback para dados mock em caso de erro
      setNews(mockNews)
      setLastUpdate(new Date())
    } finally {
      setLoading(false)
    }
  }, [])

  // Filtrar notícias baseado nos filtros atuais
  const applyFilters = useCallback((newsToFilter: NewsArticle[], currentFilters: NewsFilters) => {
    let filtered = [...newsToFilter]

    // Filtrar por categoria
    if (currentFilters.category !== 'all') {
      filtered = filtered.filter(article => article.category === currentFilters.category)
    }

    // Filtrar por termo de pesquisa
    if (currentFilters.searchTerm) {
      const searchLower = currentFilters.searchTerm.toLowerCase()
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchLower) ||
        article.summary.toLowerCase().includes(searchLower) ||
        article.source.toLowerCase().includes(searchLower) ||
        article.tickers?.some(ticker => ticker.toLowerCase().includes(searchLower))
      )
    }

    // Filtrar por fonte
    if (currentFilters.source) {
      filtered = filtered.filter(article =>
        article.source.toLowerCase().includes(currentFilters.source!.toLowerCase())
      )
    }

    // Filtrar por data (se implementado)
    if (currentFilters.dateRange) {
      filtered = filtered.filter(article => {
        const articleDate = new Date(article.publishedDate)
        return articleDate >= currentFilters.dateRange!.from &&
               articleDate <= currentFilters.dateRange!.to
      })
    }

    // Ordenar por data (mais recente primeiro)
    filtered.sort((a, b) =>
      new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
    )

    return filtered
  }, [])

  // Atualizar filtros
  const updateFilters = useCallback((newFilters: Partial<NewsFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }, [])

  // Aplicar filtros quando news ou filters mudarem
  useEffect(() => {
    const filtered = applyFilters(news, filters)
    setFilteredNews(filtered)
  }, [news, filters, applyFilters])

  // Carregar notícias na inicialização
  useEffect(() => {
    loadNews(true) // Usar dados mock por padrão
  }, [loadNews])

  // Funções helper para atualizar filtros específicos
  const setSearchTerm = useCallback((searchTerm: string) => {
    updateFilters({ searchTerm })
  }, [updateFilters])

  const setCategory = useCallback((category: string) => {
    updateFilters({ category })
  }, [updateFilters])

  const setSource = useCallback((source: string) => {
    updateFilters({ source })
  }, [updateFilters])

  // Função para refrescar notícias
  const refreshNews = useCallback(() => {
    loadNews(true)
  }, [loadNews])

  // Função para buscar notícias por ticker específico
  const searchByTicker = useCallback((ticker: string) => {
    setSearchTerm(ticker)
  }, [setSearchTerm])

  // Função para limpar todos os filtros
  const clearFilters = useCallback(() => {
    setFilters({
      category: 'all',
      searchTerm: ''
    })
  }, [])

  // Estatísticas
  const stats = {
    totalNews: news.length,
    filteredCount: filteredNews.length,
    categories: {
      market: news.filter(n => n.category === 'market').length,
      crypto: news.filter(n => n.category === 'crypto').length,
      economy: news.filter(n => n.category === 'economy').length,
      earnings: news.filter(n => n.category === 'earnings').length,
      general: news.filter(n => n.category === 'general').length
    },
    sources: [...new Set(news.map(n => n.source))].length,
    sentiments: {
      positive: news.filter(n => n.sentiment === 'positive').length,
      negative: news.filter(n => n.sentiment === 'negative').length,
      neutral: news.filter(n => n.sentiment === 'neutral').length
    }
  }

  return {
    // Data
    news: filteredNews,
    allNews: news,
    loading,
    error,
    lastUpdate,

    // Filters
    filters,
    updateFilters,
    setSearchTerm,
    setCategory,
    setSource,
    clearFilters,

    // Actions
    loadNews,
    refreshNews,
    searchByTicker,

    // Stats
    stats
  }
}
