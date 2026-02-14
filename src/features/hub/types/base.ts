import { User, UserRole } from '@/features/auth/types'

/**
 * Tipos de conteúdo suportados no HUB
 */
export enum ContentType {
  ARTICLE = 'article',
  COURSE = 'course',
  VIDEO = 'video',
  EVENT = 'event',
  BOOK = 'book',
  PODCAST = 'podcast',
  NEWS = 'news',
}

/**
 * Categorias principais de conteúdo
 */
export enum ContentCategory {
  // Finanças Pessoais
  PERSONAL_FINANCE = 'personal_finance',
  BUDGETING = 'budgeting',
  SAVING = 'saving',
  DEBT = 'debt',

  // Investimentos
  STOCKS = 'stocks',
  CRYPTO = 'crypto',
  REAL_ESTATE = 'real_estate',
  FUNDS = 'funds',

  // Educação
  BASICS = 'basics',
  ADVANCED = 'advanced',
  TRENDS = 'trends',

  // Outros
  NEWS = 'news',
  TOOLS = 'tools',
  LIFESTYLE = 'lifestyle',
}

/**
 * Status de publicação
 */
export enum PublishStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
  SCHEDULED = 'scheduled',
}

/**
 * Interface base para TODOS os conteúdos do HUB
 * Todos os tipos específicos (Article, Course, etc.) estendem esta interface
 */
export interface BaseContent {
  // Identificação
  id: string
  type: ContentType
  slug: string

  // Conteúdo básico
  title: string
  description: string // Resumo/excerpt curto
  coverImage?: string
  thumbnailImage?: string

  // Autoria
  creator: User | string // Pode ser User object ou ID
  creatorId: string

  // Categorização
  category: ContentCategory
  tags: string[]

  // Métricas de engajamento
  viewCount: number
  likeCount: number
  favoriteCount: number
  shareCount: number

  // Ratings & Reviews
  averageRating: number // 0-5
  ratingCount: number
  reviewCount: number

  // Comentários
  commentCount: number
  commentsEnabled: boolean

  // Controle de acesso
  requiredRole: UserRole // Mínimo role necessário para ver
  isPremium: boolean // Shortcut para requiredRole >= PREMIUM
  isFeatured: boolean // Destaque na homepage

  // Publicação
  status: PublishStatus
  isPublished: boolean
  publishedAt?: string // ISO date
  scheduledFor?: string // ISO date

  // Timestamps
  createdAt: string // ISO date
  updatedAt: string // ISO date

  // SEO
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string[]
}

/**
 * Dados para criar conteúdo (genérico)
 */
export interface CreateContentDto {
  title: string
  description: string
  coverImage?: string
  category: ContentCategory
  tags?: string[]
  requiredRole?: UserRole
  isPremium?: boolean
  status?: PublishStatus
  scheduledFor?: string
}

/**
 * Dados para atualizar conteúdo (genérico)
 */
export interface UpdateContentDto {
  title?: string
  description?: string
  coverImage?: string
  category?: ContentCategory
  tags?: string[]
  requiredRole?: UserRole
  isPremium?: boolean
  status?: PublishStatus
  scheduledFor?: string
  commentsEnabled?: boolean
  isFeatured?: boolean
}

/**
 * Filtros para buscar conteúdo (genérico)
 */
export interface ContentFilters {
  type?: ContentType | ContentType[]
  category?: ContentCategory | ContentCategory[]
  tags?: string[]
  creatorId?: string
  isPremium?: boolean
  isFeatured?: boolean
  status?: PublishStatus
  search?: string // Busca em título e descrição
  requiredRole?: UserRole
  minRating?: number
  dateFrom?: string
  dateTo?: string
  sortBy?: 'recent' | 'popular' | 'rating' | 'views'
  limit?: number
  offset?: number
}

/**
 * Resposta paginada de conteúdo
 */
export interface ContentListResponse<T extends BaseContent> {
  items: T[]
  total: number
  limit: number
  offset: number
  hasMore: boolean
}

/**
 * Estatísticas de conteúdo
 */
export interface ContentStats {
  totalViews: number
  totalLikes: number
  totalFavorites: number
  totalComments: number
  averageRating: number
  totalRatings: number
  engagementRate: number // (likes + comments + favorites) / views
}

/**
 * Interação do usuário com conteúdo
 */
export interface UserContentInteraction {
  contentId: string
  contentType: ContentType
  userId: string
  hasLiked: boolean
  hasFavorited: boolean
  hasRated: boolean
  userRating?: number
  lastViewedAt?: string
  viewCount: number
}
