import { adminContentService } from '@/features/admin/services/adminContentService'
import { apiClient } from '@/lib/api/client'

jest.mock('@/lib/api/client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
  },
}))

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>

describe('adminContentService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('maps queue response and forwards query params', async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      data: {
        items: [
          {
            id: 'content-1',
            contentType: 'article',
            title: 'Titulo',
            slug: 'titulo',
            description: 'Descricao',
            category: 'finance',
            status: 'published',
            moderationStatus: 'visible',
            moderationReason: null,
            moderationNote: null,
            moderatedAt: null,
            moderatedBy: null,
            creator: {
              id: 'creator-1',
              name: 'Creator',
              role: 'creator',
            },
            createdAt: '2026-02-20T10:00:00.000Z',
            updatedAt: '2026-02-20T11:00:00.000Z',
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

    const result = await adminContentService.listQueue({
      contentType: 'article',
      moderationStatus: 'visible',
      publishStatus: 'published',
      search: 'titulo',
      page: 1,
      limit: 20,
    })

    expect(mockedApiClient.get).toHaveBeenCalledWith('/admin/content/queue', {
      params: {
        contentType: 'article',
        moderationStatus: 'visible',
        publishStatus: 'published',
        search: 'titulo',
        page: 1,
        limit: 20,
      },
    })

    expect(result.items[0]).toMatchObject({
      id: 'content-1',
      contentType: 'article',
      moderationStatus: 'visible',
      creator: { id: 'creator-1' },
    })
  })

  it('maps content moderation history records', async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      data: {
        items: [
          {
            id: 'evt-1',
            contentType: 'video',
            contentId: 'content-1',
            actor: {
              _id: 'admin-1',
              name: 'Admin',
              role: 'admin',
            },
            action: 'restrict',
            fromStatus: 'visible',
            toStatus: 'restricted',
            reason: 'Conteudo sensivel',
            note: 'Rever em 24h',
            createdAt: '2026-02-20T12:00:00.000Z',
          },
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          pages: 1,
        },
      },
    })

    const result = await adminContentService.getContentModerationHistory(
      'video',
      'content-1',
      1,
      10,
    )

    expect(mockedApiClient.get).toHaveBeenCalledWith('/admin/content/video/content-1/history', {
      params: { page: 1, limit: 10 },
    })
    expect(result.items[0]).toMatchObject({
      id: 'evt-1',
      action: 'restrict',
      fromStatus: 'visible',
      toStatus: 'restricted',
      actor: { id: 'admin-1' },
    })
  })

  it('sends moderation action payload to backend endpoint', async () => {
    mockedApiClient.post.mockResolvedValueOnce({
      data: {
        message: 'Conteudo ocultado com sucesso.',
        changed: true,
        fromStatus: 'visible',
        toStatus: 'hidden',
        content: {
          id: 'content-1',
          contentType: 'article',
          title: 'Titulo',
          slug: 'titulo',
          description: 'Descricao',
          category: 'finance',
          status: 'published',
          moderationStatus: 'hidden',
          moderationReason: 'Violacao',
          moderationNote: 'Detalhe',
          moderatedAt: '2026-02-20T12:30:00.000Z',
          creator: null,
          moderatedBy: null,
          createdAt: '2026-02-20T10:00:00.000Z',
          updatedAt: '2026-02-20T12:30:00.000Z',
        },
      },
    })

    const result = await adminContentService.hideContent('article', 'content-1', {
      reason: 'Violacao',
      note: 'Detalhe',
    })

    expect(mockedApiClient.post).toHaveBeenCalledWith('/admin/content/article/content-1/hide', {
      reason: 'Violacao',
      note: 'Detalhe',
    })
    expect(result).toMatchObject({
      message: 'Conteudo ocultado com sucesso.',
      changed: true,
      fromStatus: 'visible',
      toStatus: 'hidden',
      content: {
        id: 'content-1',
        moderationStatus: 'hidden',
      },
    })
  })
})
