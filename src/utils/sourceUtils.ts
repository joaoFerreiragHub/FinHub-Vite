// src/components/noticias/utils/sourceUtils.ts

// ✅ Configuração das fontes (exportada para reutilização)
export const sourceConfig = {
  'yahoo finance': {
    label: 'Yahoo Finance',
    icon: '📈',
    color:
      'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900 dark:text-purple-200',
    description: 'Yahoo Finance - Notícias gratuitas e confiáveis',
  },
  yahoo: {
    label: 'Yahoo Finance',
    icon: '📈',
    color:
      'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900 dark:text-purple-200',
    description: 'Yahoo Finance - Notícias gratuitas e confiáveis',
  },
  'financial modeling prep': {
    label: 'FMP',
    icon: '💼',
    color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200',
    description: 'Financial Modeling Prep - API Premium',
  },
  fmp: {
    label: 'FMP',
    icon: '💼',
    color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200',
    description: 'Financial Modeling Prep - API Premium',
  },
  'news api': {
    label: 'News API',
    icon: '📰',
    color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200',
    description: 'News API - Agregador global de notícias',
  },
  newsapi: {
    label: 'News API',
    icon: '📰',
    color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200',
    description: 'News API - Agregador global de notícias',
  },
  'alpha vantage': {
    label: 'Alpha Vantage',
    icon: '📊',
    color:
      'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-200',
    description: 'Alpha Vantage - Dados com análise de sentimento',
  },
  alphavantage: {
    label: 'Alpha Vantage',
    icon: '📊',
    color:
      'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-200',
    description: 'Alpha Vantage - Dados com análise de sentimento',
  },
  polygon: {
    label: 'Polygon',
    icon: '🔺',
    color: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200',
    description: 'Polygon.io - Dados de mercado premium',
  },
  'polygon.io': {
    label: 'Polygon',
    icon: '🔺',
    color: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200',
    description: 'Polygon.io - Dados de mercado premium',
  },
  marketaux: {
    label: 'MarketAux',
    icon: '📋',
    color: 'bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900 dark:text-teal-200',
    description: 'MarketAux - Agregador de notícias financeiras',
  },
  cryptopanic: {
    label: 'CryptoPanic',
    icon: '₿',
    color:
      'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200',
    description: 'CryptoPanic - Notícias de criptomoedas',
  },
  finnhub: {
    label: 'Finnhub',
    icon: '📈',
    color:
      'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900 dark:text-indigo-200',
    description: 'Finnhub - Dados financeiros em tempo real',
  },
} as const

// ✅ Tipo para informações da fonte
export interface SourceInfo {
  label: string
  icon: string
  color: string
  description: string
}

// ✅ Função utilitária para obter informações da fonte
export const getSourceInfo = (source: string): SourceInfo => {
  const sourceLower = source.toLowerCase().trim()

  let config = sourceConfig[sourceLower as keyof typeof sourceConfig]

  if (!config) {
    const partialMatch = Object.keys(sourceConfig).find(
      (key) => key.includes(sourceLower) || sourceLower.includes(key),
    )
    if (partialMatch) {
      config = sourceConfig[partialMatch as keyof typeof sourceConfig]
    }
  }

  return (
    config || {
      label: source,
      icon: '📄',
      color: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200',
      description: source,
    }
  )
}

// ✅ Helpers para verificação de fonte específica
export const isYahooSource = (source: string): boolean => {
  const sourceLower = source.toLowerCase()
  return sourceLower.includes('yahoo')
}

export const isFMPSource = (source: string): boolean => {
  const sourceLower = source.toLowerCase()
  return sourceLower.includes('fmp') || sourceLower.includes('financial modeling')
}

export const isNewsAPISource = (source: string): boolean => {
  const sourceLower = source.toLowerCase()
  return sourceLower.includes('newsapi') || sourceLower.includes('news api')
}

export const isAlphaVantageSource = (source: string): boolean => {
  const sourceLower = source.toLowerCase()
  return sourceLower.includes('alpha') || sourceLower.includes('vantage')
}

export const isPolygonSource = (source: string): boolean => {
  const sourceLower = source.toLowerCase()
  return sourceLower.includes('polygon')
}

// ✅ Helper para obter estatísticas de fonte
export const getSourceStats = (articles: Array<{ source: string }>) => {
  const stats = {
    yahoo: 0,
    fmp: 0,
    newsapi: 0,
    alphavantage: 0,
    polygon: 0,
    other: 0,
  }

  articles.forEach((article) => {
    if (isYahooSource(article.source)) stats.yahoo++
    else if (isFMPSource(article.source)) stats.fmp++
    else if (isNewsAPISource(article.source)) stats.newsapi++
    else if (isAlphaVantageSource(article.source)) stats.alphavantage++
    else if (isPolygonSource(article.source)) stats.polygon++
    else stats.other++
  })

  return stats
}

// ✅ Lista de todas as fontes suportadas
export const getAllSources = () => Object.values(sourceConfig)

// ✅ Obter fonte mais usada
export const getMostUsedSource = (articles: Array<{ source: string }>): SourceInfo | null => {
  if (articles.length === 0) return null

  const sourceCount = new Map<string, number>()

  articles.forEach((article) => {
    const info = getSourceInfo(article.source)
    const count = sourceCount.get(info.label) || 0
    sourceCount.set(info.label, count + 1)
  })

  const [mostUsedLabel] = [...sourceCount.entries()].sort((a, b) => b[1] - a[1])[0] || []

  if (!mostUsedLabel) return null

  // Encontrar a primeira fonte que corresponde ao label
  const sourceEntry = Object.values(sourceConfig).find((config) => config.label === mostUsedLabel)
  return sourceEntry || null
}
