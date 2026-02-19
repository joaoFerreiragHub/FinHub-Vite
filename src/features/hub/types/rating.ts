export type RatingTargetType =
  | 'article'
  | 'course'
  | 'video'
  | 'book'
  | 'podcast'
  | 'live'
  | 'creator'
  | 'brand'

export type RatingSort = 'recent' | 'helpful' | 'rating'
export type RatingReaction = 'like' | 'dislike'
export type ReviewReactionInput = RatingReaction | 'none'

export interface RatingUser {
  id: string
  name?: string
  username?: string
  avatar?: string
}

/**
 * Rating/review de um conteudo
 */
export interface Rating {
  id: string
  targetType: RatingTargetType
  targetId: string
  user: RatingUser | string
  userId: string
  rating: number
  review?: string
  helpfulCount: number
  likes: number
  dislikes: number
  myReaction?: RatingReaction | null
  createdAt: string
  updatedAt: string
}

export interface CreateRatingDto {
  targetType: RatingTargetType
  targetId: string
  rating: number
  review?: string
}

export interface UpdateRatingDto {
  rating?: number
  review?: string
}

export interface RatingFilters {
  targetType?: RatingTargetType
  targetId?: string
  userId?: string
  minRating?: number
  maxRating?: number
  hasReview?: boolean
  sortBy?: RatingSort | 'rating-high' | 'rating-low'
  limit?: number
  offset?: number
}

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
  reviews?: {
    withText: number
    totalLikes: number
    totalDislikes: number
  }
}

export interface RatingReactionResult {
  reaction: RatingReaction | null
  updated: boolean
  message: string
  rating?: Rating
}
