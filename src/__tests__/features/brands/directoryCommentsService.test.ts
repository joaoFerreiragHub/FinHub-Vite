import { directoryCommentsService } from '@/features/brands/services/directoryCommentsService'
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

describe('directoryCommentsService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('maps comment tree and pagination from backend payload', async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      data: {
        comments: [
          {
            _id: 'comment-1',
            targetType: 'directory_entry',
            targetId: 'dir-1',
            user: {
              _id: 'user-1',
              name: 'Ana',
              username: 'ana',
              avatar: 'avatar.png',
            },
            content: 'Excelente recurso',
            depth: 0,
            likes: 3,
            likedBy: ['user-2'],
            repliesCount: 1,
            createdAt: '2026-03-10T10:00:00.000Z',
            updatedAt: '2026-03-10T10:00:00.000Z',
            replies: [
              {
                _id: 'reply-1',
                targetType: 'live',
                targetId: 'dir-1',
                parentComment: 'comment-1',
                user: 'user-3',
                content: 'Concordo totalmente',
                depth: 1,
                likes: 0,
                createdAt: '2026-03-10T10:05:00.000Z',
                updatedAt: '2026-03-10T10:05:00.000Z',
              },
            ],
          },
        ],
        pagination: {
          page: 2,
          limit: 5,
          total: 11,
          pages: 3,
        },
      },
    })

    const response = await directoryCommentsService.getCommentTree('dir-1', {
      page: 2,
      limit: 5,
      sort: 'popular',
      currentUserId: 'user-2',
    })

    expect(mockedApiClient.get).toHaveBeenCalledWith('/comments/directory_entry/dir-1/tree', {
      params: {
        page: 2,
        limit: 5,
        sort: 'popular',
      },
    })

    expect(response).toMatchObject({
      total: 11,
      limit: 5,
      offset: 5,
      hasMore: true,
    })
    expect(response.items[0]).toMatchObject({
      id: 'comment-1',
      targetType: 'directory_entry',
      targetId: 'dir-1',
      userId: 'user-1',
      likeCount: 3,
      replyCount: 1,
      hasLiked: true,
    })
    expect(response.items[0].replies[0]).toMatchObject({
      id: 'reply-1',
      targetType: 'event',
      parentCommentId: 'comment-1',
      user: 'user-3',
      content: 'Concordo totalmente',
      depth: 1,
    })
  })

  it('calls write endpoints with expected payload', async () => {
    mockedApiClient.post.mockResolvedValue({ data: {} })
    mockedApiClient.patch.mockResolvedValue({ data: {} })
    mockedApiClient.delete.mockResolvedValue({ data: {} })

    await directoryCommentsService.createComment('dir-1', 'Novo comentario')
    await directoryCommentsService.createComment('dir-1', 'Reply', 'comment-1')
    await directoryCommentsService.updateComment('comment-1', 'Conteudo atualizado')
    await directoryCommentsService.deleteComment('comment-1')
    await directoryCommentsService.toggleLike('comment/1')

    expect(mockedApiClient.post).toHaveBeenNthCalledWith(1, '/comments', {
      targetType: 'directory_entry',
      targetId: 'dir-1',
      content: 'Novo comentario',
      parentCommentId: undefined,
    })
    expect(mockedApiClient.post).toHaveBeenNthCalledWith(2, '/comments', {
      targetType: 'directory_entry',
      targetId: 'dir-1',
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
