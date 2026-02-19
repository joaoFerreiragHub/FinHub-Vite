import { socialService } from '@/features/social/services/socialService'
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

describe('socialService notifications p1.2', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('maps notification preferences from backend shape', async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      data: {
        notificationPreferences: {
          follow: true,
          comment: true,
          reply: false,
          rating: true,
          like: false,
          mention: true,
          content_published: false,
        },
      },
    })

    const result = await socialService.getNotificationPreferences()

    expect(mockedApiClient.get).toHaveBeenCalledWith('/notifications/preferences')
    expect(result).toEqual({
      follow: true,
      comment: true,
      reply: false,
      rating: true,
      like: false,
      mention: true,
      contentPublished: false,
    })
  })

  it('translates preferences patch payload to backend keys', async () => {
    mockedApiClient.patch.mockResolvedValueOnce({
      data: {
        notificationPreferences: {
          follow: true,
          comment: true,
          reply: true,
          rating: true,
          like: true,
          mention: true,
          content_published: true,
        },
      },
    })

    await socialService.updateNotificationPreferences({
      contentPublished: true,
      like: true,
      comment: true,
    })

    expect(mockedApiClient.patch).toHaveBeenCalledWith('/notifications/preferences', {
      content_published: true,
      like: true,
      comment: true,
    })
  })

  it('maps creator subscriptions list response', async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      data: {
        items: [
          {
            creatorId: 'creator-1',
            eventType: 'content_published',
            isSubscribed: true,
            hasOverride: false,
            followedAt: '2026-02-19T10:00:00.000Z',
            creator: {
              id: 'creator-1',
              name: 'Ana Silva',
              username: 'ana-silva',
            },
          },
        ],
        pagination: {
          page: 1,
          limit: 20,
          total: 1,
          pages: 1,
        },
      },
    })

    const response = await socialService.getCreatorSubscriptions({ page: 1, limit: 20 })

    expect(mockedApiClient.get).toHaveBeenCalledWith('/notifications/subscriptions', {
      params: {
        page: 1,
        limit: 20,
      },
    })
    expect(response.total).toBe(1)
    expect(response.hasMore).toBe(false)
    expect(response.items[0]).toMatchObject({
      creatorId: 'creator-1',
      eventType: 'content_published',
      isSubscribed: true,
      hasOverride: false,
    })
  })

  it('calls subscribe and unsubscribe creator endpoints', async () => {
    mockedApiClient.put.mockResolvedValueOnce({
      data: {
        creatorId: 'creator-2',
        eventType: 'content_published',
        isSubscribed: true,
        hasOverride: true,
      },
    })
    mockedApiClient.delete.mockResolvedValueOnce({
      data: {
        creatorId: 'creator-2',
        eventType: 'content_published',
        isSubscribed: false,
        hasOverride: true,
      },
    })

    const subscribe = await socialService.subscribeToCreator('creator-2')
    const unsubscribe = await socialService.unsubscribeFromCreator('creator-2')

    expect(mockedApiClient.put).toHaveBeenCalledWith('/notifications/subscriptions/creator-2')
    expect(mockedApiClient.delete).toHaveBeenCalledWith('/notifications/subscriptions/creator-2')
    expect(subscribe.isSubscribed).toBe(true)
    expect(unsubscribe.isSubscribed).toBe(false)
  })
})
