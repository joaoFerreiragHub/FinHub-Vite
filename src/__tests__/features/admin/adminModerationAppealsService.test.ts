import { adminModerationAppealsService } from '@/features/admin/services/adminModerationAppealsService'
import { apiClient } from '@/lib/api/client'

jest.mock('@/lib/api/client', () => ({
  apiClient: {
    get: jest.fn(),
    patch: jest.fn(),
  },
}))

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>

describe('adminModerationAppealsService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('maps appeals list response and forwards query params', async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      data: {
        items: [
          {
            id: 'appeal-1',
            contentType: 'article',
            contentId: 'article-1',
            appellant: {
              id: 'user-1',
              name: 'Ana',
              role: 'creator',
            },
            status: 'open',
            severity: 'high',
            reasonCategory: 'policy_dispute',
            reason: 'Pedido de revisao',
            note: null,
            slaHours: 48,
            openedAt: '2026-03-12T10:00:00.000Z',
            dueAt: '2026-03-14T10:00:00.000Z',
            sla: {
              isBreached: false,
              remainingMinutes: 120,
              firstResponseMinutes: null,
              resolutionMinutes: null,
            },
            createdBy: {
              id: 'user-1',
              name: 'Ana',
              role: 'creator',
            },
            updatedBy: {
              id: 'admin-1',
              name: 'Ops',
              role: 'admin',
            },
            version: 2,
            historyCount: 1,
            lastHistoryEntry: {
              fromStatus: 'open',
              toStatus: 'open',
              reason: 'appeal_opened',
              note: null,
              changedAt: '2026-03-12T10:00:00.000Z',
              changedBy: {
                id: 'user-1',
                name: 'Ana',
                role: 'creator',
              },
            },
            createdAt: '2026-03-12T10:00:00.000Z',
            updatedAt: '2026-03-12T10:10:00.000Z',
          },
        ],
        pagination: {
          page: 2,
          limit: 20,
          total: 34,
          pages: 2,
        },
        summary: {
          open: 12,
          underReview: 5,
          accepted: 8,
          rejected: 6,
          closed: 3,
          breachedSla: 2,
          total: 34,
        },
      },
    })

    const result = await adminModerationAppealsService.list({
      status: 'open',
      severity: 'high',
      contentType: 'article',
      breachedSla: false,
      search: 'ana',
      page: 2,
      limit: 20,
    })

    expect(mockedApiClient.get).toHaveBeenCalledWith('/admin/content/appeals', {
      params: {
        status: 'open',
        severity: 'high',
        contentType: 'article',
        breachedSla: 'false',
        search: 'ana',
        page: 2,
        limit: 20,
      },
    })
    expect(result.pagination.total).toBe(34)
    expect(result.summary.open).toBe(12)
    expect(result.items[0]).toMatchObject({
      id: 'appeal-1',
      status: 'open',
      severity: 'high',
      appellant: {
        id: 'user-1',
      },
      sla: {
        isBreached: false,
        remainingMinutes: 120,
      },
    })
  })

  it('maps appeal detail response including history', async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      data: {
        id: 'appeal-2',
        contentType: 'video',
        contentId: 'video-7',
        status: 'under_review',
        severity: 'critical',
        reasonCategory: 'false_positive',
        reason: 'Conteudo educativo',
        note: 'A aguardar validacao',
        slaHours: 72,
        openedAt: '2026-03-10T08:00:00.000Z',
        firstResponseAt: '2026-03-10T10:00:00.000Z',
        resolvedAt: null,
        dueAt: '2026-03-13T08:00:00.000Z',
        sla: {
          isBreached: false,
          remainingMinutes: 60,
          firstResponseMinutes: 120,
          resolutionMinutes: null,
        },
        version: 3,
        historyCount: 2,
        history: [
          {
            fromStatus: 'open',
            toStatus: 'under_review',
            reason: 'Triagem iniciada',
            note: null,
            changedAt: '2026-03-10T10:00:00.000Z',
            changedBy: {
              id: 'admin-1',
              name: 'Ops',
              role: 'admin',
            },
          },
        ],
        createdAt: '2026-03-10T08:00:00.000Z',
        updatedAt: '2026-03-10T10:00:00.000Z',
      },
    })

    const result = await adminModerationAppealsService.getById('appeal-2')

    expect(mockedApiClient.get).toHaveBeenCalledWith('/admin/content/appeals/appeal-2')
    expect(result).toMatchObject({
      id: 'appeal-2',
      status: 'under_review',
      severity: 'critical',
      historyCount: 2,
      history: [
        {
          fromStatus: 'open',
          toStatus: 'under_review',
        },
      ],
    })
  })

  it('sends status update payload and maps mutation response', async () => {
    mockedApiClient.patch.mockResolvedValueOnce({
      data: {
        message: 'Estado da apelacao atualizado com sucesso.',
        item: {
          id: 'appeal-3',
          contentType: 'comment',
          contentId: 'comment-9',
          status: 'accepted',
          severity: 'medium',
          reasonCategory: 'context_missing',
          reason: 'Contexto validado',
          note: 'Reversao autorizada',
          slaHours: 48,
          openedAt: '2026-03-11T10:00:00.000Z',
          dueAt: '2026-03-13T10:00:00.000Z',
          sla: {
            isBreached: false,
            remainingMinutes: 1200,
            firstResponseMinutes: 90,
            resolutionMinutes: 600,
          },
          version: 4,
          historyCount: 3,
          createdAt: '2026-03-11T10:00:00.000Z',
          updatedAt: '2026-03-12T12:00:00.000Z',
        },
      },
    })

    const result = await adminModerationAppealsService.updateStatus('appeal-3', {
      status: 'accepted',
      reason: 'Contexto validado',
      note: 'Reversao autorizada',
    })

    expect(mockedApiClient.patch).toHaveBeenCalledWith(
      '/admin/content/appeals/appeal-3/status',
      {
        status: 'accepted',
        reason: 'Contexto validado',
        note: 'Reversao autorizada',
      },
    )
    expect(result).toMatchObject({
      message: 'Estado da apelacao atualizado com sucesso.',
      item: {
        id: 'appeal-3',
        status: 'accepted',
        reason: 'Contexto validado',
      },
    })
  })
})
