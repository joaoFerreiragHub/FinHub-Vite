import { editorialClaimsService } from '@/features/user/services/editorialClaimsService'
import { apiClient } from '@/lib/api/client'

jest.mock('@/lib/api/client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
  },
}))

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>

describe('editorialClaimsService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('lists my claims with pagination and mapped actors', async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      data: {
        items: [
          {
            id: 'claim-1',
            targetType: 'directory_entry',
            targetId: '67bc7d03f9a9a8d8a2310001',
            creatorId: {
              id: 'creator-1',
              username: 'criador',
              role: 'creator',
            },
            requestedBy: {
              id: 'creator-1',
              username: 'criador',
              role: 'creator',
            },
            status: 'pending',
            reason: 'Sou owner oficial.',
            evidenceLinks: ['https://example.com/prova'],
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

    const result = await editorialClaimsService.listMyClaims({
      status: 'pending',
      page: 2,
      limit: 10,
    })

    expect(mockedApiClient.get).toHaveBeenCalledWith('/editorial/claims/my', {
      params: {
        status: 'pending',
        page: 2,
        limit: 10,
      },
    })

    expect(result.pagination).toMatchObject({
      page: 2,
      limit: 10,
      total: 11,
      pages: 2,
    })
    expect(result.items[0]).toMatchObject({
      id: 'claim-1',
      targetType: 'directory_entry',
      status: 'pending',
      creator: {
        id: 'creator-1',
        username: 'criador',
      },
    })
  })

  it('creates claim with sanitized payload', async () => {
    mockedApiClient.post.mockResolvedValueOnce({
      data: {
        id: 'claim-2',
        targetType: 'directory_entry',
        targetId: '67bc7d03f9a9a8d8a2310002',
        status: 'pending',
        reason: 'Sou owner',
      },
    })

    const result = await editorialClaimsService.createMyClaim({
      targetType: 'directory_entry',
      targetId: ' 67bc7d03f9a9a8d8a2310002 ',
      reason: '  Sou owner  ',
      note: '   ',
      evidenceLinks: [' https://example.com/a ', '', '  '],
    })

    expect(mockedApiClient.post).toHaveBeenCalledWith('/editorial/claims', {
      targetType: 'directory_entry',
      targetId: '67bc7d03f9a9a8d8a2310002',
      reason: 'Sou owner',
      evidenceLinks: ['https://example.com/a'],
    })
    expect(result).toMatchObject({
      id: 'claim-2',
      status: 'pending',
      targetId: '67bc7d03f9a9a8d8a2310002',
    })
  })

  it('cancels claim and maps response', async () => {
    mockedApiClient.post.mockResolvedValueOnce({
      data: {
        id: 'claim-1',
        targetType: 'directory_entry',
        targetId: '67bc7d03f9a9a8d8a2310001',
        status: 'cancelled',
        reason: 'Sou owner oficial.',
      },
    })

    const result = await editorialClaimsService.cancelMyClaim('claim-1', {
      note: '  Cancelado pelo creator. ',
    })

    expect(mockedApiClient.post).toHaveBeenCalledWith('/editorial/claims/claim-1/cancel', {
      note: 'Cancelado pelo creator.',
    })
    expect(result).toMatchObject({
      id: 'claim-1',
      status: 'cancelled',
    })
  })
})
