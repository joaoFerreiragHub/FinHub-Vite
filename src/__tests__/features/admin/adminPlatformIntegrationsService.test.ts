import { adminPlatformIntegrationsService } from '@/features/admin/services/adminPlatformIntegrationsService'
import { apiClient } from '@/lib/api/client'

jest.mock('@/lib/api/client', () => ({
  apiClient: {
    get: jest.fn(),
    patch: jest.fn(),
  },
}))

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>

describe('adminPlatformIntegrationsService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('maps integrations list and keeps only known keys', async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      data: {
        generatedAt: '2026-03-13T13:00:00.000Z',
        items: [
          {
            key: 'analytics_posthog',
            label: 'PostHog',
            description: 'Tracking principal',
            category: 'analytics',
            enabled: true,
            config: {
              key: 'phc_live_123',
              host: 'https://app.posthog.com',
            },
            reason: 'bootstrap',
            note: null,
            updatedAt: '2026-03-13T12:59:00.000Z',
            updatedBy: {
              id: 'admin-1',
              email: 'admin@finhub.pt',
              role: 'admin',
            },
          },
          {
            key: 'unknown_key',
            enabled: true,
          },
        ],
      },
    })

    const result = await adminPlatformIntegrationsService.list()

    expect(mockedApiClient.get).toHaveBeenCalledWith('/admin/platform/integrations')
    expect(result.generatedAt).toBe('2026-03-13T13:00:00.000Z')
    expect(result.items).toHaveLength(1)
    expect(result.items[0]).toMatchObject({
      key: 'analytics_posthog',
      category: 'analytics',
      enabled: true,
      updatedBy: { id: 'admin-1' },
    })
  })

  it('sends integration update payload', async () => {
    mockedApiClient.patch.mockResolvedValueOnce({
      data: {
        message: 'Integracao atualizada com sucesso.',
        item: {
          key: 'captcha_client',
          label: 'Captcha cliente',
          description: 'Provider e site key',
          category: 'security',
          enabled: false,
          config: {
            provider: 'disabled',
            siteKey: null,
          },
          reason: 'Pre-release',
          note: 'Desligado temporariamente',
          updatedAt: '2026-03-13T13:05:00.000Z',
          updatedBy: null,
        },
      },
    })

    const result = await adminPlatformIntegrationsService.update('captcha_client', {
      enabled: false,
      config: {
        provider: 'disabled',
        siteKey: null,
      },
      reason: 'Pre-release',
      note: 'Desligado temporariamente',
    })

    expect(mockedApiClient.patch).toHaveBeenCalledWith('/admin/platform/integrations/captcha_client', {
      enabled: false,
      config: {
        provider: 'disabled',
        siteKey: null,
      },
      reason: 'Pre-release',
      note: 'Desligado temporariamente',
    })
    expect(result.item).toMatchObject({
      key: 'captcha_client',
      enabled: false,
    })
  })
})
