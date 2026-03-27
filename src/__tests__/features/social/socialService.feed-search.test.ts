import { socialService } from '@/features/social/services/socialService'
import { ContentCategory, ContentType } from '@/features/hub/types'
import { apiClient } from '@/lib/api/client'

jest.mock('@/lib/api/client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}))

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>

describe('socialService feed + search contracts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('maps feed payload with _id fallback and normalized categories', async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      data: {
        items: [
          {
            type: 'content_published',
            content: {
              _id: 'feed-item-1',
              type: 'video',
              title: 'Video de teste',
              description: 'Descricao',
              creator: {
                id: 'creator-1',
                name: 'Ana',
                avatar: 'https://example.com/avatar.png',
              },
              category: 'personal_finance',
              tags: ['financas'],
              views: 21,
              likes: 9,
              favorites: 3,
              ratingsCount: 2,
              commentsCount: 4,
              isPremium: false,
              isFeatured: true,
              createdAt: '2026-03-24T10:00:00.000Z',
              updatedAt: '2026-03-24T10:00:00.000Z',
            },
            createdAt: '2026-03-24T10:00:00.000Z',
          },
        ],
        pagination: {
          page: 1,
          limit: 20,
          total: 1,
          pages: 1,
        },
        filters: {
          following: false,
        },
      },
    })

    const response = await socialService.getActivityFeed({ following: false, page: 1, limit: 20 })

    expect(mockedApiClient.get).toHaveBeenCalledWith('/feed', {
      params: {
        following: false,
        page: 1,
        limit: 20,
      },
    })

    expect(response.items).toHaveLength(1)
    expect(response.items[0]).toMatchObject({
      creatorName: 'Ana',
      creatorAvatar: 'https://example.com/avatar.png',
      content: {
        id: 'feed-item-1',
        slug: 'feed-item-1',
        category: ContentCategory.PERSONAL_FINANCE,
        viewCount: 21,
        likeCount: 9,
        favoriteCount: 3,
        ratingCount: 2,
        commentCount: 4,
      },
    })
    expect(response.following).toBe(false)
  })

  it('maps search payload from items shape and normalizes navigation url', async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      data: {
        items: [
          {
            _id: 'event-1',
            type: 'live',
            title: 'Live de ETFs',
            description: 'Evento semanal',
            url: 'hub/lives/live-etfs',
            score: '12.5',
          },
          {
            _id: 'creator-10',
            type: 'creator',
            name: 'Ana Silva',
            username: 'ana-silva',
            score: 9,
          },
        ],
        total: 2,
        q: 'etf',
      },
    })

    const response = await socialService.search('  etf  ', { type: ContentType.EVENT })

    expect(mockedApiClient.get).toHaveBeenCalledWith('/search', {
      params: {
        q: 'etf',
        type: ContentType.EVENT,
      },
    })

    expect(response.query).toBe('etf')
    expect(response.total).toBe(2)
    expect(response.results[0]).toMatchObject({
      id: 'event-1',
      type: ContentType.EVENT,
      url: '/hub/lives/live-etfs',
      score: 12.5,
    })
    expect(response.results[1]).toMatchObject({
      id: 'creator-10',
      type: 'creator',
      url: '/creators/ana-silva',
    })
  })

  it('returns empty search result without API call when query is too short', async () => {
    const response = await socialService.search('  ')

    expect(mockedApiClient.get).not.toHaveBeenCalled()
    expect(response).toEqual({
      results: [],
      total: 0,
      query: '',
    })
  })
})
