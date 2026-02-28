import { adminOperationalAlertsService } from '@/features/admin/services/adminOperationalAlertsService'
import { apiClient } from '@/lib/api/client'

jest.mock('@/lib/api/client', () => ({
  apiClient: {
    get: jest.fn(),
  },
}))

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>

describe('adminOperationalAlertsService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('maps extended operational alert payload', async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      data: {
        generatedAt: '2026-02-28T10:00:00.000Z',
        windowHours: 24,
        thresholds: {
          hideSpikeCount: 5,
          hideSpikeWindowMinutes: 30,
          reportPriorityMin: 'high',
          reportMinOpenReports: 3,
          creatorControlRestrictiveActions: ['set_cooldown', 'block_publishing'],
        },
        summary: {
          critical: 2,
          high: 1,
          medium: 0,
          total: 3,
        },
        items: [
          {
            id: 'alert-1',
            type: 'critical_report_target',
            severity: 'critical',
            title: 'Alvo com pressao de reports',
            description: '6 reports abertos.',
            action: 'admin.content.queue.review',
            resourceType: 'content',
            resourceId: 'article:123',
            detectedAt: '2026-02-28T09:58:00.000Z',
            actor: null,
            metadata: {
              priority: 'critical',
            },
          },
          {
            id: 'alert-2',
            type: 'policy_auto_hide_failed',
            severity: 'critical',
            title: 'Auto-hide preventivo falhou',
            description: 'Falha no hide.',
            action: 'admin.content.policy_auto_hide',
            resourceType: 'content',
            detectedAt: '2026-02-28T09:59:00.000Z',
            actor: {
              id: 'admin-1',
              role: 'admin',
            },
          },
        ],
      },
    })

    const result = await adminOperationalAlertsService.getInternalAlerts({
      windowHours: 24,
      limit: 5,
    })

    expect(mockedApiClient.get).toHaveBeenCalledWith('/admin/alerts/internal', {
      params: { windowHours: 24, limit: 5 },
    })
    expect(result.thresholds).toMatchObject({
      reportPriorityMin: 'high',
      reportMinOpenReports: 3,
      creatorControlRestrictiveActions: ['set_cooldown', 'block_publishing'],
    })
    expect(result.items[0]).toMatchObject({
      type: 'critical_report_target',
      severity: 'critical',
      resourceId: 'article:123',
    })
    expect(result.items[1]).toMatchObject({
      type: 'policy_auto_hide_failed',
      actor: { id: 'admin-1' },
    })
  })
})
