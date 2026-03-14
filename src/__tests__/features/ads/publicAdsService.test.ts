import { apiClient } from '@/lib/api/client'
import { publicAdsService } from '@/features/ads/services/publicAdsService'

jest.mock('@/lib/api/client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
  },
}))

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>

describe('publicAdsService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('maps serve response and normalizes request params', async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      data: {
        item: {
          campaignId: 'camp-1',
          code: 'CAMP-1',
          adType: 'sponsored_ads',
          disclosureLabel: 'Patrocinado',
          headline: 'Compara corretoras sem friccao',
          body: 'Oferta de onboarding para novos utilizadores.',
          ctaText: 'Abrir conta',
          ctaUrl: 'https://brand.example/cta',
          imageUrl: 'https://cdn.example/ad.jpg',
          slot: {
            slotId: 'DIRECTORY_HOME_INLINE_01',
            surface: 'directory',
            position: 'inline',
          },
          brand: {
            id: 'brand-1',
            name: 'Broker X',
            slug: 'broker-x',
            logo: 'https://cdn.example/logo.png',
            verticalType: 'broker',
          },
          impressionToken: 'token-1',
        },
        reason: null,
      },
    })

    const result = await publicAdsService.serve({
      slotId: 'directory_home_inline_01',
      audience: 'free',
      vertical: 'broker',
      sessionKey: 'session-1',
    })

    expect(mockedApiClient.get).toHaveBeenCalledWith('/ads/serve', {
      params: {
        slot: 'DIRECTORY_HOME_INLINE_01',
        audience: 'free',
        session: 'session-1',
        vertical: 'broker',
      },
    })

    expect(result.item).toMatchObject({
      campaignId: 'camp-1',
      adType: 'sponsored_ads',
      headline: 'Compara corretoras sem friccao',
      slot: {
        slotId: 'DIRECTORY_HOME_INLINE_01',
        surface: 'directory',
      },
      brand: {
        id: 'brand-1',
        slug: 'broker-x',
      },
    })
    expect(result.reason).toBeNull()
  })

  it('returns fail-safe null item when slot is missing (404)', async () => {
    mockedApiClient.get.mockRejectedValueOnce({
      isAxiosError: true,
      response: {
        status: 404,
        data: {
          error: 'Slot de anuncios nao encontrado ou inativo.',
        },
      },
    })

    const result = await publicAdsService.serve({
      slotId: 'DIRECTORY_MISSING_01',
      audience: 'free',
      sessionKey: 'session-1',
    })

    expect(result).toEqual({
      item: null,
      reason: 'Slot de anuncios nao encontrado ou inativo.',
    })
  })

  it('posts tracking token for click and maps response payload', async () => {
    mockedApiClient.post.mockResolvedValueOnce({
      data: {
        recorded: true,
        duplicate: false,
        campaignId: 'camp-9',
        inferredImpression: true,
      },
    })

    const result = await publicAdsService.trackClick(' token-9 ')

    expect(mockedApiClient.post).toHaveBeenCalledWith('/ads/click', {
      token: 'token-9',
    })
    expect(result).toEqual({
      recorded: true,
      duplicate: false,
      campaignId: 'camp-9',
      inferredImpression: true,
    })
  })
})
