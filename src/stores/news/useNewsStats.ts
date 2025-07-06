// src/components/noticias/hooks/useNewsStats.ts
import { useMemo, useCallback, useEffect, useState } from 'react'
import { NewsStats } from '../../types/news'
import { useNewsSelectors, useNewsStore } from '../useNewsStore'

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
  groupBySource?: boolean
  groupByCategory?: boolean
  groupByTime?: 'hour' | 'day' | 'week' | 'month'
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
  const {
    includeFiltered = true,
    enableTrends = true,
    enableRealTimeUpdates = false,
    groupBySource = true,
    groupByCategory = true,
    groupByTime = 'day',
  } = options

  // === STORE STATE ===
  const { news, filteredNews, stats: basicStats, loadNews, filters } = useNewsStore()

  const { hasNews, isLoading } = useNewsSelectors()

  // === LOCAL STATE PARA TRENDS ===
  const [previousStats, setPreviousStats] = useState<ExtendedNewsStats | null>(null)
  const [statsHistory, setStatsHistory] = useState<ExtendedNewsStats[]>([])
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date())

  // === ESCOLHER DATASET ===
  const dataToAnalyze = useMemo(() => {
    return includeFiltered ? filteredNews : news
  }, [includeFiltered, filteredNews, news])

  // === CÁLCULOS BASE ===
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

    // === CÁLCULO DE IDADE MÉDIA ===
    const ages = dataToAnalyze.map((article) => {
      const publishedDate = new Date(article.publishedDate)
      return (now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60) // horas
    })
    const averageAge = ages.reduce((sum, age) => sum + age, 0) / ages.length

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

    // === DISTRIBUIÇÃO TEMPORAL ===
    const timeDistribution = dataToAnalyze.reduce(
      (acc, article) => {
        const publishedDate = new Date(article.publishedDate)
        const hoursAgo = (now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60)

        if (hoursAgo <= 24) acc.last24h++
        else if (hoursAgo <= 168)
          acc.last7days++ // 7 dias
        else if (hoursAgo <= 720)
          acc.last30days++ // 30 dias
        else acc.older++

        return acc
      },
      { last24h: 0, last7days: 0, last30days: 0, older: 0 },
    )

    // === TEMPO DE LEITURA ===
    const readingTimes = dataToAnalyze.map((article) => {
      // Estimativa: 200 palavras por minuto
      const wordCount = (article.content || article.summary || '').split(' ').length
      return Math.max(1, Math.ceil(wordCount / 200))
    })

    const averageReadingTime =
      readingTimes.reduce((sum, time) => sum + time, 0) / readingTimes.length
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

  // === CÁLCULO DE SENTIMENT TRENDS ===
  const sentimentTrends = useMemo(() => {
    if (!enableTrends || !previousStats) {
      return {
        positive: { count: basicStats.sentiments.positive, trend: 'stable' as const },
        negative: { count: basicStats.sentiments.negative, trend: 'stable' as const },
        neutral: { count: basicStats.sentiments.neutral, trend: 'stable' as const },
      }
    }

    const getTrend = (current: number, previous: number) => {
      if (current > previous) return 'up'
      if (current < previous) return 'down'
      return 'stable'
    }

    return {
      positive: {
        count: basicStats.sentiments.positive,
        trend: getTrend(basicStats.sentiments.positive, previousStats.sentiments.positive),
      },
      negative: {
        count: basicStats.sentiments.negative,
        trend: getTrend(basicStats.sentiments.negative, previousStats.sentiments.negative),
      },
      neutral: {
        count: basicStats.sentiments.neutral,
        trend: getTrend(basicStats.sentiments.neutral, previousStats.sentiments.neutral),
      },
    }
  }, [enableTrends, previousStats, basicStats.sentiments])

  // === CÁLCULO DE ENGAGEMENT (simulado) ===
  const engagement = useMemo(() => {
    // Em um cenário real, estes dados viriam de analytics
    const totalClicks = dataToAnalyze.length * Math.floor(Math.random() * 100) // Simulado
    const clickThroughRate = Math.random() * 0.1 // 0-10%

    // Score baseado em recência, sentimento e fonte
    const popularityScore =
      dataToAnalyze.reduce((score, article) => {
        const ageInHours =
          (new Date().getTime() - new Date(article.publishedDate).getTime()) / (1000 * 60 * 60)
        const recencyBonus = Math.max(0, 100 - ageInHours) // Bonus por recência
        const sentimentBonus = article.sentiment === 'positive' ? 20 : 0
        return score + recencyBonus + sentimentBonus
      }, 0) / dataToAnalyze.length

    return {
      totalClicks,
      clickThroughRate,
      popularityScore: Math.round(popularityScore),
    }
  }, [dataToAnalyze])

  // === EXTENDED STATS ===
  const extendedStats: ExtendedNewsStats = useMemo(
    () => ({
      ...basicStats,
      ...calculations,
      sentimentTrends,
      engagement,
    }),
    [basicStats, calculations, sentimentTrends, engagement],
  )

  // === FUNÇÕES DE ANÁLISE ===
  const getStatsByCategory = useCallback(
    (category: string) => {
      const categoryNews = dataToAnalyze.filter((article) => article.category === category)
      if (categoryNews.length === 0) return null

      const sentiments = categoryNews.reduce(
        (acc, article) => {
          const sentiment = article.sentiment || 'neutral'
          acc[sentiment as keyof typeof acc]++
          return acc
        },
        { positive: 0, negative: 0, neutral: 0 },
      )

      return {
        category,
        count: categoryNews.length,
        percentage: Math.round((categoryNews.length / dataToAnalyze.length) * 100),
        sentiments,
        averageAge:
          categoryNews.reduce((sum, article) => {
            const age =
              (new Date().getTime() - new Date(article.publishedDate).getTime()) / (1000 * 60 * 60)
            return sum + age
          }, 0) / categoryNews.length,
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
        percentage: Math.round((sourceNews.length / dataToAnalyze.length) * 100),
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
        sentiment: typeof basicStats.sentiments
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
          const publishedDate = new Date(article.publishedDate)
          return publishedDate >= timePoint && publishedDate < nextTimePoint
        })

        const sentiment = articlesInPeriod.reduce(
          (acc, article) => {
            const s = article.sentiment || 'neutral'
            acc[s as keyof typeof acc]++
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

  // === COMPARAÇÕES E TRENDS ===
  const getTrendData = useCallback(
    (field: keyof ExtendedNewsStats): StatsTrend | null => {
      if (!previousStats || !enableTrends) return null

      const current = extendedStats[field] as number
      const previous = previousStats[field] as number

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

  // === ATUALIZAR HISTÓRICO ===
  useEffect(() => {
    if (hasNews && !isLoading) {
      setPreviousStats(extendedStats)
      setStatsHistory((prev) => [...prev.slice(-9), extendedStats]) // Manter últimos 10
      setLastUpdateTime(new Date())
    }
  }, [extendedStats, hasNews, isLoading])

  // === REAL-TIME UPDATES ===
  useEffect(() => {
    if (!enableRealTimeUpdates) return

    const interval = setInterval(() => {
      console.log('🔄 Real-time stats update')
      // Em um cenário real, isto poderia trigger um reload seletivo
    }, 30000) // 30 segundos

    return () => clearInterval(interval)
  }, [enableRealTimeUpdates])

  // === CARREGAR STATS SE NÃO HÁ NEWS ===
  useEffect(() => {
    if (!hasNews && !isLoading) {
      loadNews()
    }
  }, [hasNews, isLoading, loadNews])

  // === RETORNO DO HOOK ===
  return {
    // Stats principais
    stats: extendedStats,
    basicStats,
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

    // Quick stats para dashboards
    quickStats: {
      totalArticles: extendedStats.totalNews,
      newToday: extendedStats.timeDistribution.last24h,
      avgReadingTime: `${Math.round(extendedStats.readingTime.average)}min`,
      topCategory: extendedStats.topCategories[0]?.category || 'N/A',
      dominantSentiment:
        Object.entries(extendedStats.sentiments).sort(([, a], [, b]) => b - a)[0]?.[0] || 'neutral',
    },

    // Configuração
    options,
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
