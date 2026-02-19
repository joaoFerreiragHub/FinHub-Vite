import axios from 'axios'
import { apiClient } from '@/lib/api/client'
import { ContentType } from '../types'
import type {
  CreateRatingDto,
  Rating,
  RatingFilters,
  RatingListResponse,
  RatingReaction,
  RatingReactionResult,
  RatingStats,
  RatingTargetType,
  ReviewReactionInput,
} from '../types'

type ApiRatingUser = {
  _id?: string
  id?: string
  name?: string
  username?: string
  avatar?: string
}

type ApiRating = {
  _id?: string
  id?: string
  targetType: string
  targetId: string
  user?: ApiRatingUser | string
  rating: number
  review?: string
  likes?: number
  dislikes?: number
  helpfulCount?: number
  createdAt: string
  updatedAt: string
}

interface ApiRatingsListResponse {
  ratings: ApiRating[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

interface ApiRatingStatsResponse {
  average?: number
  total?: number
  distribution?: Partial<Record<'1' | '2' | '3' | '4' | '5', number>>
  reviews?: {
    withText: number
    totalLikes: number
    totalDislikes: number
  }
}

interface ApiMyReactionResponse {
  reaction: RatingReaction | null
}

interface ApiReactionResult {
  reaction: RatingReaction | null
  updated: boolean
  message: string
  rating?: ApiRating
}

interface ListRatingsOptions {
  page?: number
  limit?: number
  sortBy?: RatingFilters['sortBy']
}

const EMPTY_DISTRIBUTION = {
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
}

const toRatingTargetType = (value: string): RatingTargetType => {
  if (value === ContentType.EVENT) {
    return 'live'
  }

  return value as RatingTargetType
}

const normalizeTargetTypeForApi = (value: RatingTargetType | ContentType): RatingTargetType => {
  if (value === ContentType.EVENT) {
    return 'live'
  }

  return value as RatingTargetType
}

const toRating = (apiRating: ApiRating): Rating => {
  const likes = typeof apiRating.likes === 'number' ? apiRating.likes : 0
  const dislikes = typeof apiRating.dislikes === 'number' ? apiRating.dislikes : 0
  const helpfulCount = typeof apiRating.helpfulCount === 'number' ? apiRating.helpfulCount : likes

  const userPayload = apiRating.user
  const mappedUser =
    typeof userPayload === 'string' || !userPayload
      ? (userPayload ?? 'anonymous')
      : {
          id: userPayload.id ?? userPayload._id ?? 'unknown-user',
          name: userPayload.name,
          username: userPayload.username,
          avatar: userPayload.avatar,
        }

  const resolvedUserId = typeof mappedUser === 'string' ? mappedUser : mappedUser.id

  return {
    id: apiRating.id ?? apiRating._id ?? 'unknown-rating',
    targetType: toRatingTargetType(apiRating.targetType),
    targetId: apiRating.targetId,
    user: mappedUser,
    userId: resolvedUserId,
    rating: apiRating.rating,
    review: apiRating.review,
    helpfulCount,
    likes,
    dislikes,
    createdAt: apiRating.createdAt,
    updatedAt: apiRating.updatedAt,
  }
}

const mapSortForApi = (
  sortBy: RatingFilters['sortBy'],
): 'recent' | 'helpful' | 'rating-high' | 'rating-low' | undefined => {
  if (!sortBy) return undefined

  if (sortBy === 'rating') {
    return 'rating-high'
  }

  return sortBy
}

const mapDistribution = (
  distribution?: ApiRatingStatsResponse['distribution'],
): RatingStats['distribution'] => {
  if (!distribution) {
    return { ...EMPTY_DISTRIBUTION }
  }

  return {
    1: Number(distribution['1'] ?? 0),
    2: Number(distribution['2'] ?? 0),
    3: Number(distribution['3'] ?? 0),
    4: Number(distribution['4'] ?? 0),
    5: Number(distribution['5'] ?? 0),
  }
}

const getPercentages = (
  distribution: RatingStats['distribution'],
  totalRatings: number,
): RatingStats['percentages'] => {
  if (!totalRatings) {
    return {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    }
  }

  return {
    1: (distribution[1] / totalRatings) * 100,
    2: (distribution[2] / totalRatings) * 100,
    3: (distribution[3] / totalRatings) * 100,
    4: (distribution[4] / totalRatings) * 100,
    5: (distribution[5] / totalRatings) * 100,
  }
}

export const ratingService = {
  async getRatings(
    targetType: RatingTargetType | ContentType,
    targetId: string,
    options: ListRatingsOptions = {},
  ): Promise<RatingListResponse> {
    const page = options.page ?? 1
    const limit = options.limit ?? 10

    const response = await apiClient.get<ApiRatingsListResponse>(
      `/ratings/${normalizeTargetTypeForApi(targetType)}/${targetId}`,
      {
        params: {
          page,
          limit,
          sort: mapSortForApi(options.sortBy),
        },
      },
    )

    const mappedItems = Array.isArray(response.data.ratings)
      ? response.data.ratings.map(toRating)
      : []

    const total = response.data.pagination?.total ?? mappedItems.length
    const currentPage = response.data.pagination?.page ?? page
    const currentLimit = response.data.pagination?.limit ?? limit
    const totalPages = response.data.pagination?.pages ?? 1

    return {
      items: mappedItems,
      total,
      limit: currentLimit,
      offset: (currentPage - 1) * currentLimit,
      hasMore: currentPage < totalPages,
      averageRating: 0,
      ratingDistribution: { ...EMPTY_DISTRIBUTION },
    }
  },

  async getRatingStats(
    targetType: RatingTargetType | ContentType,
    targetId: string,
  ): Promise<RatingStats> {
    const response = await apiClient.get<ApiRatingStatsResponse>(
      `/ratings/${normalizeTargetTypeForApi(targetType)}/${targetId}/stats`,
    )

    const totalRatings = Number(response.data.total ?? 0)
    const distribution = mapDistribution(response.data.distribution)

    return {
      averageRating: Number(response.data.average ?? 0),
      totalRatings,
      distribution,
      percentages: getPercentages(distribution, totalRatings),
      reviews: response.data.reviews,
    }
  },

  async createOrUpdateRating(data: CreateRatingDto): Promise<Rating> {
    const response = await apiClient.post<ApiRating>('/ratings', {
      ...data,
      targetType: normalizeTargetTypeForApi(data.targetType),
    })

    return toRating(response.data)
  },

  async getMyRating(
    targetType: RatingTargetType | ContentType,
    targetId: string,
  ): Promise<Rating | null> {
    try {
      const response = await apiClient.get<ApiRating>(
        `/ratings/my/${normalizeTargetTypeForApi(targetType)}/${targetId}`,
      )

      return toRating(response.data)
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null
      }

      throw error
    }
  },

  async reactToRating(
    ratingId: string,
    reaction: ReviewReactionInput,
  ): Promise<RatingReactionResult> {
    const response = await apiClient.post<ApiReactionResult>(`/ratings/${ratingId}/reaction`, {
      reaction,
    })

    return {
      reaction: response.data.reaction,
      updated: response.data.updated,
      message: response.data.message,
      rating: response.data.rating ? toRating(response.data.rating) : undefined,
    }
  },

  async getMyRatingReaction(ratingId: string): Promise<RatingReaction | null> {
    try {
      const response = await apiClient.get<ApiMyReactionResponse>(
        `/ratings/${ratingId}/reaction/my`,
      )
      return response.data.reaction ?? null
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null
      }

      throw error
    }
  },

  async deleteRating(ratingId: string): Promise<void> {
    await apiClient.delete(`/ratings/${ratingId}`)
  },
}
