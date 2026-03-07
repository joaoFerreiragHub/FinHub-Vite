import {
  fetchPublicCreatorProfile,
  fetchPublicCreators,
} from '@/features/creators/services/publicCreatorsService'
import { apiClient } from '@/lib/api/client'

jest.mock('@/lib/api/client', () => ({
  apiClient: {
    get: jest.fn(),
  },
}))

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>

describe('publicCreatorsService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('maps creators list from backend payload', async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      data: {
        items: [
          {
            id: 'creator-1',
            name: 'Ana Silva',
            username: 'ana_silva',
            avatar: 'https://cdn.example/avatar.png',
            bio: 'Educadora financeira',
            followers: 42,
            rating: { average: 4.8, count: 13 },
            socialLinks: {
              website: 'https://ana.example',
            },
          },
        ],
      },
    })

    const result = await fetchPublicCreators({ sortBy: 'followers', sortOrder: 'desc' })

    expect(mockedApiClient.get).toHaveBeenCalledWith('/creators', {
      params: {
        search: undefined,
        minRating: undefined,
        sortBy: 'followers',
        sortOrder: 'desc',
        limit: undefined,
      },
    })

    expect(result[0]).toMatchObject({
      _id: 'creator-1',
      username: 'ana_silva',
      firstname: 'Ana',
      lastname: 'Silva',
      followersCount: 42,
      averageRating: 4.8,
      socialMediaLinks: [{ platform: 'website', url: 'https://ana.example' }],
    })
  })

  it('returns null when profile endpoint fails', async () => {
    mockedApiClient.get.mockRejectedValueOnce(new Error('network'))
    const profile = await fetchPublicCreatorProfile('ana_silva')
    expect(profile).toBeNull()
  })
})
