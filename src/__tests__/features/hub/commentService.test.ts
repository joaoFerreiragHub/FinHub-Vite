import { commentService } from '@/features/hub/services/commentService'
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

describe('commentService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('maps tree payload and normalizes event target for API', async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      data: {
        comments: [
          {
            _id: 'comment-1',
            targetType: 'live',
            targetId: 'live-1',
            user: { _id: 'user-1', name: 'Ana' },
            content: 'Bom evento',
            likes: 2,
            likedBy: ['user-2'],
            createdAt: '2026-03-10T12:00:00.000Z',
            updatedAt: '2026-03-10T12:00:00.000Z',
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

    const response = await commentService.getCommentTree('event', 'live-1', {
      currentUserId: 'user-2',
      sort: 'recent',
    })

    expect(mockedApiClient.get).toHaveBeenCalledWith('/comments/live/live-1/tree', {
      params: {
        page: 1,
        limit: 10,
        sort: 'recent',
      },
    })
    expect(response.items[0]).toMatchObject({
      id: 'comment-1',
      targetType: 'event',
      targetId: 'live-1',
      userId: 'user-1',
      likeCount: 2,
      hasLiked: true,
    })
  })

  it('calls write endpoints with expected payload', async () => {
    mockedApiClient.post.mockResolvedValue({ data: {} })
    mockedApiClient.patch.mockResolvedValue({ data: {} })
    mockedApiClient.delete.mockResolvedValue({ data: {} })

    await commentService.createComment('event', 'live-1', 'Novo comentario')
    await commentService.createComment('article', 'article-1', 'Reply', 'comment-1')
    await commentService.updateComment('comment-1', 'Conteudo atualizado')
    await commentService.deleteComment('comment-1')
    await commentService.toggleLike('comment/1')

    expect(mockedApiClient.post).toHaveBeenNthCalledWith(1, '/comments', {
      targetType: 'live',
      targetId: 'live-1',
      content: 'Novo comentario',
      parentCommentId: undefined,
    })
    expect(mockedApiClient.post).toHaveBeenNthCalledWith(2, '/comments', {
      targetType: 'article',
      targetId: 'article-1',
      content: 'Reply',
      parentCommentId: 'comment-1',
    })
    expect(mockedApiClient.patch).toHaveBeenCalledWith('/comments/comment-1', {
      content: 'Conteudo atualizado',
    })
    expect(mockedApiClient.delete).toHaveBeenCalledWith('/comments/comment-1')
    expect(mockedApiClient.post).toHaveBeenLastCalledWith('/comments/comment%2F1/like')
  })
})
