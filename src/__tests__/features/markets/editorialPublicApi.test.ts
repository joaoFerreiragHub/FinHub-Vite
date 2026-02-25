import { editorialPublicApi } from '@/features/markets/services/editorialPublicApi'
import { apiClient } from '@/lib/api/client'

jest.mock('@/lib/api/client', () => ({
  apiClient: {
    get: jest.fn(),
  },
}))

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>

describe('editorialPublicApi', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('maps landing response and sends filters as query params', async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      data: {
        vertical: 'broker',
        mode: 'landing',
        filters: {
          search: 'xtb',
          country: 'PT',
          region: 'EU',
          categories: ['broker'],
          tags: ['trading'],
          featured: true,
          verificationStatus: 'verified',
          sort: 'recent',
        },
        items: [
          {
            id: 'dir-1',
            name: 'XTB',
            slug: 'xtb',
            verticalType: 'broker',
            shortDescription: 'Corretora regulada',
            categories: ['broker'],
            tags: ['trading'],
            verificationStatus: 'verified',
            isFeatured: true,
            updatedAt: '2026-02-24T12:00:00.000Z',
          },
        ],
        pagination: {
          page: 2,
          limit: 12,
          total: 48,
          pages: 4,
        },
      },
    })

    const result = await editorialPublicApi.getLanding('broker', {
      search: ' xtb ',
      country: ' PT ',
      region: ' EU ',
      categories: ['broker', ''],
      tags: ['trading'],
      featured: true,
      verificationStatus: 'verified',
      sort: 'recent',
      page: 2,
      limit: 12,
    })

    expect(mockedApiClient.get).toHaveBeenCalledWith('/editorial/broker', {
      params: {
        search: 'xtb',
        country: 'PT',
        region: 'EU',
        categories: 'broker',
        tags: 'trading',
        featured: true,
        verificationStatus: 'verified',
        sort: 'recent',
        page: 2,
        limit: 12,
      },
    })

    expect(result).toMatchObject({
      vertical: 'broker',
      mode: 'landing',
      filters: {
        sort: 'recent',
        featured: true,
      },
      pagination: {
        page: 2,
        limit: 12,
        total: 48,
        pages: 4,
      },
    })
    expect(result.items[0]).toMatchObject({
      id: 'dir-1',
      name: 'XTB',
      verificationStatus: 'verified',
    })
  })

  it('maps show-all response with defaults and drops invalid entries', async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      data: {
        vertical: 'exchange',
        mode: 'show-all',
        items: [
          {
            id: 'dir-2',
            name: 'Binance',
            slug: 'binance',
            verticalType: 'exchange',
            shortDescription: 'Exchange global',
          },
          {
            name: 'Item invalido sem slug',
            shortDescription: 'nao deve passar',
          },
        ],
      },
    })

    const result = await editorialPublicApi.getShowAll('exchange')

    expect(mockedApiClient.get).toHaveBeenCalledWith('/editorial/exchange/show-all', {
      params: {},
    })
    expect(result.mode).toBe('show-all')
    expect(result.filters.sort).toBe('featured')
    expect(result.pagination).toMatchObject({
      page: 1,
      limit: 25,
      total: 0,
      pages: 1,
    })
    expect(result.items).toHaveLength(1)
    expect(result.items[0]).toMatchObject({
      id: 'dir-2',
      verticalType: 'exchange',
      verificationStatus: 'unverified',
    })
  })
})
