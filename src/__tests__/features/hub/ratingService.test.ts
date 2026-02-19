import { ratingService } from '@/features/hub/services/ratingService'
import { apiClient } from '@/lib/api/client'

jest.mock('@/lib/api/client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  },
}))

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>

describe('ratingService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('maps ratings list from backend shape and translates rating sort', async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      data: {
        ratings: [
          {
            _id: 'rating-1',
            targetType: 'article',
            targetId: 'article-1',
            user: {
              _id: 'user-1',
              name: 'Ana',
              username: 'ana',
              avatar: 'avatar.png',
            },
            rating: 5,
            review: 'Excelente',
            likes: 12,
            dislikes: 3,
            createdAt: '2026-02-18T00:00:00.000Z',
            updatedAt: '2026-02-18T00:00:00.000Z',
          },
        ],
        pagination: {
          page: 2,
          limit: 10,
          total: 21,
          pages: 3,
        },
      },
    })

    const response = await ratingService.getRatings('article', 'article-1', {
      page: 2,
      limit: 10,
      sortBy: 'rating',
    })

    expect(mockedApiClient.get).toHaveBeenCalledWith('/ratings/article/article-1', {
      params: {
        page: 2,
        limit: 10,
        sort: 'rating-high',
      },
    })

    expect(response.total).toBe(21)
    expect(response.offset).toBe(10)
    expect(response.hasMore).toBe(true)
    expect(response.items[0]).toMatchObject({
      id: 'rating-1',
      targetType: 'article',
      targetId: 'article-1',
      userId: 'user-1',
      likes: 12,
      dislikes: 3,
      helpfulCount: 12,
      review: 'Excelente',
    })
  })

  it('maps stats and computes percentages', async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      data: {
        average: 4.2,
        total: 10,
        distribution: {
          '1': 1,
          '2': 1,
          '3': 1,
          '4': 2,
          '5': 5,
        },
        reviews: {
          withText: 7,
          totalLikes: 20,
          totalDislikes: 4,
        },
      },
    })

    const stats = await ratingService.getRatingStats('article', 'article-1')

    expect(stats.averageRating).toBe(4.2)
    expect(stats.totalRatings).toBe(10)
    expect(stats.distribution[5]).toBe(5)
    expect(stats.percentages[5]).toBe(50)
    expect(stats.reviews).toEqual({
      withText: 7,
      totalLikes: 20,
      totalDislikes: 4,
    })
  })

  it('returns null for getMyRating when backend returns 404', async () => {
    mockedApiClient.get.mockRejectedValueOnce({
      isAxiosError: true,
      response: { status: 404 },
    })

    const result = await ratingService.getMyRating('article', 'article-1')
    expect(result).toBeNull()
  })

  it('maps create/update and reaction responses', async () => {
    mockedApiClient.post.mockResolvedValueOnce({
      data: {
        _id: 'rating-created',
        targetType: 'live',
        targetId: 'live-1',
        user: 'user-2',
        rating: 4,
        review: 'Bom evento',
        likes: 0,
        dislikes: 0,
        createdAt: '2026-02-18T00:00:00.000Z',
        updatedAt: '2026-02-18T00:00:00.000Z',
      },
    })

    await ratingService.createOrUpdateRating({
      targetType: 'live',
      targetId: 'live-1',
      rating: 4,
      review: 'Bom evento',
    })

    expect(mockedApiClient.post).toHaveBeenCalledWith('/ratings', {
      targetType: 'live',
      targetId: 'live-1',
      rating: 4,
      review: 'Bom evento',
    })

    mockedApiClient.post.mockResolvedValueOnce({
      data: {
        reaction: 'like',
        updated: true,
        message: 'Reacao registada',
        rating: {
          _id: 'rating-1',
          targetType: 'article',
          targetId: 'article-1',
          user: 'user-3',
          rating: 5,
          review: 'Otimo',
          likes: 6,
          dislikes: 1,
          createdAt: '2026-02-18T00:00:00.000Z',
          updatedAt: '2026-02-18T00:00:00.000Z',
        },
      },
    })

    const reactionResult = await ratingService.reactToRating('rating-1', 'like')

    expect(mockedApiClient.post).toHaveBeenLastCalledWith('/ratings/rating-1/reaction', {
      reaction: 'like',
    })

    expect(reactionResult).toMatchObject({
      reaction: 'like',
      updated: true,
      message: 'Reacao registada',
    })
    expect(reactionResult.rating).toMatchObject({
      id: 'rating-1',
      likes: 6,
      dislikes: 1,
      helpfulCount: 6,
    })
  })
})
