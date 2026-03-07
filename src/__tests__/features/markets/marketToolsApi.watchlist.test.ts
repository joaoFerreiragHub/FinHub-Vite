import {
  fetchWatchlistBatchSnapshots,
  fetchWatchlistTickerSnapshot,
} from '@/features/markets/services/marketToolsApi'
import { apiClient } from '@/lib/api/client'

jest.mock('@/lib/api/client', () => ({
  apiClient: {
    get: jest.fn(),
  },
}))

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>

describe('marketToolsApi watchlist snapshots', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('maps single ticker snapshot from quick-analysis endpoint', async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      data: {
        symbol: 'AAPL',
        companyName: 'Apple Inc.',
        price: '178.23',
        marketCap: '2893000000000',
        sector: 'Technology',
      },
    })

    const result = await fetchWatchlistTickerSnapshot(' aapl ')

    expect(mockedApiClient.get).toHaveBeenCalledWith('/stocks/quick-analysis/AAPL')
    expect(result).toMatchObject({
      symbol: 'AAPL',
      name: 'Apple Inc.',
      price: 178.23,
      marketCap: 2893000000000,
      sector: 'Technology',
    })
  })

  it('fetches watchlist snapshots in batch and keeps requested symbols as fallback', async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      data: {
        items: [
          {
            symbol: 'AAPL',
            name: 'Apple Inc.',
            price: 178.23,
            marketCap: 2893000000000,
            volume: 71230000,
            change24hPercent: -0.52,
            sector: 'Technology',
          },
        ],
      },
    })

    const result = await fetchWatchlistBatchSnapshots(['aapl', ' msft ', 'AAPL'])

    expect(mockedApiClient.get).toHaveBeenCalledWith('/stocks/batch-snapshot', {
      params: {
        symbols: 'AAPL,MSFT',
      },
    })

    expect(result.AAPL).toMatchObject({
      symbol: 'AAPL',
      name: 'Apple Inc.',
      price: 178.23,
      marketCap: 2893000000000,
      volume: 71230000,
      change24hPercent: -0.52,
      sector: 'Technology',
    })

    expect(result.MSFT).toMatchObject({
      symbol: 'MSFT',
      name: 'MSFT',
    })
  })

  it('returns empty object when batch request has no valid symbols', async () => {
    const result = await fetchWatchlistBatchSnapshots(['   '])
    expect(result).toEqual({})
    expect(mockedApiClient.get).not.toHaveBeenCalled()
  })
})
