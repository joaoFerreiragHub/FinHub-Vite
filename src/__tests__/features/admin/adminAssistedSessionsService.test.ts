import { adminAssistedSessionsService } from '@/features/admin/services/adminAssistedSessionsService'
import { apiClient } from '@/lib/api/client'

jest.mock('@/lib/api/client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
  },
}))

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>

describe('adminAssistedSessionsService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('maps sessions list response', async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      data: {
        items: [
          {
            id: 'sess-1',
            adminUser: {
              id: 'admin-1',
              name: 'Admin',
              username: 'admin',
              email: 'admin@example.com',
              role: 'admin',
            },
            targetUser: {
              id: 'user-1',
              name: 'Ana',
              username: 'ana',
              email: 'ana@example.com',
              role: 'free',
            },
            scope: 'read_only',
            status: 'pending',
            reason: 'Apoio tecnico',
            note: null,
            consentExpiresAt: '2026-02-20T13:00:00.000Z',
            requestedSessionTtlMinutes: 15,
            approvedAt: null,
            startedAt: null,
            sessionExpiresAt: null,
            declinedAt: null,
            declinedReason: null,
            revokedAt: null,
            revokedBy: null,
            revokedReason: null,
            createdAt: '2026-02-20T12:45:00.000Z',
            updatedAt: '2026-02-20T12:45:00.000Z',
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

    const result = await adminAssistedSessionsService.listSessions({ status: 'pending', page: 1 })

    expect(mockedApiClient.get).toHaveBeenCalledWith('/admin/support/sessions', {
      params: { status: 'pending', page: 1 },
    })
    expect(result.items[0]).toMatchObject({
      id: 'sess-1',
      status: 'pending',
      targetUser: { id: 'user-1' },
    })
  })

  it('maps start session response with acting user and tokens', async () => {
    mockedApiClient.post.mockResolvedValueOnce({
      data: {
        message: 'Sessao assistida iniciada.',
        session: {
          id: 'sess-2',
          status: 'active',
        },
        actingUser: {
          id: 'user-2',
          name: 'Rita',
          email: 'rita@example.com',
          username: 'rita',
          role: 'premium',
          accountStatus: 'active',
          assistedSession: {
            sessionId: 'sess-2',
            adminUserId: 'admin-1',
            targetUserId: 'user-2',
            scope: 'read_only',
            expiresAt: '2026-02-20T13:30:00.000Z',
          },
        },
        tokens: {
          accessToken: 'access-token',
          refreshToken: 'refresh-token',
        },
      },
    })

    const result = await adminAssistedSessionsService.startSession('sess-2')

    expect(mockedApiClient.post).toHaveBeenCalledWith('/admin/support/sessions/sess-2/start')
    expect(result).toMatchObject({
      message: 'Sessao assistida iniciada.',
      session: { id: 'sess-2', status: 'active' },
      actingUser: { id: 'user-2', role: 'premium' },
      tokens: { accessToken: 'access-token', refreshToken: 'refresh-token' },
    })
  })

  it('sends revoke payload', async () => {
    mockedApiClient.post.mockResolvedValueOnce({
      data: {
        message: 'Sessao assistida revogada.',
        changed: true,
        session: {
          id: 'sess-3',
          status: 'revoked',
        },
      },
    })

    const result = await adminAssistedSessionsService.revokeSession('sess-3', {
      reason: 'Encerramento administrativo',
    })

    expect(mockedApiClient.post).toHaveBeenCalledWith('/admin/support/sessions/sess-3/revoke', {
      reason: 'Encerramento administrativo',
    })
    expect(result).toMatchObject({
      message: 'Sessao assistida revogada.',
      changed: true,
      session: { id: 'sess-3', status: 'revoked' },
    })
  })
})
