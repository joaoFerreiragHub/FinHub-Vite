// types/news.ts

export interface NewsArticle {
  id: string
  title: string
  summary: string
  content?: string
  url: string
  image?: string
  source: string
  category: 'market' | 'crypto' | 'economy' | 'earnings' | 'general'
  sentiment?: 'positive' | 'negative' | 'neutral'
  publishedDate: string
  tickers?: string[]
  views?: number
  tags?: string[]
  author?: string
  readTime?: number
}

export interface NewsFilters {
  category: string
  searchTerm: string
  source?: string
  dateRange?: {
    from: Date
    to: Date
  }
  sentiment?: string
  tickers?: string[]
}

export interface NewsSource {
  id: string
  name: string
  url: string
  type: 'rss' | 'api' | 'scraper'
  enabled: boolean
  lastCheck?: string
  status: 'healthy' | 'error' | 'warning'
  categories: string[]
}

export interface NewsCategory {
  key: string
  label: string
  description?: string
  color?: string
  icon?: string
}

export interface NewsStats {
  totalArticles: number
  categoriesBreakdown: Record<string, number>
  sentimentBreakdown: Record<string, number>
  topSources: Array<{ source: string; count: number }>
  topTickers: Array<{ ticker: string; count: number }>
  dateRange: { from: string; to: string }
}
