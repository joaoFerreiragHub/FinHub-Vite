// src/features/hub/news/stores/useNewsStats.ts
import { useMemo, useCallback, useEffect, useState, useRef } from 'react'
import { useNewsSelectors, useNewsStore } from '~/features/hub/news/stores/useNewsStore'
import type { NewsStats } from '~/features/hub/news/types/news'

interface ExtendedNewsStats extends NewsStats {
  // Estatísticas estendidas
  averageAge: number // média de idade das notícias em horas
  topSources: Array<{ source: string; count: number; percentage: number }>
  topCategories: Array<{ category: string; count: number; percentage: number }>
  sentimentTrends: {
    positive: { count: number; trend: 'up' | 'down' | 'stable' }
    negative: { count: number; trend: 'up' | 'down' | 'stable' }
    neutral: { count: number; trend: 'up' | 'down' | 'stable' }
  }
  timeDistribution: {
    last24h: number
    last7days: number
    last30days: number
    older: number
  }
  readingTime: {
    average: number // minutos estimados
    total: number
    distribution: { short: number; medium: number; long: number }
  }
  engagement: {
    totalClicks: number
    clickThroughRate: number
    popularityScore: number
  }
}

interface UseNewsStatsOptions {
  includeFiltered?: boolean
  enableTrends?: boolean
  enableRealTimeUpdates?: boolean
}

interface StatsTrend {
  current: number
  previous: number
  change: number
  changePercentage: number
  trend: 'up' | 'down' | 'stable'
}

/**
 * Hook especializado para estatísticas avançadas das notícias
 * Providencia métricas detalhadas, tendências e análises de performance
 */
export const useNewsStats = (options: UseNewsStatsOptions = {}) => {
  const { includeFiltered = true, enableTrends = true, enableRealTimeUpdates = false } = options

  // === STORE STATE ===
  const { news, filteredNews, stats: basicStats, loadNews, filters } = useNewsStore()
  const { hasNews, isLoading } = useNewsSelectors()

  // === LOCAL STATE PARA TRENDS ===
  const [previousStats, setPreviousStats] = useState<ExtendedNewsStats | null>(null)
  const [statsHistory, setStatsHistory] = useState<ExtendedNewsStats[]>([])
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date())

  // ✅ FIX: Use useRef para dados consistentes de engagement
  const engagementDataRef = useRef({
    totalClicks: 0,
    clickThroughRate: 0,
    lastGenerated: 0,
  })

  // === DATASET SELECTION ===
  const dataToAnalyze = useMemo(() => {
    return includeFiltered ? filteredNews : news
  }, [includeFiltered, filteredNews, news])

  // === CALCULATIONS ===
  const calculations = useMemo(() => {
    if (dataToAnalyze.length === 0) {
      return {
        averageAge: 0,
        topSources: [],
        topCategories: [],
        timeDistribution: { last24h: 0, last7days: 0, last30days: 0, older: 0 },
        readingTime: { average: 0, total: 0, distribution: { short: 0, medium: 0, long: 0 } },
      }
    }

    const now = new Date()

    // ✅ FIX: Validação de datas e idades
    const ages = dataToAnalyze
      .map((article) => {
        try {
          const publishedDate = new Date(article.publishedDate)
          if (isNaN(publishedDate.getTime())) return 0
          return Math.max(0, (now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60))
        } catch {
          return 0
        }
      })
      .filter((age) => age > 0)

    const averageAge = ages.length > 0 ? ages.reduce((sum, age) => sum + age, 0) / ages.length : 0

    // === TOP SOURCES ===
    const sourceCounts = dataToAnalyze.reduce(
      (acc, article) => {
        const source = article.source || 'Unknown'
        acc[source] = (acc[source] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const topSources = Object.entries(sourceCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([source, count]) => ({
        source,
        count,
        percentage: Math.round((count / dataToAnalyze.length) * 100),
      }))

    // === TOP CATEGORIES ===
    const categoryCounts = dataToAnalyze.reduce(
      (acc, article) => {
        const category = article.category || 'other'
        acc[category] = (acc[category] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const topCategories = Object.entries(categoryCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([category, count]) => ({
        category,
        count,
        percentage: Math.round((count / dataToAnalyze.length) * 100),
      }))

    // === TIME DISTRIBUTION ===
    const timeDistribution = dataToAnalyze.reduce(
      (acc, article) => {
        try {
          const publishedDate = new Date(article.publishedDate)
          if (isNaN(publishedDate.getTime())) return acc

          const hoursAgo = (now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60)

          if (hoursAgo <= 24) acc.last24h++
          else if (hoursAgo <= 168)
            acc.last7days++ // 7 dias
          else if (hoursAgo <= 720)
            acc.last30days++ // 30 dias
          else acc.older++
        } catch {
          acc.older++
        }
        return acc
      },
      { last24h: 0, last7days: 0, last30days: 0, older: 0 },
    )

    // === READING TIME ===
    const readingTimes = dataToAnalyze.map((article) => {
      const content = article.content || article.summary || article.title || ''
      const wordCount = content.split(/\s+/).filter((word) => word.length > 0).length
      return Math.max(1, Math.ceil(wordCount / 200)) // 200 palavras por minuto
    })

    const averageReadingTime =
      readingTimes.length > 0
        ? readingTimes.reduce((sum, time) => sum + time, 0) / readingTimes.length
        : 0
    const totalReadingTime = readingTimes.reduce((sum, time) => sum + time, 0)

    const readingTimeDistribution = readingTimes.reduce(
      (acc, time) => {
        if (time <= 2) acc.short++
        else if (time <= 5) acc.medium++
        else acc.long++
        return acc
      },
      { short: 0, medium: 0, long: 0 },
    )

    return {
      averageAge,
      topSources,
      topCategories,
      timeDistribution,
      readingTime: {
        average: averageReadingTime,
        total: totalReadingTime,
        distribution: readingTimeDistribution,
      },
    }
  }, [dataToAnalyze])

  // ✅ FIX: Sentiment trends com acesso correto às propriedades
  const sentimentTrends = useMemo(() => {
    const currentSentiments = basicStats?.sentiments || { positive: 0, negative: 0, neutral: 0 }

    if (!enableTrends || !previousStats?.sentimentTrends) {
      return {
        positive: { count: currentSentiments.positive, trend: 'stable' as const },
        negative: { count: currentSentiments.negative, trend: 'stable' as const },
        neutral: { count: currentSentiments.neutral, trend: 'stable' as const },
      }
    }

    const getTrend = (current: number, previous: number): 'up' | 'down' | 'stable' => {
      if (current > previous) return 'up'
      if (current < previous) return 'down'
      return 'stable'
    }

    return {
      positive: {
        count: currentSentiments.positive,
        trend: getTrend(currentSentiments.positive, previousStats.sentimentTrends.positive.count),
      },
      negative: {
        count: currentSentiments.negative,
        trend: getTrend(currentSentiments.negative, previousStats.sentimentTrends.negative.count),
      },
      neutral: {
        count: currentSentiments.neutral,
        trend: getTrend(currentSentiments.neutral, previousStats.sentimentTrends.neutral.count),
      },
    }
  }, [enableTrends, previousStats?.sentimentTrends, basicStats?.sentiments])

  // ✅ FIX: Engagement com dados consistentes (sem Math.random)
  const engagement = useMemo(() => {
    const now = Date.now()

    // Só regenerar dados a cada 5 minutos para manter consistência
    if (now - engagementDataRef.current.lastGenerated > 300000) {
      engagementDataRef.current = {
        totalClicks: dataToAnalyze.length * 50, // Valor fixo baseado no tamanho
        clickThroughRate: 0.05, // 5% fixo
        lastGenerated: now,
      }
    }

    const popularityScore =
      dataToAnalyze.reduce((score, article) => {
        const ageInHours = (() => {
          try {
            const publishedDate = new Date(article.publishedDate)
            if (isNaN(publishedDate.getTime())) return 100
            return (now - publishedDate.getTime()) / (1000 * 60 * 60)
          } catch {
            return 100
          }
        })()

        const recencyBonus = Math.max(0, 100 - ageInHours)
        const sentimentBonus = article.sentiment === 'positive' ? 20 : 0
        return score + recencyBonus + sentimentBonus
      }, 0) / Math.max(1, dataToAnalyze.length)

    return {
      totalClicks: engagementDataRef.current.totalClicks,
      clickThroughRate: engagementDataRef.current.clickThroughRate,
      popularityScore: Math.round(popularityScore),
    }
  }, [dataToAnalyze])

  // === EXTENDED STATS ===
  const extendedStats: ExtendedNewsStats = useMemo(() => {
    // Construir o objeto base com as propriedades corretas do NewsStats (de types/news.ts)
    const now = new Date()
    const dateRange = {
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      to: now.toISOString(),
    }

    // Mapear basicStats para o formato esperado
    const totalArticles = basicStats?.totalNews || 0
    const categoriesBreakdown = basicStats?.categories || {}
    const sentimentBreakdown = basicStats?.sentiments || { positive: 0, negative: 0, neutral: 0 }

    // ❌ REMOVER ESTA LINHA - topSources duplicado
    // const topSources = calculations.topSources.map(({ source, count }) => ({ source, count }))

    // ✅ FIX: Extrair tickers apenas se existirem dados
    const topTickers =
      dataToAnalyze.length > 0
        ? (() => {
            const tickerCounts = dataToAnalyze.reduce(
              (acc, article) => {
                const tickers = article.tickers || []
                tickers.forEach((ticker) => {
                  if (ticker && ticker.trim()) {
                    // ✅ Verificar se ticker é válido
                    acc[ticker] = (acc[ticker] || 0) + 1
                  }
                })
                return acc
              },
              {} as Record<string, number>,
            )

            return Object.entries(tickerCounts)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 10)
              .map(([ticker, count]) => ({ ticker, count }))
          })()
        : []

    return {
      // Propriedades base do NewsStats (de types/news.ts)
      totalArticles,
      categoriesBreakdown,
      sentimentBreakdown,
      // ❌ REMOVER topSources daqui - será incluído via spread operator
      topTickers,
      dateRange,

      // Extensões do ExtendedNewsStats
      ...calculations, // ✅ Isso já inclui topSources
      sentimentTrends,
      engagement,
    }
  }, [basicStats, calculations, sentimentTrends, engagement, dataToAnalyze])

  // ✅ FIX: useEffect com dependências estáveis
  const stableStatsRef = useRef<string>('')
  const currentStatsString = JSON.stringify({
    totalArticles: extendedStats.totalArticles, // ✅ Mudado de totalNews para totalArticles
    sentiments: extendedStats.sentimentTrends,
    topCategories: extendedStats.topCategories.length,
  })

  useEffect(() => {
    if (hasNews && !isLoading && currentStatsString !== stableStatsRef.current) {
      stableStatsRef.current = currentStatsString
      setPreviousStats((prev) => prev || extendedStats)
      setStatsHistory((prev) => [...prev.slice(-9), extendedStats])
      setLastUpdateTime(new Date())
    }
  }, [hasNews, isLoading, currentStatsString, extendedStats])

  // === ANALYSIS FUNCTIONS ===
  const getStatsByCategory = useCallback(
    (category: string) => {
      const categoryNews = dataToAnalyze.filter((article) => article.category === category)
      if (categoryNews.length === 0) return null

      const sentiments = categoryNews.reduce(
        (acc, article) => {
          const sentiment = article.sentiment || 'neutral'
          if (sentiment in acc) {
            acc[sentiment as keyof typeof acc]++
          }
          return acc
        },
        { positive: 0, negative: 0, neutral: 0 },
      )

      const averageAge =
        categoryNews.reduce((sum, article) => {
          try {
            const age =
              (new Date().getTime() - new Date(article.publishedDate).getTime()) / (1000 * 60 * 60)
            return sum + Math.max(0, age)
          } catch {
            return sum
          }
        }, 0) / Math.max(1, categoryNews.length)

      return {
        category,
        count: categoryNews.length,
        percentage: Math.round((categoryNews.length / Math.max(1, dataToAnalyze.length)) * 100),
        sentiments,
        averageAge,
      }
    },
    [dataToAnalyze],
  )

  const getStatsBySource = useCallback(
    (source: string) => {
      const sourceNews = dataToAnalyze.filter((article) => article.source === source)
      if (sourceNews.length === 0) return null

      return {
        source,
        count: sourceNews.length,
        percentage: Math.round((sourceNews.length / Math.max(1, dataToAnalyze.length)) * 100),
        categories: sourceNews.reduce(
          (acc, article) => {
            const category = article.category || 'other'
            acc[category] = (acc[category] || 0) + 1
            return acc
          },
          {} as Record<string, number>,
        ),
      }
    },
    [dataToAnalyze],
  )

  const getTimeSeriesData = useCallback(
    (interval: 'hour' | 'day' = 'hour', last = 24) => {
      const now = new Date()
      const series: Array<{
        time: string
        count: number
        sentiment: { positive: number; negative: number; neutral: number }
      }> = []

      for (let i = last - 1; i >= 0; i--) {
        const timePoint = new Date(now)

        if (interval === 'hour') {
          timePoint.setHours(timePoint.getHours() - i)
          timePoint.setMinutes(0, 0, 0)
        } else {
          timePoint.setDate(timePoint.getDate() - i)
          timePoint.setHours(0, 0, 0, 0)
        }

        const nextTimePoint = new Date(timePoint)
        if (interval === 'hour') {
          nextTimePoint.setHours(nextTimePoint.getHours() + 1)
        } else {
          nextTimePoint.setDate(nextTimePoint.getDate() + 1)
        }

        const articlesInPeriod = dataToAnalyze.filter((article) => {
          try {
            const publishedDate = new Date(article.publishedDate)
            return publishedDate >= timePoint && publishedDate < nextTimePoint
          } catch {
            return false
          }
        })

        const sentiment = articlesInPeriod.reduce(
          (acc, article) => {
            const s = article.sentiment || 'neutral'
            if (s in acc) {
              acc[s as keyof typeof acc]++
            }
            return acc
          },
          { positive: 0, negative: 0, neutral: 0 },
        )

        series.push({
          time: timePoint.toISOString(),
          count: articlesInPeriod.length,
          sentiment,
        })
      }

      return series
    },
    [dataToAnalyze],
  )

  // ✅ FIX: getTrendData com validação
  const getTrendData = useCallback(
    (field: keyof ExtendedNewsStats): StatsTrend | null => {
      if (!previousStats || !enableTrends) return null

      const current = extendedStats[field]
      const previous = previousStats[field]

      if (typeof current !== 'number' || typeof previous !== 'number') return null

      const change = current - previous
      const changePercentage = previous !== 0 ? Math.round((change / previous) * 100) : 0

      return {
        current,
        previous,
        change,
        changePercentage,
        trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
      }
    },
    [extendedStats, previousStats, enableTrends],
  )

  // === REAL-TIME UPDATES ===
  useEffect(() => {
    if (!enableRealTimeUpdates) return

    const interval = setInterval(() => {
      console.log('🔄 Real-time stats update')
    }, 30000)

    return () => clearInterval(interval)
  }, [enableRealTimeUpdates])

  // === LOAD NEWS IF NEEDED ===
  useEffect(() => {
    if (!hasNews && !isLoading) {
      loadNews()
    }
  }, [hasNews, isLoading, loadNews])

  // === RETORNO DO HOOK ===
  return {
    // Stats principais
    stats: extendedStats,
    basicStats: basicStats || {
      totalNews: 0,
      filteredCount: 0,
      categories: {},
      sources: 0,
      sentiments: { positive: 0, negative: 0, neutral: 0 },
    },
    previousStats,
    statsHistory,
    lastUpdateTime,

    // Funções de análise
    getStatsByCategory,
    getStatsBySource,
    getTimeSeriesData,
    getTrendData,

    // Helpers para componentes
    isEmpty: dataToAnalyze.length === 0,
    hasData: dataToAnalyze.length > 0,
    isStale: new Date().getTime() - lastUpdateTime.getTime() > 300000, // 5 minutos

    // ✅ FIX: Quick stats com propriedades corretas
    quickStats: {
      totalArticles: extendedStats.totalArticles || 0,
      newToday: extendedStats.timeDistribution?.last24h || 0,
      avgReadingTime: `${Math.round(extendedStats.readingTime?.average || 0)}min`,
      topCategory: extendedStats.topCategories?.[0]?.category || 'N/A',
      dominantSentiment: (() => {
        const sentiments = extendedStats.sentimentBreakdown || {
          positive: 0,
          negative: 0,
          neutral: 0,
        }
        return Object.entries(sentiments).sort(([, a], [, b]) => b - a)[0]?.[0] || 'neutral'
      })(),
    },

    // Configuração
    options: { includeFiltered, enableTrends, enableRealTimeUpdates },
    dataSource: includeFiltered ? 'filtered' : 'all',
    currentFilters: filters,

    // Debug & export
    exportStats: () => JSON.stringify(extendedStats, null, 2),
    debugInfo: {
      dataToAnalyze: dataToAnalyze.length,
      calculations,
      trends: enableTrends,
      realTime: enableRealTimeUpdates,
    },
  }
}

export default useNewsStats
