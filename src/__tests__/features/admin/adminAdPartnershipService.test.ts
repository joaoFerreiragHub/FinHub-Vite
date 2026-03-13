import { adminAdPartnershipService } from '@/features/admin/services/adminAdPartnershipService'
import { apiClient } from '@/lib/api/client'

jest.mock('@/lib/api/client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
  },
}))

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>

describe('adminAdPartnershipService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('maps listSlots response and forwards filters', async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      data: {
        items: [
          {
            id: 'slot-1',
            slotId: 'HOME_INLINE_1',
            label: 'Home inline',
            surface: 'home_feed',
            position: 'inline',
            device: 'desktop',
            allowedTypes: ['sponsored_ads', 'house_ads'],
            visibleTo: ['all'],
            maxPerSession: 2,
            minSecondsBetweenImpressions: 120,
            minContentBefore: 0,
            isActive: true,
            priority: 100,
            fallbackType: null,
            notes: null,
            version: 3,
            createdAt: '2026-03-12T10:00:00.000Z',
            updatedAt: '2026-03-12T12:00:00.000Z',
          },
        ],
        pagination: {
          page: 2,
          limit: 10,
          total: 11,
          pages: 2,
        },
      },
    })

    const result = await adminAdPartnershipService.listSlots({
      surface: 'home_feed',
      device: 'desktop',
      isActive: true,
      page: 2,
      limit: 10,
    })

    expect(mockedApiClient.get).toHaveBeenCalledWith('/admin/ads/slots', {
      params: {
        surface: 'home_feed',
        device: 'desktop',
        isActive: true,
        page: 2,
        limit: 10,
      },
    })

    expect(result.items[0]).toMatchObject({
      slotId: 'HOME_INLINE_1',
      surface: 'home_feed',
      device: 'desktop',
      isActive: true,
      priority: 100,
    })
    expect(result.pagination).toMatchObject({ page: 2, pages: 2, total: 11 })
  })

  it('sends normalized payload on createCampaign', async () => {
    mockedApiClient.post.mockResolvedValueOnce({
      data: {
        message: 'Campanha criada com sucesso.',
        item: {
          id: 'camp-1',
          code: 'CAMP-REIT-1',
          title: 'REIT Campaign',
          headline: 'Headline',
          adType: 'sponsored_ads',
          sponsorType: 'brand',
          status: 'draft',
          surfaces: ['content'],
          slotIds: ['HOME_INLINE_1'],
          visibleTo: ['all'],
          priority: 100,
          relevanceTags: ['finance'],
          currency: 'EUR',
          version: 1,
          metrics: { impressions: 0, clicks: 0, conversions: 0 },
          history: [],
        },
      },
    })

    await adminAdPartnershipService.createCampaign({
      code: ' camp-reit-1 ',
      title: ' REIT Campaign ',
      headline: ' Headline ',
      adType: 'sponsored_ads',
      sponsorType: 'brand',
      directoryEntryId: 'dir-1',
      surfaces: ['content'],
      slotIds: ['HOME_INLINE_1'],
      visibleTo: ['all'],
      relevanceTags: ['finance'],
      priority: 100,
      currency: ' eur ',
      reason: '  create_campaign  ',
      note: '  ops  ',
    })

    expect(mockedApiClient.post).toHaveBeenCalledWith('/admin/ads/campaigns', {
      code: 'CAMP-REIT-1',
      title: 'REIT Campaign',
      headline: 'Headline',
      adType: 'sponsored_ads',
      sponsorType: 'brand',
      directoryEntryId: 'dir-1',
      surfaces: ['content'],
      slotIds: ['HOME_INLINE_1'],
      visibleTo: ['all'],
      relevanceTags: ['finance'],
      priority: 100,
      currency: 'EUR',
      reason: 'create_campaign',
      note: 'ops',
    })
  })

  it('posts activate action with reason and note', async () => {
    mockedApiClient.post.mockResolvedValueOnce({
      data: {
        message: 'Campanha ativada com sucesso.',
        item: {
          id: 'camp-2',
          code: 'CAMP-2',
          title: 'Campaign',
          headline: 'Headline',
          adType: 'house_ads',
          sponsorType: 'platform',
          status: 'active',
          surfaces: ['content'],
          slotIds: [],
          visibleTo: ['all'],
          priority: 20,
          relevanceTags: [],
          currency: 'EUR',
          version: 2,
          metrics: { impressions: 0, clicks: 0, conversions: 0 },
          history: [],
        },
      },
    })

    await adminAdPartnershipService.activateCampaign('camp-2', {
      reason: ' activate_now ',
      note: ' start today ',
    })

    expect(mockedApiClient.post).toHaveBeenCalledWith('/admin/ads/campaigns/camp-2/activate', {
      reason: 'activate_now',
      note: 'start today',
    })
  })

  it('maps campaign metrics response', async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      data: {
        campaign: {
          id: 'camp-3',
          code: 'CAMP-3',
          title: 'Campaign 3',
          status: 'approved',
          adType: 'sponsored_ads',
          sponsorType: 'brand',
        },
        lifetime: { impressions: 1000, clicks: 35, conversions: 2, ctrPercent: 3.5 },
        window: {
          days: 30,
          served: 1200,
          impressions: 900,
          clicks: 32,
          ctrPercent: 3.55,
          fillRatePercent: 75.2,
        },
        timeline: [{ date: '2026-03-11', served: 40, impressions: 31, clicks: 2 }],
        breakdown: {
          bySlot: [{ key: 'HOME_INLINE_1', served: 200, impressions: 150, clicks: 8 }],
          byAudience: [{ key: 'free', served: 600, impressions: 450, clicks: 18 }],
          byDevice: [{ key: 'desktop', served: 700, impressions: 500, clicks: 21 }],
        },
      },
    })

    const result = await adminAdPartnershipService.getCampaignMetrics('camp-3', 30)

    expect(mockedApiClient.get).toHaveBeenCalledWith('/admin/ads/campaigns/camp-3/metrics', {
      params: { days: 30 },
    })

    expect(result).toMatchObject({
      campaign: { id: 'camp-3', status: 'approved' },
      lifetime: { impressions: 1000, clicks: 35, ctrPercent: 3.5 },
      window: { days: 30, fillRatePercent: 75.2 },
      breakdown: {
        bySlot: [{ key: 'HOME_INLINE_1', impressions: 150 }],
      },
    })
  })
})
