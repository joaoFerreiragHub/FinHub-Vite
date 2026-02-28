import { adminUsersService } from '@/features/admin/services/adminUsersService'
import { apiClient } from '@/lib/api/client'

jest.mock('@/lib/api/client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
  },
}))

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>

describe('adminUsersService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('maps users list response and forwards query params', async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      data: {
        items: [
          {
            id: 'user-1',
            email: 'ana@example.com',
            name: 'Ana',
            username: 'ana',
            role: 'creator',
            accountStatus: 'active',
            adminReadOnly: false,
            adminScopes: [],
            statusReason: null,
            statusChangedAt: null,
            statusChangedBy: null,
            creatorControls: {
              creationBlocked: false,
              creationBlockedReason: null,
              publishingBlocked: true,
              publishingBlockedReason: 'Risco elevado',
              cooldownUntil: '2026-02-20T01:00:00.000Z',
              updatedAt: '2026-02-19T02:00:00.000Z',
              updatedBy: {
                id: 'admin-9',
                name: 'Ops',
                role: 'admin',
              },
            },
            trustSignals: {
              trustScore: 42,
              riskLevel: 'high',
              recommendedAction: 'block_publishing',
              generatedAt: '2026-02-20T02:00:00.000Z',
              summary: {
                openReports: 5,
                highPriorityTargets: 2,
                criticalTargets: 1,
                hiddenItems: 1,
                restrictedItems: 0,
                recentModerationActions30d: 3,
                repeatModerationTargets30d: 1,
                recentCreatorControlActions30d: 1,
                activeControlFlags: ['publishing_blocked'],
              },
              flags: ['critical_report_targets'],
              reasons: ['1 alvo com reports criticos.'],
            },
            tokenVersion: 2,
            lastForcedLogoutAt: null,
            lastLoginAt: '2026-02-19T00:00:00.000Z',
            lastActiveAt: '2026-02-19T01:00:00.000Z',
            createdAt: '2026-02-18T00:00:00.000Z',
            updatedAt: '2026-02-19T01:00:00.000Z',
          },
        ],
        pagination: {
          page: 2,
          limit: 20,
          total: 44,
          pages: 3,
        },
      },
    })

    const result = await adminUsersService.listUsers({
      search: 'ana',
      role: 'creator',
      accountStatus: 'active',
      adminReadOnly: false,
      activeSinceDays: 30,
      page: 2,
      limit: 20,
      sortBy: 'updatedAt',
      sortOrder: 'desc',
    })

    expect(mockedApiClient.get).toHaveBeenCalledWith('/admin/users', {
      params: {
        search: 'ana',
        role: 'creator',
        accountStatus: 'active',
        adminReadOnly: false,
        activeSinceDays: 30,
        page: 2,
        limit: 20,
        sortBy: 'updatedAt',
        sortOrder: 'desc',
      },
    })
    expect(result.pagination.total).toBe(44)
    expect(result.items[0]).toMatchObject({
      id: 'user-1',
      role: 'creator',
      accountStatus: 'active',
      tokenVersion: 2,
      creatorControls: {
        publishingBlocked: true,
      },
      trustSignals: {
        trustScore: 42,
        riskLevel: 'high',
        recommendedAction: 'block_publishing',
      },
    })
  })

  it('maps moderation history records', async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      data: {
        items: [
          {
            id: 'evt-1',
            user: 'user-1',
            actor: {
              _id: 'admin-1',
              name: 'Admin',
              username: 'admin',
              role: 'admin',
            },
            action: 'status_change',
            fromStatus: 'active',
            toStatus: 'suspended',
            reason: 'Violacao temporaria',
            note: '3 denuncias',
            metadata: {
              tokenVersionBefore: 2,
              tokenVersionAfter: 3,
            },
            createdAt: '2026-02-19T11:20:00.000Z',
          },
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          pages: 1,
        },
      },
    })

    const result = await adminUsersService.getUserModerationHistory('user-1', 1, 10)

    expect(mockedApiClient.get).toHaveBeenCalledWith('/admin/users/user-1/history', {
      params: { page: 1, limit: 10 },
    })
    expect(result.items[0]).toMatchObject({
      id: 'evt-1',
      actor: { id: 'admin-1' },
      action: 'status_change',
      fromStatus: 'active',
      toStatus: 'suspended',
    })
  })

  it('sends action payload to governance endpoints', async () => {
    mockedApiClient.post.mockResolvedValueOnce({
      data: {
        message: 'Conta suspensa com sucesso.',
        changed: true,
        fromStatus: 'active',
        user: {
          id: 'user-1',
          email: 'ana@example.com',
          name: 'Ana',
          username: 'ana',
          role: 'creator',
          accountStatus: 'suspended',
          adminReadOnly: false,
          adminScopes: [],
          tokenVersion: 3,
          createdAt: '2026-02-18T00:00:00.000Z',
          updatedAt: '2026-02-19T11:30:00.000Z',
        },
      },
    })

    const result = await adminUsersService.suspendUser('user-1', {
      reason: 'Violacao temporaria',
      note: '3 denuncias',
    })

    expect(mockedApiClient.post).toHaveBeenCalledWith('/admin/users/user-1/suspend', {
      reason: 'Violacao temporaria',
      note: '3 denuncias',
    })
    expect(result).toMatchObject({
      message: 'Conta suspensa com sucesso.',
      changed: true,
      fromStatus: 'active',
      user: {
        id: 'user-1',
        accountStatus: 'suspended',
      },
    })
  })

  it('registers and maps internal notes', async () => {
    mockedApiClient.post.mockResolvedValueOnce({
      data: {
        message: 'Nota interna registada.',
        event: {
          id: 'evt-note-1',
          user: 'user-1',
          actor: {
            id: 'admin-1',
            name: 'Admin',
            role: 'admin',
          },
          action: 'internal_note',
          fromStatus: 'active',
          toStatus: 'active',
          reason: 'Contexto',
          note: 'Cliente contactou suporte.',
          createdAt: '2026-02-19T12:00:00.000Z',
        },
      },
    })

    const result = await adminUsersService.addUserInternalNote('user-1', {
      reason: 'Contexto',
      note: 'Cliente contactou suporte.',
    })

    expect(mockedApiClient.post).toHaveBeenCalledWith('/admin/users/user-1/notes', {
      reason: 'Contexto',
      note: 'Cliente contactou suporte.',
    })
    expect(result.event).toMatchObject({
      id: 'evt-note-1',
      action: 'internal_note',
      reason: 'Contexto',
      note: 'Cliente contactou suporte.',
    })
  })

  it('maps trust profile response', async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      data: {
        user: {
          id: 'creator-1',
          email: 'creator@example.com',
          name: 'Creator',
          username: 'creator',
          role: 'creator',
          accountStatus: 'active',
          adminReadOnly: false,
          adminScopes: [],
          creatorControls: {
            creationBlocked: false,
            creationBlockedReason: null,
            publishingBlocked: true,
            publishingBlockedReason: 'Risco elevado',
            cooldownUntil: null,
            updatedAt: '2026-02-20T02:00:00.000Z',
            updatedBy: { id: 'admin-1', name: 'Admin', role: 'admin' },
          },
          tokenVersion: 1,
          createdAt: '2026-02-18T00:00:00.000Z',
          updatedAt: '2026-02-20T02:00:00.000Z',
        },
        trustSignals: {
          trustScore: 31,
          riskLevel: 'critical',
          recommendedAction: 'suspend_creator_ops',
          generatedAt: '2026-02-20T03:00:00.000Z',
          summary: {
            openReports: 7,
            highPriorityTargets: 2,
            criticalTargets: 2,
            hiddenItems: 1,
            restrictedItems: 1,
            recentModerationActions30d: 5,
            repeatModerationTargets30d: 2,
            recentCreatorControlActions30d: 2,
            activeControlFlags: ['publishing_blocked'],
          },
          flags: ['critical_report_targets', 'publishing_blocked'],
          reasons: ['2 alvos criticos.'],
        },
      },
    })

    const result = await adminUsersService.getCreatorTrustProfile('creator-1')

    expect(mockedApiClient.get).toHaveBeenCalledWith('/admin/users/creator-1/trust-profile')
    expect(result).toMatchObject({
      user: {
        id: 'creator-1',
        creatorControls: {
          publishingBlocked: true,
        },
      },
      trustSignals: {
        trustScore: 31,
        riskLevel: 'critical',
        recommendedAction: 'suspend_creator_ops',
      },
    })
  })

  it('sends creator control payload and maps response', async () => {
    mockedApiClient.post.mockResolvedValueOnce({
      data: {
        message: 'Controlos operacionais do creator atualizados com sucesso.',
        action: 'set_cooldown',
        creatorControls: {
          creationBlocked: false,
          creationBlockedReason: null,
          publishingBlocked: false,
          publishingBlockedReason: null,
          cooldownUntil: '2026-02-21T00:00:00.000Z',
          updatedAt: '2026-02-20T00:00:00.000Z',
          updatedBy: { id: 'admin-1', name: 'Admin', role: 'admin' },
        },
        user: {
          id: 'creator-1',
          email: 'creator@example.com',
          name: 'Creator',
          username: 'creator',
          role: 'creator',
          accountStatus: 'active',
          adminReadOnly: false,
          adminScopes: [],
          creatorControls: {
            creationBlocked: false,
            creationBlockedReason: null,
            publishingBlocked: false,
            publishingBlockedReason: null,
            cooldownUntil: '2026-02-21T00:00:00.000Z',
            updatedAt: '2026-02-20T00:00:00.000Z',
            updatedBy: { id: 'admin-1', name: 'Admin', role: 'admin' },
          },
          tokenVersion: 1,
          createdAt: '2026-02-18T00:00:00.000Z',
          updatedAt: '2026-02-20T00:00:00.000Z',
        },
      },
    })

    const result = await adminUsersService.applyCreatorControls('creator-1', {
      action: 'set_cooldown',
      reason: 'Spike de reports',
      note: 'Observar nas proximas 24h',
      cooldownHours: 24,
    })

    expect(mockedApiClient.post).toHaveBeenCalledWith('/admin/users/creator-1/creator-controls', {
      action: 'set_cooldown',
      reason: 'Spike de reports',
      note: 'Observar nas proximas 24h',
      cooldownHours: 24,
    })
    expect(result).toMatchObject({
      action: 'set_cooldown',
      creatorControls: {
        cooldownUntil: '2026-02-21T00:00:00.000Z',
      },
      user: {
        id: 'creator-1',
      },
    })
  })
})
