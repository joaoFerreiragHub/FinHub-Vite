import { ContentType, ContentCategory, PublishStatus } from '../../types'
import { UserRole } from '@/features/auth/types'
import type { BaseContent } from '../../types'
import type { NewsArticle } from '../types/news'

/**
 * NewsContent - NewsArticle adaptado para BaseContent
 * Permite que noticias sejam usadas nos componentes genericos (ContentCard, ContentList)
 */
export interface NewsContent extends BaseContent {
  type: ContentType.NEWS
  source: string
  sentiment?: 'positive' | 'negative' | 'neutral'
  tickers?: string[]
  externalUrl: string
}

/**
 * Mapeia uma categoria de news para ContentCategory
 */
function mapNewsCategory(category: NewsArticle['category']): ContentCategory {
  const categoryMap: Record<NewsArticle['category'], ContentCategory> = {
    market: ContentCategory.STOCKS,
    crypto: ContentCategory.CRYPTO,
    economy: ContentCategory.PERSONAL_FINANCE,
    earnings: ContentCategory.STOCKS,
    general: ContentCategory.NEWS,
  }
  return categoryMap[category] || ContentCategory.NEWS
}

/**
 * Converte um NewsArticle para o formato BaseContent
 * Permite renderizar noticias com ContentCard e ContentList
 */
export function toBaseContent(article: NewsArticle): NewsContent {
  return {
    // Identificacao
    id: article.id,
    type: ContentType.NEWS,
    slug: article.id,
    title: article.title,
    description: article.summary,
    excerpt: article.summary,
    content: article.content || article.summary,

    // Media
    coverImage: article.image,

    // Creator (fonte da noticia)
    creator: article.source,
    creatorId: article.source,

    // Classificacao
    category: mapNewsCategory(article.category),
    tags: article.tags || [],

    // Metricas (noticias nao tem metricas internas, defaults)
    viewCount: article.views || 0,
    likeCount: 0,
    favoriteCount: 0,
    shareCount: 0,
    averageRating: 0,
    ratingCount: 0,
    reviewCount: 0,
    commentCount: 0,
    commentsEnabled: false,

    // Acesso
    requiredRole: UserRole.VISITOR,
    isPremium: false,
    isFeatured: false,

    // Status
    status: PublishStatus.PUBLISHED,
    isPublished: true,

    // Datas
    language: 'pt',
    publishedAt: article.publishedDate,
    createdAt: article.publishedDate,
    updatedAt: article.publishedDate,

    // News-specific
    source: article.source,
    sentiment: article.sentiment,
    tickers: article.tickers,
    externalUrl: article.url,
  }
}

/**
 * Converte um array de NewsArticle para BaseContent
 */
export function toBaseContentList(articles: NewsArticle[]): NewsContent[] {
  return articles.map(toBaseContent)
}
