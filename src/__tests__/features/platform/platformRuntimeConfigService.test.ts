import {
  getFallbackPlatformRuntimeConfig,
  platformRuntimeConfigService,
} from '@/features/platform/services/platformRuntimeConfigService'
import { apiClient } from '@/lib/api/client'

jest.mock('@/lib/api/client', () => ({
  apiClient: {
    get: jest.fn(),
  },
}))

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>

describe('platformRuntimeConfigService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('maps runtime config payload from API', async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      data: {
        generatedAt: '2026-03-13T13:10:00.000Z',
        analytics: {
          posthog: {
            enabled: true,
            key: 'phc_live_123',
            host: 'https://app.posthog.com',
          },
          googleAnalytics: {
            enabled: true,
            measurementId: 'G-AAA111',
          },
          googleTagManager: {
            enabled: false,
            containerId: null,
          },
          metaPixel: {
            enabled: true,
            pixelId: '1234567',
          },
        },
        captcha: {
          enabled: true,
          provider: 'turnstile',
          siteKey: 'turnstile-live-key',
        },
        seo: {
          siteName: 'FinHub',
          siteUrl: 'https://finhub.pt',
          defaultDescription: 'Descricao SEO',
          defaultImage: 'https://finhub.pt/og-default.png',
          noIndexExactPaths: ['/login', '/registar'],
          noIndexPrefixes: ['/admin'],
        },
      },
    })

    const result = await platformRuntimeConfigService.get()

    expect(mockedApiClient.get).toHaveBeenCalledWith('/platform/runtime-config')
    expect(result.generatedAt).toBe('2026-03-13T13:10:00.000Z')
    expect(result.analytics.posthog).toMatchObject({
      enabled: true,
      key: 'phc_live_123',
    })
    expect(result.captcha).toMatchObject({
      enabled: true,
      provider: 'turnstile',
      siteKey: 'turnstile-live-key',
    })
    expect(result.seo.noIndexPrefixes).toEqual(['/admin'])
  })

  it('returns immutable fallback snapshots', () => {
    const first = getFallbackPlatformRuntimeConfig()
    const second = getFallbackPlatformRuntimeConfig()

    expect(first).not.toBe(second)
    expect(first.seo.noIndexExactPaths).toContain('/login')

    first.seo.noIndexExactPaths.push('/temp')
    expect(second.seo.noIndexExactPaths).not.toContain('/temp')
  })
})
