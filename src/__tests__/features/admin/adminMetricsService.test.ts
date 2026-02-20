import { adminMetricsService } from '@/features/admin/services/adminMetricsService'
import { apiClient } from '@/lib/api/client'

jest.mock('@/lib/api/client', () => ({
  apiClient: {
    get: jest.fn(),
  },
}))

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>

describe('adminMetricsService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('maps overview payload and keeps stable defaults', async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      data: {
        generatedAt: '2026-02-20T20:00:00.000Z',
        windows: {
          last24hStart: '2026-02-19T20:00:00.000Z',
          last7dStart: '2026-02-13T20:00:00.000Z',
          last30dStart: '2026-01-21T20:00:00.000Z',
        },
        usage: {
          dau: 42,
          wau: 120,
          mau: 380,
          totalUsers: 1500,
          newUsers: { last24h: 4, last7d: 17, last30d: 65 },
          retention: {
            eligibleUsers: 88,
            retainedUsers: 51,
            retainedRatePercent: 57.95,
          },
          roleDistribution: {
            free: 900,
            premium: 400,
            creator: 150,
            admin: 20,
          },
          funnel30d: {
            registered: 1500,
            active30d: 380,
            premiumOrHigher: 570,
            creatorOrAdmin: 170,
          },
        },
        engagement: {
          interactions: { last24h: 100, last7d: 530, last30d: 1800 },
          breakdown: {
            last24h: { follows: 20, favorites: 30, comments: 25, reviews: 25 },
            last7d: { follows: 120, favorites: 160, comments: 130, reviews: 120 },
            last30d: { follows: 430, favorites: 550, comments: 410, reviews: 410 },
          },
          contentPublishedLast7d: {
            total: 12,
            byType: { article: 5, video: 3, course: 2, live: 1, podcast: 1, book: 0 },
          },
        },
        moderation: {
          queue: {
            total: 50,
            hidden: 7,
            restricted: 2,
            visible: 41,
            byType: {
              total: {
                article: 10,
                video: 8,
                course: 7,
                live: 5,
                podcast: 4,
                book: 3,
                comment: 8,
                review: 5,
              },
            },
          },
          actions: {
            last24h: 9,
            last7d: 33,
            volumeByTypeLast7d: {
              article: 3,
              video: 4,
              course: 2,
              live: 1,
              podcast: 1,
              book: 1,
              comment: 12,
              review: 9,
            },
          },
          resolution: {
            sampleSize: 12,
            averageHours: 5.1,
            medianHours: 3.4,
          },
          recidivismLast30d: {
            repeatedTargets: 4,
            repeatedActors: 2,
          },
        },
        operations: {
          source: 'in_memory_since_process_boot',
          snapshotGeneratedAt: '2026-02-20T20:00:00.000Z',
          processUptimeSeconds: 3200,
          mongoReady: true,
          totalRequests: 11000,
          statusClassCounts: { '2xx': 10000, '4xx': 900, '5xx': 100 },
          errorRatePercent: 0.91,
          availabilityPercent: 99.09,
          avgLatencyMs: 72.4,
          topSlowRoutes: [
            {
              method: 'GET',
              route: '/api/admin/metrics/overview',
              requests: 20,
              avgLatencyMs: 210.5,
            },
          ],
          topErrorRoutes: [
            {
              method: 'POST',
              route: '/api/admin/content/article/123/hide',
              requests: 15,
              errors5xx: 2,
              errorRatePercent: 13.33,
            },
          ],
          adminAuditLast24h: {
            success: 21,
            forbidden: 2,
            error: 1,
            total: 24,
          },
        },
      },
    })

    const result = await adminMetricsService.getOverview()

    expect(mockedApiClient.get).toHaveBeenCalledWith('/admin/metrics/overview')
    expect(result.usage.dau).toBe(42)
    expect(result.usage.roleDistribution.visitor).toBe(0)
    expect(result.engagement.contentPublishedLast7d.byType.article).toBe(5)
    expect(result.moderation.queue.byType.hidden.comment).toBe(0)
    expect(result.operations.statusClassCounts['3xx']).toBe(0)
    expect(result.operations.topSlowRoutes[0]).toMatchObject({
      method: 'GET',
      route: '/api/admin/metrics/overview',
    })
  })
})
