import { adminEditorialCmsService } from '@/features/admin/services/adminEditorialCmsService'
import { apiClient } from '@/lib/api/client'

jest.mock('@/lib/api/client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}))

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>

describe('adminEditorialCmsService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('maps sections list and forwards filters', async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      data: {
        items: [
          {
            id: 'sec-1',
            key: 'home-destaques',
            title: 'Home Destaques',
            subtitle: 'Top picks',
            sectionType: 'mixed',
            order: 2,
            maxItems: 6,
            status: 'active',
            showOnHome: true,
            showOnLanding: true,
            showOnShowAll: false,
            itemCount: 1,
            items: [
              {
                id: 'item-1',
                sectionId: 'sec-1',
                targetType: 'article',
                targetId: 'article-123',
                sortOrder: 0,
                isPinned: true,
                status: 'active',
              },
            ],
          },
        ],
        pagination: {
          page: 1,
          limit: 20,
          total: 1,
          pages: 1,
        },
      },
    })

    const result = await adminEditorialCmsService.listSections({
      status: 'active',
      search: 'home',
      page: 1,
      limit: 20,
    })

    expect(mockedApiClient.get).toHaveBeenCalledWith('/admin/editorial/sections', {
      params: {
        status: 'active',
        search: 'home',
        page: 1,
        limit: 20,
      },
    })
    expect(result.items[0]).toMatchObject({
      id: 'sec-1',
      key: 'home-destaques',
      itemCount: 1,
      items: [{ id: 'item-1', targetType: 'article', isPinned: true }],
    })
  })

  it('creates section with sanitized payload', async () => {
    mockedApiClient.post.mockResolvedValueOnce({
      data: {
        id: 'sec-2',
        key: 'nova-secao',
        title: 'Nova secao',
        sectionType: 'content',
        order: 0,
        maxItems: 12,
        status: 'active',
        showOnHome: true,
        showOnLanding: true,
        showOnShowAll: true,
        itemCount: 0,
        items: [],
      },
    })

    const result = await adminEditorialCmsService.createSection({
      key: '  nova-secao  ',
      title: '  Nova secao  ',
      subtitle: '  ',
      description: '  Secao principal  ',
      sectionType: 'content',
      maxItems: 12,
    })

    expect(mockedApiClient.post).toHaveBeenCalledWith('/admin/editorial/sections', {
      key: 'nova-secao',
      title: 'Nova secao',
      description: 'Secao principal',
      sectionType: 'content',
      maxItems: 12,
    })
    expect(result).toMatchObject({
      id: 'sec-2',
      key: 'nova-secao',
      title: 'Nova secao',
      sectionType: 'content',
    })
  })

  it('reorders and removes items with contract mapping', async () => {
    mockedApiClient.patch.mockResolvedValueOnce({
      data: {
        sectionId: 'sec-1',
        items: [
          {
            id: 'item-2',
            sectionId: 'sec-1',
            targetType: 'custom',
            targetId: 'custom-2',
            sortOrder: 0,
            isPinned: false,
            status: 'inactive',
          },
        ],
      },
    })
    mockedApiClient.delete.mockResolvedValueOnce({
      data: {
        removed: true,
        sectionId: 'sec-1',
        itemId: 'item-2',
      },
    })

    const reorderResult = await adminEditorialCmsService.reorderSectionItems('sec-1', {
      items: [{ itemId: 'item-2', sortOrder: 0, isPinned: false, status: 'inactive' }],
    })

    const removeResult = await adminEditorialCmsService.removeSectionItem('sec-1', 'item-2')

    expect(mockedApiClient.patch).toHaveBeenCalledWith(
      '/admin/editorial/sections/sec-1/items/reorder',
      {
        items: [{ itemId: 'item-2', sortOrder: 0, isPinned: false, status: 'inactive' }],
      },
    )
    expect(mockedApiClient.delete).toHaveBeenCalledWith(
      '/admin/editorial/sections/sec-1/items/item-2',
    )

    expect(reorderResult).toMatchObject({
      sectionId: 'sec-1',
      items: [{ id: 'item-2', status: 'inactive' }],
    })
    expect(removeResult).toMatchObject({
      removed: true,
      sectionId: 'sec-1',
      itemId: 'item-2',
    })
  })

  it('maps home preview payload', async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      data: {
        items: [
          {
            id: 'sec-home-1',
            key: 'home-editorial',
            title: 'Editorial Home',
            sectionType: 'mixed',
            order: 0,
            maxItems: 3,
            items: [
              {
                id: 'home-item-1',
                sectionId: 'sec-home-1',
                targetType: 'external_link',
                targetId: 'https://finhub.pt',
                sortOrder: 0,
                isPinned: false,
                status: 'active',
              },
            ],
          },
        ],
      },
    })

    const result = await adminEditorialCmsService.getHomePreview()

    expect(mockedApiClient.get).toHaveBeenCalledWith('/editorial/home')
    expect(result.items[0]).toMatchObject({
      id: 'sec-home-1',
      key: 'home-editorial',
      items: [{ id: 'home-item-1', targetType: 'external_link' }],
    })
  })
})
