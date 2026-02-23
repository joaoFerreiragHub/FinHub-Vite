import { adminDirectoriesService } from '@/features/admin/services/adminDirectoriesService'
import { apiClient } from '@/lib/api/client'

jest.mock('@/lib/api/client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
  },
}))

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>

const backendEntry = {
  id: 'dir-1',
  name: 'Example Broker',
  slug: 'example-broker',
  verticalType: 'broker',
  shortDescription: 'Broker global.',
  description: 'Descricao completa',
  website: 'https://example.com',
  categories: ['broker', 'stocks'],
  tags: ['trusted'],
  status: 'draft',
  verificationStatus: 'pending',
  isActive: true,
  isFeatured: false,
  showInHomeSection: false,
  showInDirectory: true,
  landingEnabled: true,
  showAllEnabled: true,
  ownerType: 'admin_seeded',
  sourceType: 'internal',
  claimable: true,
  updatedAt: '2026-02-22T12:00:00.000Z',
}

describe('adminDirectoriesService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('lists entries with mapped pagination and filters', async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      data: {
        items: [backendEntry],
        pagination: {
          page: 2,
          limit: 10,
          total: 23,
          pages: 3,
        },
      },
    })

    const result = await adminDirectoriesService.listDirectories('broker', {
      search: 'example',
      status: 'draft',
      isActive: true,
      page: 2,
      limit: 10,
    })

    expect(mockedApiClient.get).toHaveBeenCalledWith('/admin/directories/broker', {
      params: {
        search: 'example',
        status: 'draft',
        isActive: true,
        page: 2,
        limit: 10,
      },
    })

    expect(result.pagination).toMatchObject({
      page: 2,
      limit: 10,
      total: 23,
      pages: 3,
    })
    expect(result.items[0]).toMatchObject({
      id: 'dir-1',
      name: 'Example Broker',
      status: 'draft',
      verificationStatus: 'pending',
      verticalType: 'broker',
    })
  })

  it('creates entry with sanitized payload', async () => {
    mockedApiClient.post.mockResolvedValueOnce({
      data: {
        ...backendEntry,
        id: 'dir-2',
        name: 'XP',
        slug: 'xp',
      },
    })

    const result = await adminDirectoriesService.createDirectory('broker', {
      name: '  XP  ',
      slug: ' xp ',
      shortDescription: '  Corretora PT  ',
      description: '  Descricao  ',
      categories: ['  broker  ', ''],
      tags: ['  europa ', ''],
      isActive: true,
      isFeatured: true,
      showInDirectory: true,
      ownerType: 'admin_seeded',
      sourceType: 'internal',
    })

    expect(mockedApiClient.post).toHaveBeenCalledWith('/admin/directories/broker', {
      name: 'XP',
      slug: 'xp',
      shortDescription: 'Corretora PT',
      description: 'Descricao',
      categories: ['broker'],
      tags: ['europa'],
      isActive: true,
      isFeatured: true,
      showInDirectory: true,
      ownerType: 'admin_seeded',
      sourceType: 'internal',
    })

    expect(result).toMatchObject({
      id: 'dir-2',
      name: 'XP',
      slug: 'xp',
    })
  })

  it('publishes and archives entries with mapped response', async () => {
    mockedApiClient.post
      .mockResolvedValueOnce({
        data: {
          changed: true,
          entry: {
            ...backendEntry,
            status: 'published',
          },
        },
      })
      .mockResolvedValueOnce({
        data: {
          changed: true,
          entry: {
            ...backendEntry,
            status: 'archived',
          },
        },
      })

    const publishResult = await adminDirectoriesService.publishDirectory('broker', 'dir-1', '')
    const archiveResult = await adminDirectoriesService.archiveDirectory(
      'broker',
      'dir-1',
      '  Policy breach  ',
    )

    expect(mockedApiClient.post).toHaveBeenNthCalledWith(
      1,
      '/admin/directories/broker/dir-1/publish',
      { reason: undefined },
    )
    expect(mockedApiClient.post).toHaveBeenNthCalledWith(
      2,
      '/admin/directories/broker/dir-1/archive',
      { reason: 'Policy breach' },
    )

    expect(publishResult).toMatchObject({
      changed: true,
      entry: { status: 'published' },
    })
    expect(archiveResult).toMatchObject({
      changed: true,
      entry: { status: 'archived' },
    })
  })
})
