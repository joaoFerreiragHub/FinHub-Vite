import { User } from '@/features/auth/types'
import { ContentType } from './base'

/**
 * Rating de um conteúdo
 * Sistema universal para todos os tipos de conteúdo
 */
export interface Rating {
  id: string

  // Conteúdo alvo
  targetType: ContentType
  targetId: string

  // Usuário
  user: User | string
  userId: string

  // Rating
  rating: number // 1-5 estrelas
  review?: string // Review textual (opcional)

  // Engagement
  helpfulCount: number // Quantas pessoas marcaram como útil

  // Timestamps
  createdAt: string
  updatedAt: string
}

/**
 * Dados para criar rating
 */
export interface CreateRatingDto {
  targetType: ContentType
  targetId: string
  rating: number // 1-5
  review?: string
}

/**
 * Dados para atualizar rating
 */
export interface UpdateRatingDto {
  rating?: number
  review?: string
}

/**
 * Filtros para buscar ratings
 */
export interface RatingFilters {
  targetType?: ContentType
  targetId?: string
  userId?: string
  minRating?: number
  maxRating?: number
  hasReview?: boolean
  sortBy?: 'recent' | 'helpful' | 'rating'
  limit?: number
  offset?: number
}

/**
 * Resposta de lista de ratings
 */
export interface RatingListResponse {
  items: Rating[]
  total: number
  limit: number
  offset: number
  hasMore: boolean
  averageRating: number
  ratingDistribution: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
}

/**
 * Estatísticas de ratings
 */
export interface RatingStats {
  averageRating: number
  totalRatings: number
  distribution: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
  percentages: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
}
