import { publicSurfaceControlsService } from '@/features/platform/services/publicSurfaceControlsService'
import { apiClient } from '@/lib/api/client'

jest.mock('@/lib/api/client', () => ({
  apiClient: {
    get: jest.fn(),
  },
}))

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>

describe('publicSurfaceControlsService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('maps public surfaces list and keeps only known surface keys', async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      data: {
        generatedAt: '2026-03-02T08:00:00.000Z',
        items: [
          {
            key: 'creator_page',
            enabled: true,
            updatedAt: '2026-03-02T08:00:00.000Z',
          },
          {
            key: 'search',
            enabled: false,
            publicMessage: 'Pesquisa temporariamente indisponivel.',
            reason: 'Hardening operacional',
            updatedAt: '2026-03-02T08:05:00.000Z',
          },
          {
            key: 'derived_feeds',
            enabled: false,
            publicMessage: null,
            reason: 'Dependencia ainda nao exposta',
            updatedAt: '2026-03-02T08:10:00.000Z',
          },
          {
            key: 'unknown_surface',
            enabled: false,
          },
        ],
      },
    })

    const result = await publicSurfaceControlsService.list()

    expect(mockedApiClient.get).toHaveBeenCalledWith('/platform/surfaces')
    expect(result.generatedAt).toBe('2026-03-02T08:00:00.000Z')
    expect(result.items).toHaveLength(3)
    expect(result.items[0]).toMatchObject({
      key: 'creator_page',
      enabled: true,
    })
    expect(result.items[1]).toMatchObject({
      key: 'search',
      enabled: false,
      publicMessage: 'Pesquisa temporariamente indisponivel.',
      reason: 'Hardening operacional',
    })
    expect(result.items[2]).toMatchObject({
      key: 'derived_feeds',
      enabled: false,
      reason: 'Dependencia ainda nao exposta',
    })
  })
})
