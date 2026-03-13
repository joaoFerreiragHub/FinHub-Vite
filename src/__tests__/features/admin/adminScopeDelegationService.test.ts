import { adminScopeDelegationService } from '@/features/admin/services/adminScopeDelegationService'
import { apiClient } from '@/lib/api/client'

jest.mock('@/lib/api/client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
  },
}))

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>

describe('adminScopeDelegationService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('maps list response and forwards filters', async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      data: {
        items: [
          {
            id: 'deleg-1',
            scope: 'admin.content.read',
            status: 'active',
            reason: 'Turno de cobertura',
            note: 'Equipe B',
            delegatedBy: { id: 'admin-1', email: 'lead@finhub.pt', role: 'admin' },
            delegatedTo: { id: 'admin-2', email: 'ops@finhub.pt', role: 'admin' },
            startsAt: '2026-03-13T10:00:00.000Z',
            expiresAt: '2026-03-13T18:00:00.000Z',
            createdAt: '2026-03-13T10:00:00.000Z',
            updatedAt: '2026-03-13T10:00:00.000Z',
          },
        ],
        pagination: {
          page: 2,
          limit: 12,
          total: 14,
          pages: 2,
        },
      },
    })

    const result = await adminScopeDelegationService.list('admin-2', {
      status: 'active',
      scope: 'admin.content.read',
      page: 2,
      limit: 12,
    })

    expect(mockedApiClient.get).toHaveBeenCalledWith('/admin/users/admin-2/scope-delegations', {
      params: {
        status: 'active',
        scope: 'admin.content.read',
        page: 2,
        limit: 12,
      },
    })
    expect(result.items[0]).toMatchObject({
      id: 'deleg-1',
      status: 'active',
      scope: 'admin.content.read',
    })
    expect(result.pagination).toMatchObject({
      page: 2,
      total: 14,
      pages: 2,
    })
  })

  it('sends normalized payload on create', async () => {
    mockedApiClient.post.mockResolvedValueOnce({
      data: {
        message: 'Delegacao temporaria de scopes registada com sucesso.',
        items: [],
        summary: {
          scopesRequested: 2,
          delegationsAffected: 2,
          maxDelegationHours: 336,
        },
      },
    })

    await adminScopeDelegationService.create('admin-2', {
      scopes: ['admin.content.read', 'admin.content.moderate'],
      expiresAt: '2026-03-14T10:00:00.000Z',
      reason: ' cobertura de turno ',
      note: ' valida ate amanha ',
    })

    expect(mockedApiClient.post).toHaveBeenCalledWith('/admin/users/admin-2/scope-delegations', {
      scopes: ['admin.content.read', 'admin.content.moderate'],
      expiresAt: '2026-03-14T10:00:00.000Z',
      reason: 'cobertura de turno',
      note: 'valida ate amanha',
    })
  })

  it('maps revoke response', async () => {
    mockedApiClient.post.mockResolvedValueOnce({
      data: {
        message: 'Delegacao temporaria revogada com sucesso.',
        changed: true,
        item: {
          id: 'deleg-1',
          scope: 'admin.content.read',
          status: 'revoked',
          reason: 'Turno de cobertura',
          revokeReason: 'Fim de turno',
          revokedAt: '2026-03-13T18:05:00.000Z',
        },
      },
    })

    const result = await adminScopeDelegationService.revoke('admin-2', 'deleg-1', {
      reason: ' fim de turno ',
      note: ' equipa principal de volta ',
    })

    expect(mockedApiClient.post).toHaveBeenCalledWith(
      '/admin/users/admin-2/scope-delegations/deleg-1/revoke',
      {
        reason: 'fim de turno',
        note: 'equipa principal de volta',
      },
    )
    expect(result).toMatchObject({
      changed: true,
      item: {
        id: 'deleg-1',
        status: 'revoked',
        revokeReason: 'Fim de turno',
      },
    })
  })
})
