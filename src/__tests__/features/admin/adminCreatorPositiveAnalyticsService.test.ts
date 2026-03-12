import { adminCreatorPositiveAnalyticsService } from '@/features/admin/services/adminCreatorPositiveAnalyticsService'
import { apiClient } from '@/lib/api/client'

jest.mock('@/lib/api/client', () => ({
  apiClient: {
    get: jest.fn(),
  },
}))

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>

describe('adminCreatorPositiveAnalyticsService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('maps list payload and forwards filters', async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      data: {
        items: [
          {
            creatorId: 'creator-1',
            creator: {
              id: 'creator-1',
              name: 'Creator One',
              username: 'creator1',
              email: 'creator1@example.com',
              accountStatus: 'active',
              followers: 1234,
              following: 45,
              createdAt: '2026-03-01T08:00:00.000Z',
              lastActiveAt: '2026-03-12T08:00:00.000Z',
            },
            content: {
              total: 12,
              published: 10,
              premiumPublished: 3,
              featuredPublished: 1,
              byType: {
                article: { total: 6, published: 5 },
                video: { total: 2, published: 2 },
              },
            },
            growth: {
              windowDays: 30,
              followsLastWindow: 120,
              followsPrevWindow: 90,
              followsDelta: 30,
              followsTrendPercent: 33.3,
              publishedLastWindow: 4,
              publishedPrevWindow: 2,
              publishedDelta: 2,
              score: 580.5,
            },
            engagement: {
              views: 54321,
              likes: 1200,
              favorites: 300,
              comments: 111,
              ratingsCount: 28,
              averageRating: 4.6,
              actionsTotal: 1611,
              actionsPerPublished: 161.1,
              score: 998.4,
            },
            trust: {
              trustScore: 87.2,
              riskLevel: 'medium',
              recommendedAction: 'review',
              openReports: 2,
              highPriorityTargets: 1,
              criticalTargets: 0,
              falsePositiveRate30d: 8.2,
            },
          },
        ],
        pagination: {
          page: 2,
          limit: 20,
          total: 55,
          pages: 3,
        },
        sort: {
          sortBy: 'engagement',
          sortOrder: 'asc',
        },
        summary: {
          totalCreators: 55,
          avgGrowthScore: 120.2,
          avgEngagementScore: 210.3,
          avgTrustScore: 88.8,
        },
      },
    })

    const result = await adminCreatorPositiveAnalyticsService.list({
      page: 2,
      limit: 20,
      search: 'creator',
      accountStatus: 'active',
      riskLevel: 'medium',
      sortBy: 'engagement',
      sortOrder: 'asc',
      windowDays: 30,
    })

    expect(mockedApiClient.get).toHaveBeenCalledWith('/admin/creators/analytics/positive', {
      params: {
        page: 2,
        limit: 20,
        search: 'creator',
        accountStatus: 'active',
        riskLevel: 'medium',
        sortBy: 'engagement',
        sortOrder: 'asc',
        windowDays: 30,
      },
    })

    expect(result.summary).toEqual({
      totalCreators: 55,
      avgGrowthScore: 120.2,
      avgEngagementScore: 210.3,
      avgTrustScore: 88.8,
    })
    expect(result.items[0]).toMatchObject({
      creatorId: 'creator-1',
      creator: {
        id: 'creator-1',
        username: 'creator1',
      },
      growth: {
        score: 580.5,
      },
      trust: {
        riskLevel: 'medium',
        recommendedAction: 'review',
      },
    })
    expect(result.items[0].content.byType.course).toEqual({ total: 0, published: 0 })
  })

  it('calls export endpoint with blob response', async () => {
    mockedApiClient.get.mockResolvedValueOnce({ data: 'creatorId,name\n1,Ana' })

    const createObjectURL = jest.fn(() => 'blob:mock')
    const revokeObjectURL = jest.fn()
    Object.defineProperty(window.URL, 'createObjectURL', {
      value: createObjectURL,
      writable: true,
      configurable: true,
    })
    Object.defineProperty(window.URL, 'revokeObjectURL', {
      value: revokeObjectURL,
      writable: true,
      configurable: true,
    })

    const appendSpy = jest.spyOn(document.body, 'appendChild')
    const removeSpy = jest.spyOn(Element.prototype, 'remove')
    const clickSpy = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined)

    await adminCreatorPositiveAnalyticsService.exportCsv({
      search: 'ana',
      sortBy: 'growth',
      sortOrder: 'desc',
      windowDays: 30,
      maxRows: 200,
    })

    expect(mockedApiClient.get).toHaveBeenCalledWith('/admin/creators/analytics/positive/export.csv', {
      params: {
        search: 'ana',
        sortBy: 'growth',
        sortOrder: 'desc',
        windowDays: 30,
        maxRows: 200,
      },
      responseType: 'blob',
    })

    expect(createObjectURL).toHaveBeenCalled()
    expect(appendSpy).toHaveBeenCalled()
    expect(clickSpy).toHaveBeenCalled()
    expect(removeSpy).toHaveBeenCalled()
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:mock')
  })
})
