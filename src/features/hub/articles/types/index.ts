import { BaseContent, ContentType, ContentCategory } from '../../types'

/**
 * Article - Artigo educativo
 * Estende BaseContent com campos específicos
 */
export interface Article extends BaseContent {
  type: ContentType.ARTICLE

  // Conteúdo específico
  content: string // HTML ou Markdown
  excerpt: string // Resumo curto (diferente de description)

  // Metadata
  readTime: number // Tempo de leitura em minutos
  wordCount: number
  language: string // 'pt', 'en', etc.

  // Estrutura
  tableOfContents?: TableOfContentsItem[]

  // SEO & Social
  ogImage?: string // Open Graph image
  canonicalUrl?: string
}

/**
 * Item do índice (Table of Contents)
 */
export interface TableOfContentsItem {
  id: string
  title: string
  level: number // 1, 2, 3 (h1, h2, h3)
  children?: TableOfContentsItem[]
}

/**
 * Dados para criar Article
 */
export interface CreateArticleDto {
  title: string
  description: string
  content: string
  excerpt?: string
  coverImage?: string
  category: ContentCategory
  tags?: string[]
  requiredRole?: 'visitor' | 'free' | 'premium'
  isPremium?: boolean
  status?: 'draft' | 'published' | 'scheduled'
  scheduledFor?: string
  language?: string
}

/**
 * Dados para atualizar Article
 */
export interface UpdateArticleDto {
  title?: string
  description?: string
  content?: string
  excerpt?: string
  coverImage?: string
  category?: ContentCategory
  tags?: string[]
  requiredRole?: 'visitor' | 'free' | 'premium'
  isPremium?: boolean
  status?: 'draft' | 'published' | 'scheduled'
  scheduledFor?: string
  commentsEnabled?: boolean
  isFeatured?: boolean
}

/**
 * Filtros específicos de Article
 */
export interface ArticleFilters {
  category?: ContentCategory
  tags?: string[]
  creatorId?: string
  isPremium?: boolean
  isFeatured?: boolean
  status?: 'draft' | 'published' | 'archived'
  search?: string
  minRating?: number
  sortBy?: 'recent' | 'popular' | 'rating' | 'views'
  limit?: number
  offset?: number
}
