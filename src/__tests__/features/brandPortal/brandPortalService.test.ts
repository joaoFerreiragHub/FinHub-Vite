import { apiClient } from '@/lib/api/client'
import { brandPortalService } from '@/features/brandPortal/services/brandPortalService'

jest.mock('@/lib/api/client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
  },
}))

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>

describe('brandPortalService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('maps wallets list response', async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      data: {
        summary: {
          totalWallets: 1,
          totalBalanceCents: 15000,
          totalBalance: 150,
          totalReservedCents: 2000,
          totalReserved: 20,
          totalAvailableCents: 13000,
          totalAvailable: 130,
        },
        items: [
          {
            id: 'wallet-1',
            directoryEntry: {
              id: 'dir-1',
              name: 'Broker X',
              slug: 'broker-x',
              verticalType: 'broker',
              status: 'published',
              verificationStatus: 'verified',
              isActive: true,
            },
            currency: 'EUR',
            balanceCents: 15000,
            balance: 150,
            reservedCents: 2000,
            reserved: 20,
            availableCents: 13000,
            available: 130,
            lifetimeCreditsCents: 15000,
            lifetimeCredits: 150,
            lifetimeDebitsCents: 0,
            lifetimeDebits: 0,
            lastTransactionAt: '2026-03-14T10:00:00.000Z',
            updatedAt: '2026-03-14T10:00:00.000Z',
          },
        ],
      },
    })

    const response = await brandPortalService.listWallets()

    expect(mockedApiClient.get).toHaveBeenCalledWith('/brand-portal/wallets')
    expect(response.summary.totalWallets).toBe(1)
    expect(response.items[0]).toMatchObject({
      id: 'wallet-1',
      directoryEntry: { id: 'dir-1', name: 'Broker X' },
      available: 130,
    })
  })

  it('normalizes campaigns query params and maps list items', async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      data: {
        items: [
          {
            id: 'camp-1',
            code: 'CAMP-1',
            title: 'Campanha 1',
            headline: 'Abrir conta',
            adType: 'sponsored_ads',
            status: 'draft',
            surfaces: ['directory'],
            slotIds: ['DIRECTORY_HOME_INLINE_01'],
            visibleTo: ['all'],
            priority: 100,
            estimatedMonthlyBudget: 120,
            currency: 'EUR',
            metrics: { impressions: 1000, clicks: 80, conversions: 10 },
          },
        ],
        ownership: {
          totalEntries: 1,
          entries: [
            {
              id: 'dir-1',
              name: 'Broker X',
              slug: 'broker-x',
              verticalType: 'broker',
              status: 'published',
              verificationStatus: 'verified',
              isActive: true,
            },
          ],
        },
        pagination: { page: 1, limit: 10, total: 1, pages: 1 },
      },
    })

    const response = await brandPortalService.listCampaigns({
      status: 'draft',
      search: 'broker',
      page: 1,
      limit: 10,
    })

    expect(mockedApiClient.get).toHaveBeenCalledWith('/brand-portal/campaigns', {
      params: {
        status: 'draft',
        search: 'broker',
        page: 1,
        limit: 10,
      },
    })
    expect(response.items[0]).toMatchObject({
      id: 'camp-1',
      code: 'CAMP-1',
      status: 'draft',
      adType: 'sponsored_ads',
    })
  })

  it('returns plaintext api key on integration create', async () => {
    mockedApiClient.post.mockResolvedValueOnce({
      data: {
        message: 'API key de integracao criada com sucesso.',
        apiKey: 'fhub_bi_abcd1234.secretvalue',
        warning: 'Guarda esta API key agora.',
        item: {
          id: 'key-1',
          keyPrefix: 'fhub_bi_abcd1234',
          label: 'Prod key',
          scopes: ['brand.affiliate.read'],
          isActive: true,
          ownerUserId: 'user-1',
          directoryEntryId: 'dir-1',
          lastUsedAt: null,
          expiresAt: null,
          revokedAt: null,
          metadata: null,
          createdAt: '2026-03-14T10:00:00.000Z',
          updatedAt: '2026-03-14T10:00:00.000Z',
        },
      },
    })

    const response = await brandPortalService.createIntegrationApiKey({
      directoryEntryId: 'dir-1',
      label: 'Prod key',
      scopes: ['brand.affiliate.read'],
    })

    expect(mockedApiClient.post).toHaveBeenCalledWith('/brand-portal/integrations/api-keys', {
      directoryEntryId: 'dir-1',
      label: 'Prod key',
      scopes: ['brand.affiliate.read'],
    })
    expect(response.apiKey).toBe('fhub_bi_abcd1234.secretvalue')
    expect(response.item.keyPrefix).toBe('fhub_bi_abcd1234')
  })
})
