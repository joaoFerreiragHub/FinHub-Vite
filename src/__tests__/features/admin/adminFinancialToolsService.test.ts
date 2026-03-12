import { adminFinancialToolsService } from '@/features/admin/services/adminFinancialToolsService'
import { apiClient } from '@/lib/api/client'

jest.mock('@/lib/api/client', () => ({
  apiClient: {
    get: jest.fn(),
    patch: jest.fn(),
  },
}))

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>

describe('adminFinancialToolsService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('maps controls list payload and forwards filters', async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      data: {
        environment: 'production',
        generatedAt: '2026-03-12T10:00:00.000Z',
        items: [
          {
            id: 'tool-1',
            tool: 'reit',
            vertical: 'real_estate',
            label: 'REIT Toolkit',
            notes: 'controlado',
            baseConfig: {
              enabled: true,
              maxSymbolsPerRequest: 12,
              cacheTtlSeconds: 60,
              requestsPerMinute: 80,
              experienceMode: 'enhanced',
            },
            envOverrides: {
              production: {
                requestsPerMinute: 40,
              },
            },
            effectiveConfig: {
              enabled: true,
              maxSymbolsPerRequest: 12,
              cacheTtlSeconds: 60,
              requestsPerMinute: 40,
              experienceMode: 'enhanced',
            },
            version: 3,
            createdAt: '2026-03-10T09:00:00.000Z',
            updatedAt: '2026-03-12T09:30:00.000Z',
          },
          {
            tool: 'stocks',
          },
        ],
      },
    })

    const result = await adminFinancialToolsService.list({
      environment: 'production',
      tool: 'reit',
    })

    expect(mockedApiClient.get).toHaveBeenCalledWith('/admin/tools/financial', {
      params: {
        environment: 'production',
        tool: 'reit',
      },
    })

    expect(result.environment).toBe('production')
    expect(result.items).toHaveLength(1)
    expect(result.items[0]).toMatchObject({
      id: 'tool-1',
      tool: 'reit',
      vertical: 'real_estate',
      baseConfig: {
        enabled: true,
        maxSymbolsPerRequest: 12,
        requestsPerMinute: 80,
      },
      envOverrides: {
        development: {},
        staging: {},
        production: {
          requestsPerMinute: 40,
        },
      },
      effectiveConfig: {
        requestsPerMinute: 40,
      },
      version: 3,
    })
  })

  it('sends update payload and maps mutation response', async () => {
    mockedApiClient.patch.mockResolvedValueOnce({
      data: {
        message: 'Financial tool atualizada com sucesso.',
        item: {
          _id: 'tool-2',
          tool: 'reit',
          vertical: 'real_estate',
          label: 'REIT Toolkit',
          notes: null,
          baseConfig: {
            enabled: false,
            maxSymbolsPerRequest: 20,
            cacheTtlSeconds: 120,
            requestsPerMinute: 50,
            experienceMode: 'standard',
          },
          envOverrides: {
            production: null,
          },
          effectiveConfig: {
            enabled: false,
            maxSymbolsPerRequest: 20,
            cacheTtlSeconds: 120,
            requestsPerMinute: 50,
            experienceMode: 'standard',
          },
          version: 4,
          createdAt: '2026-03-10T09:00:00.000Z',
          updatedAt: '2026-03-12T11:00:00.000Z',
        },
      },
    })

    const result = await adminFinancialToolsService.update('reit', {
      reason: '  update limits ',
      note: '  tuned for load ',
      label: 'REIT Toolkit',
      notes: null,
      baseConfig: {
        enabled: false,
      },
      envOverrides: {
        production: null,
      },
    })

    expect(mockedApiClient.patch).toHaveBeenCalledWith('/admin/tools/financial/reit', {
      reason: 'update limits',
      note: 'tuned for load',
      label: 'REIT Toolkit',
      notes: null,
      baseConfig: {
        enabled: false,
      },
      envOverrides: {
        production: null,
      },
    })

    expect(result.message).toBe('Financial tool atualizada com sucesso.')
    expect(result.item).toMatchObject({
      id: 'tool-2',
      tool: 'reit',
      version: 4,
      baseConfig: {
        enabled: false,
      },
    })
  })

  it('maps usage payload and forwards query params', async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      data: {
        environment: 'staging',
        days: 14,
        sinceDay: '2026-02-27',
        totals: {
          requests: 1200,
          successCount: 1100,
          clientErrorCount: 80,
          serverErrorCount: 20,
          successRatePercent: 91.67,
          errorRatePercent: 8.33,
        },
        byTool: [
          {
            tool: 'stocks',
            vertical: 'equities',
            label: 'Stocks',
            requests: 1000,
            authenticatedRequests: 700,
            successCount: 930,
            clientErrorCount: 55,
            serverErrorCount: 15,
            successRatePercent: 93,
            errorRatePercent: 7,
            authenticatedRatePercent: 70,
            avgLatencyMs: 120.5,
            maxLatencyMs: 580.2,
            effectiveConfig: {
              enabled: true,
              maxSymbolsPerRequest: 25,
              cacheTtlSeconds: 300,
              requestsPerMinute: 120,
              experienceMode: 'standard',
            },
            daily: [
              {
                day: '2026-03-11',
                requests: 100,
                success: 95,
                clientError: 4,
                serverError: 1,
                avgLatencyMs: 118.2,
                maxLatencyMs: 300.4,
              },
            ],
          },
        ],
        byVertical: [
          {
            vertical: 'equities',
            requests: 1000,
            successCount: 930,
            clientErrorCount: 55,
            serverErrorCount: 15,
            successRatePercent: 93,
          },
        ],
        generatedAt: '2026-03-12T11:00:00.000Z',
      },
    })

    const result = await adminFinancialToolsService.usage({
      environment: 'staging',
      tool: 'stocks',
      days: 14,
    })

    expect(mockedApiClient.get).toHaveBeenCalledWith('/admin/tools/financial/usage', {
      params: {
        environment: 'staging',
        tool: 'stocks',
        days: 14,
      },
    })

    expect(result).toMatchObject({
      environment: 'staging',
      days: 14,
      sinceDay: '2026-02-27',
      totals: {
        requests: 1200,
        successRatePercent: 91.67,
        errorRatePercent: 8.33,
      },
      byTool: [
        {
          tool: 'stocks',
          requests: 1000,
          daily: [{ day: '2026-03-11', requests: 100 }],
        },
      ],
      byVertical: [
        {
          vertical: 'equities',
          requests: 1000,
        },
      ],
    })
  })
})
