import { adminSurfaceControlsService } from '@/features/admin/services/adminSurfaceControlsService'
import { apiClient } from '@/lib/api/client'

jest.mock('@/lib/api/client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
  },
}))

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>

describe('adminSurfaceControlsService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('maps surface controls list', async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      data: {
        generatedAt: '2026-03-01T12:00:00.000Z',
        items: [
          {
            key: 'comments_write',
            label: 'Escrita de comentarios',
            description: 'Criacao de comentarios.',
            impact: 'write',
            enabled: false,
            reason: 'Ataque de spam',
            note: 'Incidente 42',
            publicMessage: 'Comentarios temporariamente indisponiveis.',
            updatedAt: '2026-03-01T12:00:00.000Z',
            updatedBy: {
              id: 'admin-1',
              name: 'Admin',
              role: 'admin',
            },
          },
        ],
      },
    })

    const result = await adminSurfaceControlsService.list()

    expect(mockedApiClient.get).toHaveBeenCalledWith('/admin/platform/surfaces')
    expect(result.items[0]).toMatchObject({
      key: 'comments_write',
      enabled: false,
      impact: 'write',
      updatedBy: { id: 'admin-1' },
    })
  })

  it('sends surface control update payload', async () => {
    mockedApiClient.post.mockResolvedValueOnce({
      data: {
        message: 'Kill switch de superficie ativado com sucesso.',
        item: {
          key: 'reviews_read',
          label: 'Leitura de reviews',
          description: 'Listagens publicas.',
          impact: 'read',
          enabled: false,
          reason: 'Qualidade comprometida',
          note: null,
          publicMessage: 'Reviews em revisao.',
          updatedAt: '2026-03-01T12:10:00.000Z',
          updatedBy: null,
        },
      },
    })

    const result = await adminSurfaceControlsService.update('reviews_read', {
      enabled: false,
      reason: 'Qualidade comprometida',
      publicMessage: 'Reviews em revisao.',
    })

    expect(mockedApiClient.post).toHaveBeenCalledWith('/admin/platform/surfaces/reviews_read', {
      enabled: false,
      reason: 'Qualidade comprometida',
      publicMessage: 'Reviews em revisao.',
    })
    expect(result.item).toMatchObject({
      key: 'reviews_read',
      enabled: false,
    })
  })
})
