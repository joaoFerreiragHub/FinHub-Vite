import { adminModerationTemplatesService } from '@/features/admin/services/adminModerationTemplatesService'
import { apiClient } from '@/lib/api/client'

jest.mock('@/lib/api/client', () => ({
  apiClient: {
    get: jest.fn(),
  },
}))

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>

describe('adminModerationTemplatesService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('maps list response and forwards filters', async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      data: {
        items: [
          {
            id: 'tmpl-1',
            code: 'content_hide_policy',
            label: 'Ocultacao por politica',
            reason: 'Violacao de politica de conteudo',
            defaultNote: 'Aguardar revisao editorial.',
            tags: ['hide', 'policy'],
            active: true,
            requiresNote: true,
            requiresDoubleConfirm: false,
            version: 3,
            createdBy: {
              id: 'admin-1',
              name: 'Admin',
              role: 'admin',
            },
            updatedBy: {
              id: 'admin-2',
              name: 'Supervisor',
              role: 'admin',
            },
            historyCount: 3,
            lastHistoryEntry: {
              version: 3,
              changeType: 'updated',
              changedAt: '2026-03-12T10:00:00.000Z',
              changedBy: {
                id: 'admin-2',
                name: 'Supervisor',
                role: 'admin',
              },
              changeReason: 'refino_operacional',
              snapshot: {
                label: 'Ocultacao por politica',
                reason: 'Violacao de politica de conteudo',
                defaultNote: 'Aguardar revisao editorial.',
                tags: ['hide', 'policy'],
                active: true,
                requiresNote: true,
                requiresDoubleConfirm: false,
              },
            },
            createdAt: '2026-03-10T10:00:00.000Z',
            updatedAt: '2026-03-12T10:00:00.000Z',
          },
        ],
        pagination: {
          page: 1,
          limit: 50,
          total: 1,
          pages: 1,
        },
      },
    })

    const result = await adminModerationTemplatesService.list({
      active: true,
      tag: 'hide',
      search: 'politica',
      page: 1,
      limit: 50,
    })

    expect(mockedApiClient.get).toHaveBeenCalledWith('/admin/content/moderation-templates', {
      params: {
        active: 'true',
        tag: 'hide',
        search: 'politica',
        page: 1,
        limit: 50,
      },
    })
    expect(result.pagination.total).toBe(1)
    expect(result.items[0]).toMatchObject({
      id: 'tmpl-1',
      code: 'content_hide_policy',
      requiresNote: true,
      tags: ['hide', 'policy'],
      lastHistoryEntry: {
        changeType: 'updated',
      },
    })
  })

  it('maps template detail from getById', async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      data: {
        id: 'tmpl-2',
        code: 'content_unhide_false_positive',
        label: 'Reativacao por falso positivo',
        reason: 'False positive validado',
        defaultNote: null,
        tags: ['unhide', 'false_positive'],
        active: true,
        requiresNote: false,
        requiresDoubleConfirm: true,
        version: 2,
        createdBy: {
          id: 'admin-1',
          name: 'Admin',
          role: 'admin',
        },
        updatedBy: {
          id: 'admin-3',
          name: 'Quality',
          role: 'admin',
        },
        historyCount: 2,
        lastHistoryEntry: {
          version: 2,
          changeType: 'status_change',
          changedAt: '2026-03-12T11:00:00.000Z',
          changedBy: {
            id: 'admin-3',
            name: 'Quality',
            role: 'admin',
          },
          changeReason: 'template_activated',
          snapshot: {
            label: 'Reativacao por falso positivo',
            reason: 'False positive validado',
            defaultNote: null,
            tags: ['unhide', 'false_positive'],
            active: true,
            requiresNote: false,
            requiresDoubleConfirm: true,
          },
        },
        createdAt: '2026-03-11T09:00:00.000Z',
        updatedAt: '2026-03-12T11:00:00.000Z',
      },
    })

    const result = await adminModerationTemplatesService.getById('tmpl-2')

    expect(mockedApiClient.get).toHaveBeenCalledWith('/admin/content/moderation-templates/tmpl-2')
    expect(result).toMatchObject({
      id: 'tmpl-2',
      code: 'content_unhide_false_positive',
      requiresDoubleConfirm: true,
      historyCount: 2,
      updatedBy: {
        id: 'admin-3',
      },
    })
  })

  it('throws when detail payload does not include template id', async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      data: {
        code: 'invalid',
      },
    })

    await expect(adminModerationTemplatesService.getById('invalid')).rejects.toThrow(
      'Resposta admin invalida: template em falta.',
    )
  })
})
