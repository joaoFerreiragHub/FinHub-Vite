import { adminBroadcastsService } from '@/features/admin/services/adminBroadcastsService'
import { apiClient } from '@/lib/api/client'

jest.mock('@/lib/api/client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
  },
}))

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>

describe('adminBroadcastsService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('maps list response and forwards filters', async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      data: {
        items: [
          {
            id: 'broadcast-1',
            title: 'Comunicado',
            message: 'Mensagem de teste',
            channel: 'in_app',
            status: 'approved',
            segment: {
              roles: ['free', 'premium'],
              accountStatuses: ['active'],
              includeUsers: ['u-1'],
              excludeUsers: ['u-2'],
              lastActiveWithinDays: 30,
            },
            audienceEstimate: 120,
            approval: {
              required: true,
              approvedAt: '2026-03-12T10:00:00.000Z',
              approvedBy: {
                id: 'admin-1',
                name: 'Ops',
                role: 'admin',
              },
              reason: 'broadcast_approved',
            },
            delivery: {
              attempted: 120,
              sent: 118,
              failed: 2,
              sentAt: '2026-03-12T10:10:00.000Z',
              lastError: 'Falha parcial',
            },
            version: 2,
            historyCount: 3,
            lastHistoryEntry: {
              action: 'approved',
              reason: 'broadcast_approved',
              note: null,
              changedAt: '2026-03-12T10:00:00.000Z',
              changedBy: { id: 'admin-1', name: 'Ops', role: 'admin' },
            },
            createdAt: '2026-03-12T09:00:00.000Z',
            updatedAt: '2026-03-12T10:00:00.000Z',
          },
        ],
        pagination: {
          page: 1,
          limit: 15,
          total: 1,
          pages: 1,
        },
        summary: {
          draft: 0,
          approved: 1,
          sent: 0,
          failed: 0,
          canceled: 0,
          total: 1,
        },
      },
    })

    const result = await adminBroadcastsService.list({
      status: 'approved',
      channel: 'in_app',
      search: 'comunicado',
      page: 1,
      limit: 15,
    })

    expect(mockedApiClient.get).toHaveBeenCalledWith('/admin/communications/broadcasts', {
      params: {
        status: 'approved',
        channel: 'in_app',
        search: 'comunicado',
        page: 1,
        limit: 15,
      },
    })

    expect(result.summary.approved).toBe(1)
    expect(result.items[0]).toMatchObject({
      id: 'broadcast-1',
      status: 'approved',
      audienceEstimate: 120,
      segment: {
        roles: ['free', 'premium'],
        lastActiveWithinDays: 30,
      },
      approval: {
        required: true,
        approvedBy: { id: 'admin-1' },
      },
      delivery: {
        attempted: 120,
        failed: 2,
      },
    })
  })

  it('maps preview response and segment defaults', async () => {
    mockedApiClient.post.mockResolvedValueOnce({
      data: {
        segment: {
          roles: ['creator'],
          accountStatuses: ['active', 'suspended'],
          includeUsers: ['u-10'],
          excludeUsers: [],
          lastActiveWithinDays: 7,
        },
        estimatedRecipients: 42,
        approvalRequired: true,
        massApprovalMinRecipients: 40,
        sample: [
          {
            id: 'u-10',
            name: 'Ana',
            username: 'ana',
            email: 'ana@example.com',
            role: 'creator',
            accountStatus: 'active',
            lastActiveAt: '2026-03-11T12:00:00.000Z',
            createdAt: '2026-01-01T12:00:00.000Z',
          },
        ],
      },
    })

    const result = await adminBroadcastsService.previewAudience({
      segment: {
        roles: ['creator'],
        accountStatuses: ['active', 'suspended'],
        includeUsers: ['u-10'],
        lastActiveWithinDays: 7,
      },
      sampleLimit: 10,
    })

    expect(mockedApiClient.post).toHaveBeenCalledWith('/admin/communications/broadcasts/preview', {
      segment: {
        roles: ['creator'],
        accountStatuses: ['active', 'suspended'],
        includeUsers: ['u-10'],
        lastActiveWithinDays: 7,
      },
      sampleLimit: 10,
    })

    expect(result).toMatchObject({
      estimatedRecipients: 42,
      approvalRequired: true,
      massApprovalMinRecipients: 40,
      segment: {
        roles: ['creator'],
        accountStatuses: ['active', 'suspended'],
      },
      sample: [{ id: 'u-10', role: 'creator', accountStatus: 'active' }],
    })
  })

  it('sends reason and note on approve/send actions', async () => {
    mockedApiClient.post
      .mockResolvedValueOnce({
        data: {
          message: 'Broadcast aprovado com sucesso.',
          item: {
            id: 'broadcast-2',
            title: 'Aprovacao',
            message: '...',
            status: 'approved',
            channel: 'in_app',
            segment: {},
            audienceEstimate: 10,
            approval: { required: true },
            delivery: {},
          },
        },
      })
      .mockResolvedValueOnce({
        data: {
          message: 'Envio de broadcast executado.',
          item: {
            id: 'broadcast-2',
            title: 'Aprovacao',
            message: '...',
            status: 'sent',
            channel: 'in_app',
            segment: {},
            audienceEstimate: 10,
            approval: { required: true },
            delivery: { attempted: 10, sent: 10, failed: 0 },
          },
        },
      })

    await adminBroadcastsService.approve('broadcast-2', {
      reason: 'approved_via_ui',
      note: 'ok',
    })
    await adminBroadcastsService.send('broadcast-2', {
      reason: 'send_via_ui',
      note: 'run now',
    })

    expect(mockedApiClient.post).toHaveBeenNthCalledWith(
      1,
      '/admin/communications/broadcasts/broadcast-2/approve',
      {
        reason: 'approved_via_ui',
        note: 'ok',
      },
    )
    expect(mockedApiClient.post).toHaveBeenNthCalledWith(
      2,
      '/admin/communications/broadcasts/broadcast-2/send',
      {
        reason: 'send_via_ui',
        note: 'run now',
      },
    )
  })
})
