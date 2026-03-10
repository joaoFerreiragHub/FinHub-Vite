import { ContentType } from '@/features/hub/types/base'
import { apiClient } from '@/lib/api/client'
import type { Comment, CommentListResponse, CommentTargetType } from '@/features/hub/types'

export type CommentSort = 'recent' | 'oldest' | 'popular'

interface CommentQueryOptions {
  page?: number
  limit?: number
  sort?: CommentSort
  currentUserId?: string | null
}

interface BackendCommentUser {
  _id?: string
  id?: string
  name?: string
  username?: string
  avatar?: string
}

interface BackendComment {
  _id?: string
  id?: string
  user?: BackendCommentUser | string
  targetType?: string
  targetId?: string | { _id?: string; id?: string }
  content?: string
  parentComment?: string | { _id?: string; id?: string } | null
  depth?: number
  likes?: number
  likedBy?: Array<string | { _id?: string; id?: string }>
  isEdited?: boolean
  isPinned?: boolean
  createdAt?: string
  updatedAt?: string
  replies?: BackendComment[]
  repliesCount?: number
}

interface BackendCommentTreePagination {
  page?: number
  limit?: number
  total?: number
  pages?: number
}

interface BackendCommentTreeResponse {
  comments?: BackendComment[]
  pagination?: BackendCommentTreePagination
}

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 10

const toNumber = (value: unknown, fallback = 0): number => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

const toIdString = (value: unknown): string | null => {
  if (typeof value === 'string' && value.trim().length > 0) return value.trim()
  if (!value || typeof value !== 'object') return null

  const typedValue = value as { id?: unknown; _id?: unknown }
  if (typeof typedValue.id === 'string' && typedValue.id.trim().length > 0) {
    return typedValue.id.trim()
  }
  if (typeof typedValue._id === 'string' && typedValue._id.trim().length > 0) {
    return typedValue._id.trim()
  }

  return null
}

const normalizeTargetTypeForApi = (targetType: CommentTargetType): string => {
  if (targetType === ContentType.EVENT) return 'live'
  return targetType
}

const toTargetType = (
  value: string | undefined,
  fallbackTargetType: CommentTargetType,
): CommentTargetType => {
  if (value === 'article') return ContentType.ARTICLE
  if (value === 'course') return ContentType.COURSE
  if (value === 'video') return ContentType.VIDEO
  if (value === 'event') return ContentType.EVENT
  if (value === 'live') return ContentType.EVENT
  if (value === 'book') return ContentType.BOOK
  if (value === 'podcast') return ContentType.PODCAST
  if (value === 'news') return ContentType.NEWS
  if (value === 'creator') return 'creator'
  if (value === 'directory_entry') return 'directory_entry'
  if (value === 'brand') return 'brand'
  return fallbackTargetType
}

const toUserPayload = (value: BackendComment['user']): Comment['user'] => {
  if (!value || typeof value === 'string') return value ?? 'anonymous'

  const userId = toIdString(value)
  if (!userId) return 'anonymous'

  return {
    id: userId,
    name: value.name ?? 'Anonymous',
    username: value.username ?? `user-${userId}`,
    avatar: value.avatar,
  }
}

const toLikedBySet = (value: BackendComment['likedBy']): Set<string> => {
  if (!Array.isArray(value)) return new Set<string>()
  return new Set(
    value.map((item) => toIdString(item)).filter((item): item is string => Boolean(item)),
  )
}

const mapComment = (
  value: BackendComment,
  currentUserId: string | null | undefined,
  fallbackTargetType: CommentTargetType,
  fallbackTargetId: string,
): Comment | null => {
  const id = toIdString(value)
  if (!id || typeof value.content !== 'string') return null

  const targetId = toIdString(value.targetId) ?? fallbackTargetId

  const replies = Array.isArray(value.replies)
    ? value.replies
        .map((item) => mapComment(item, currentUserId, fallbackTargetType, fallbackTargetId))
        .filter((item): item is Comment => item !== null)
    : []

  const user = toUserPayload(value.user)
  const userId = typeof user === 'string' ? user : user.id
  const likedBySet = toLikedBySet(value.likedBy)

  return {
    id,
    targetType: toTargetType(value.targetType, fallbackTargetType),
    targetId,
    parentCommentId: toIdString(value.parentComment),
    user,
    userId,
    content: value.content,
    depth: toNumber(value.depth),
    likeCount: toNumber(value.likes),
    replyCount: toNumber(value.repliesCount, replies.length),
    hasLiked: currentUserId ? likedBySet.has(currentUserId) : false,
    isEdited: Boolean(value.isEdited),
    isDeleted: false,
    isPinned: Boolean(value.isPinned),
    createdAt: typeof value.createdAt === 'string' ? value.createdAt : new Date().toISOString(),
    updatedAt: typeof value.updatedAt === 'string' ? value.updatedAt : new Date().toISOString(),
    replies,
  }
}

export const commentService = {
  getCommentTree: async (
    targetType: CommentTargetType,
    targetId: string,
    options: CommentQueryOptions = {},
  ): Promise<CommentListResponse> => {
    const page = options.page && options.page > 0 ? Math.floor(options.page) : DEFAULT_PAGE
    const limit = options.limit && options.limit > 0 ? Math.floor(options.limit) : DEFAULT_LIMIT
    const sort = options.sort ?? 'recent'

    const normalizedTargetType = normalizeTargetTypeForApi(targetType)

    const response = await apiClient.get<BackendCommentTreeResponse>(
      `/comments/${normalizedTargetType}/${encodeURIComponent(targetId)}/tree`,
      {
        params: {
          page,
          limit,
          sort,
        },
      },
    )

    const items = Array.isArray(response.data?.comments) ? response.data.comments : []
    const mappedItems = items
      .map((item) => mapComment(item, options.currentUserId, targetType, targetId))
      .filter((item): item is Comment => item !== null)

    const pagination = response.data?.pagination
    const currentPage =
      typeof pagination?.page === 'number' && pagination.page > 0
        ? Math.floor(pagination.page)
        : page
    const currentLimit =
      typeof pagination?.limit === 'number' && pagination.limit > 0
        ? Math.floor(pagination.limit)
        : limit
    const total =
      typeof pagination?.total === 'number' && pagination.total >= 0
        ? Math.floor(pagination.total)
        : mappedItems.length
    const pages =
      typeof pagination?.pages === 'number' && pagination.pages > 0
        ? Math.floor(pagination.pages)
        : 1

    return {
      items: mappedItems,
      total,
      limit: currentLimit,
      offset: (currentPage - 1) * currentLimit,
      hasMore: currentPage < pages,
    }
  },

  createComment: async (
    targetType: CommentTargetType,
    targetId: string,
    content: string,
    parentCommentId?: string,
  ): Promise<void> => {
    await apiClient.post('/comments', {
      targetType: normalizeTargetTypeForApi(targetType),
      targetId,
      content,
      parentCommentId,
    })
  },

  updateComment: async (commentId: string, content: string): Promise<void> => {
    await apiClient.patch(`/comments/${encodeURIComponent(commentId)}`, { content })
  },

  deleteComment: async (commentId: string): Promise<void> => {
    await apiClient.delete(`/comments/${encodeURIComponent(commentId)}`)
  },

  toggleLike: async (commentId: string): Promise<void> => {
    await apiClient.post(`/comments/${encodeURIComponent(commentId)}/like`)
  },
}
