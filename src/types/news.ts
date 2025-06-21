// types/news.ts

export interface NewsArticle {
  id: string
  title: string
  summary: string
  content: string
  publishedDate: string
  source: string
  url: string
  image?: string
  category: 'market' | 'crypto' | 'economy' | 'earnings' | 'general'
  tickers?: string[]
  sentiment?: 'positive' | 'negative' | 'neutral'
  views?: number
}

export interface FMPNewsResponse {
  title: string
  date: string
  content: string
  tickers: string
  image: string
  link: string
  author: string
  site: string
}

export interface NewsFilters {
  category: string
  searchTerm: string
  source?: string
  dateRange?: {
    from: Date
    to: Date
  }
}

export interface NewsSource {
  id: string
  name: string
  description: string
  enabled: boolean
  category: string
  apiEndpoint?: string
  icon: React.ReactNode
}
