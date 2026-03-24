import { apiClient } from '@/lib/api/client'
import type {
  CommunityPostDetail,
  CommunityPostDetailResponse,
  CommunityPostListItem,
  CommunityPostSort,
  CommunityPostsListResponse,
  CommunityLeaderboardResponse,
  CommunityReply,
  CommunityReplyThread,
  CommunityMyXpResponse,
  CommunityRoom,
  CommunityRoomCategory,
  CommunityRoomDetailResponse,
  CommunityRoomSummary,
  CommunityRoomsResponse,
  CommunityVoteDirection,
  CommunityVoteResponse,
} from '../types/community'

interface RawCommunityRoom {
  id?: string
  _id?: string
  slug?: string
  name?: string
  description?: string
  icon?: string
  category?: CommunityRoomCategory
  isPublic?: boolean
  requiredRole?: CommunityRoom['requiredRole']
  moderators?: unknown[]
  postCount?: number
  memberCount?: number
  isPremium?: boolean
  sortOrder?: number
  createdAt?: string
  updatedAt?: string
}

interface RawCommunityRoomsResponse {
  items?: RawCommunityRoom[]
  pagination?: CommunityRoomsResponse['pagination']
}

interface RawCommunityAuthor {
  id?: string
  _id?: string
  name?: string
  username?: string
  avatar?: string
  level?: number
  levelName?: string
}

interface RawCommunityRoomSummary {
  id?: string
  _id?: string
  slug?: string
  name?: string
  requiredRole?: CommunityRoomSummary['requiredRole']
  isPremium?: boolean
}

interface RawCommunityPostListItem {
  id?: string
  _id?: string
  room?: RawCommunityRoomSummary
  author?: RawCommunityAuthor
  title?: string
  imageUrl?: string
  upvotes?: number
  downvotes?: number
  score?: number
  replyCount?: number
  isPinned?: boolean
  isLocked?: boolean
  moderationStatus?: CommunityPostListItem['moderationStatus']
  viewerVote?: CommunityVoteDirection | null
  createdAt?: string
  updatedAt?: string
}

interface RawCommunityPostDetail extends RawCommunityPostListItem {
  content?: string
  hubContentRef?: {
    contentType?: string
    contentId?: string
  } | null
}

interface RawCommunityReply {
  id?: string
  _id?: string
  postId?: string
  parentReplyId?: string | null
  author?: RawCommunityAuthor
  content?: string
  upvotes?: number
  downvotes?: number
  score?: number
  isMarkedHelpful?: boolean
  moderationStatus?: CommunityReply['moderationStatus']
  viewerVote?: CommunityVoteDirection | null
  createdAt?: string
  updatedAt?: string
}

interface RawCommunityReplyThread extends RawCommunityReply {
  replies?: RawCommunityReply[]
}

interface RawCommunityPostsListResponse {
  room?: RawCommunityRoomSummary
  items?: RawCommunityPostListItem[]
  pageInfo?: {
    limit?: number
    sort?: CommunityPostSort
    hasMore?: boolean
    nextCursor?: string | null
  }
}

interface RawCommunityPostDetailResponse {
  post?: RawCommunityPostDetail
  replies?: RawCommunityReplyThread[]
}

interface RawCommunityLeaderboardEntry {
  rank?: number
  username?: string
  avatar?: string
  level?: number
  levelName?: string
  weeklyXp?: number
  badges?: RawCommunityXpBadge[]
}

interface RawCommunityLeaderboardResponse {
  items?: RawCommunityLeaderboardEntry[]
  me?: {
    rank?: number
    weeklyXp?: number
  } | null
}

interface RawCommunityXpBadge {
  id?: string
  unlockedAt?: string
}

interface RawCommunityXpHistoryEntry {
  action?: string
  xp?: number
  contentId?: string
  createdAt?: string
}

interface RawCommunityMyXpResponse {
  totalXp?: number
  level?: number
  levelName?: string
  weeklyXp?: number
  badges?: RawCommunityXpBadge[]
  history?: RawCommunityXpHistoryEntry[]
}

interface ListCommunityRoomsOptions {
  page?: number
  limit?: number
  category?: CommunityRoomCategory
}

interface ListCommunityRoomPostsOptions {
  limit?: number
  cursor?: string
  sort?: CommunityPostSort
}

const toString = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback

const toNumber = (value: unknown, fallback = 0): number => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

const toBoolean = (value: unknown, fallback = false): boolean =>
  typeof value === 'boolean' ? value : fallback

const toVoteDirection = (value: unknown): CommunityVoteDirection | null =>
  value === 'up' || value === 'down' ? value : null

const toUserRole = (value: unknown): CommunityRoom['requiredRole'] => {
  if (
    value === 'visitor' ||
    value === 'free' ||
    value === 'premium' ||
    value === 'creator' ||
    value === 'brand_manager' ||
    value === 'admin'
  ) {
    return value
  }
  return 'visitor'
}

const toModerators = (value: unknown): string[] => {
  if (!Array.isArray(value)) return []

  const normalized = new Set<string>()
  for (const row of value) {
    if (typeof row === 'string' && row.trim()) {
      normalized.add(row.trim())
      continue
    }
    if (row && typeof row === 'object') {
      const maybeId = (row as { id?: unknown; _id?: unknown }).id ?? (row as { _id?: unknown })._id
      if (typeof maybeId === 'string' && maybeId.trim()) {
        normalized.add(maybeId.trim())
      }
    }
  }

  return Array.from(normalized)
}

const normalizeRoom = (raw: RawCommunityRoom): CommunityRoom => {
  const id = toString(raw.id, toString(raw._id, ''))
  const slug = toString(raw.slug)

  return {
    id: id || slug,
    slug,
    name: toString(raw.name, 'Sala da Comunidade'),
    description: toString(raw.description, ''),
    icon: toString(raw.icon, '#'),
    category: (toString(raw.category, 'general') as CommunityRoomCategory) || 'general',
    isPublic: toBoolean(raw.isPublic, true),
    requiredRole: toUserRole(raw.requiredRole),
    moderators: toModerators(raw.moderators),
    postCount: Math.max(0, toNumber(raw.postCount, 0)),
    memberCount: Math.max(0, toNumber(raw.memberCount, 0)),
    isPremium: toBoolean(raw.isPremium, false),
    sortOrder: toNumber(raw.sortOrder, 0),
    createdAt: toString(raw.createdAt) || undefined,
    updatedAt: toString(raw.updatedAt) || undefined,
  }
}

const normalizeAuthor = (raw: RawCommunityAuthor | undefined): CommunityPostListItem['author'] => {
  const id = toString(raw?.id, toString(raw?._id, ''))
  const username = toString(raw?.username, '')
  const name = toString(raw?.name, username || 'Utilizador')
  const levelRaw = toNumber(raw?.level, 0)
  const level = levelRaw > 0 ? Math.floor(levelRaw) : undefined
  const levelName = toString(raw?.levelName)

  return {
    id,
    name,
    username: username || (id ? `user-${id.slice(-6)}` : 'utilizador'),
    avatar: toString(raw?.avatar) || undefined,
    level,
    levelName: levelName || undefined,
  }
}

const normalizeRoomSummary = (raw: RawCommunityRoomSummary | undefined): CommunityRoomSummary => {
  const id = toString(raw?.id, toString(raw?._id, ''))
  const slug = toString(raw?.slug)

  return {
    id: id || slug,
    slug,
    name: toString(raw?.name, 'Sala da Comunidade'),
    requiredRole: toUserRole(raw?.requiredRole),
    isPremium: toBoolean(raw?.isPremium, false),
  }
}

const normalizePostListItem = (raw: RawCommunityPostListItem): CommunityPostListItem => {
  const id = toString(raw.id, toString(raw._id, ''))
  const upvotes = Math.max(0, toNumber(raw.upvotes, 0))
  const downvotes = Math.max(0, toNumber(raw.downvotes, 0))

  return {
    id,
    room: normalizeRoomSummary(raw.room),
    author: normalizeAuthor(raw.author),
    title: toString(raw.title, ''),
    imageUrl: toString(raw.imageUrl) || undefined,
    upvotes,
    downvotes,
    score: toNumber(raw.score, upvotes - downvotes),
    replyCount: Math.max(0, toNumber(raw.replyCount, 0)),
    isPinned: toBoolean(raw.isPinned, false),
    isLocked: toBoolean(raw.isLocked, false),
    moderationStatus:
      raw.moderationStatus === 'hidden' || raw.moderationStatus === 'restricted'
        ? raw.moderationStatus
        : 'visible',
    viewerVote: toVoteDirection(raw.viewerVote),
    createdAt: toString(raw.createdAt, new Date().toISOString()),
    updatedAt: toString(raw.updatedAt, new Date().toISOString()),
  }
}

const normalizePostDetail = (raw: RawCommunityPostDetail): CommunityPostDetail => {
  const base = normalizePostListItem(raw)
  return {
    ...base,
    content: toString(raw.content, ''),
    hubContentRef:
      raw.hubContentRef &&
      typeof raw.hubContentRef.contentType === 'string' &&
      typeof raw.hubContentRef.contentId === 'string'
        ? {
            contentType: raw.hubContentRef.contentType,
            contentId: raw.hubContentRef.contentId,
          }
        : undefined,
  }
}

const normalizeReply = (raw: RawCommunityReply): CommunityReply => {
  const id = toString(raw.id, toString(raw._id, ''))
  const upvotes = Math.max(0, toNumber(raw.upvotes, 0))
  const downvotes = Math.max(0, toNumber(raw.downvotes, 0))

  return {
    id,
    postId: toString(raw.postId, ''),
    parentReplyId: raw.parentReplyId ?? null,
    author: normalizeAuthor(raw.author),
    content: toString(raw.content, ''),
    upvotes,
    downvotes,
    score: toNumber(raw.score, upvotes - downvotes),
    isMarkedHelpful: toBoolean(raw.isMarkedHelpful, false),
    moderationStatus:
      raw.moderationStatus === 'hidden' || raw.moderationStatus === 'restricted'
        ? raw.moderationStatus
        : 'visible',
    viewerVote: toVoteDirection(raw.viewerVote),
    createdAt: toString(raw.createdAt, new Date().toISOString()),
    updatedAt: toString(raw.updatedAt, new Date().toISOString()),
  }
}

const normalizeReplyThread = (raw: RawCommunityReplyThread): CommunityReplyThread => ({
  ...normalizeReply(raw),
  replies: Array.isArray(raw.replies) ? raw.replies.map(normalizeReply) : [],
})

const normalizeVoteResponse = (
  value: CommunityVoteResponse | undefined,
): CommunityVoteResponse => ({
  targetType: value?.targetType === 'reply' ? 'reply' : 'post',
  targetId: toString(value?.targetId),
  upvotes: Math.max(0, toNumber(value?.upvotes, 0)),
  downvotes: Math.max(0, toNumber(value?.downvotes, 0)),
  score: toNumber(value?.score, 0),
  viewerVote: toVoteDirection(value?.viewerVote),
})

const normalizeXpBadge = (value: RawCommunityXpBadge): CommunityMyXpResponse['badges'][number] => ({
  id: toString(value?.id, ''),
  unlockedAt: toString(value?.unlockedAt, new Date().toISOString()),
})

const normalizeXpHistoryEntry = (
  value: RawCommunityXpHistoryEntry,
): CommunityMyXpResponse['history'][number] => ({
  action: toString(value?.action, ''),
  xp: toNumber(value?.xp, 0),
  contentId: toString(value?.contentId) || undefined,
  createdAt: toString(value?.createdAt, new Date().toISOString()),
})

const normalizeMyXp = (value: RawCommunityMyXpResponse | undefined): CommunityMyXpResponse => ({
  totalXp: Math.max(0, toNumber(value?.totalXp, 0)),
  level: Math.max(1, toNumber(value?.level, 1)),
  levelName: toString(value?.levelName, 'Novato Financeiro'),
  weeklyXp: Math.max(0, toNumber(value?.weeklyXp, 0)),
  badges: Array.isArray(value?.badges) ? value.badges.map(normalizeXpBadge) : [],
  history: Array.isArray(value?.history) ? value.history.map(normalizeXpHistoryEntry) : [],
})

const normalizeLeaderboardEntry = (
  value: RawCommunityLeaderboardEntry,
  index: number,
): CommunityLeaderboardResponse['items'][number] => ({
  rank: Math.max(1, toNumber(value?.rank, index + 1)),
  username: toString(value?.username, `utilizador-${index + 1}`),
  avatar: toString(value?.avatar) || undefined,
  level: Math.max(1, toNumber(value?.level, 1)),
  levelName: toString(value?.levelName, 'Novato Financeiro'),
  weeklyXp: Math.max(0, toNumber(value?.weeklyXp, 0)),
  badges: Array.isArray(value?.badges) ? value.badges.map(normalizeXpBadge) : [],
})

const normalizeLeaderboard = (
  value: RawCommunityLeaderboardResponse | undefined,
): CommunityLeaderboardResponse => ({
  items: Array.isArray(value?.items) ? value.items.map(normalizeLeaderboardEntry) : [],
  me:
    value?.me && typeof value.me === 'object'
      ? {
          rank: Math.max(1, toNumber(value.me.rank, 1)),
          weeklyXp: Math.max(0, toNumber(value.me.weeklyXp, 0)),
        }
      : undefined,
})

export const communityService = {
  async listRooms(options: ListCommunityRoomsOptions = {}): Promise<CommunityRoomsResponse> {
    const response = await apiClient.get<RawCommunityRoomsResponse>('/community/rooms', {
      params: {
        page: options.page,
        limit: options.limit,
        category: options.category,
      },
    })

    const items = Array.isArray(response.data?.items) ? response.data.items.map(normalizeRoom) : []
    const pagination = response.data?.pagination ?? {
      page: options.page ?? 1,
      limit: options.limit ?? 12,
      total: items.length,
      pages: 1,
    }

    return {
      items,
      pagination,
    }
  },

  async getRoomBySlug(slug: string): Promise<CommunityRoom> {
    const normalizedSlug = slug.trim()
    const response = await apiClient.get<CommunityRoomDetailResponse>(
      `/community/rooms/${encodeURIComponent(normalizedSlug)}`,
    )
    return normalizeRoom(response.data.room)
  },

  async listRoomPosts(
    slug: string,
    options: ListCommunityRoomPostsOptions = {},
  ): Promise<CommunityPostsListResponse> {
    const normalizedSlug = slug.trim()
    const response = await apiClient.get<RawCommunityPostsListResponse>(
      `/community/rooms/${encodeURIComponent(normalizedSlug)}/posts`,
      {
        params: {
          limit: options.limit,
          cursor: options.cursor,
          sort: options.sort,
        },
      },
    )

    const items = Array.isArray(response.data?.items)
      ? response.data.items.map(normalizePostListItem)
      : []

    return {
      room: normalizeRoomSummary(response.data?.room),
      items,
      pageInfo: {
        limit: Math.max(1, toNumber(response.data?.pageInfo?.limit, options.limit ?? 15)),
        sort: response.data?.pageInfo?.sort === 'popular' ? 'popular' : 'recent',
        hasMore: toBoolean(response.data?.pageInfo?.hasMore, false),
        nextCursor:
          typeof response.data?.pageInfo?.nextCursor === 'string' ||
          response.data?.pageInfo?.nextCursor === null
            ? response.data.pageInfo.nextCursor
            : null,
      },
    }
  },

  async createRoomPost(
    slug: string,
    payload: {
      title: string
      content: string
      imageUrl?: string
      hubContentRef?: { contentType: string; contentId: string }
    },
  ): Promise<{ post: CommunityPostDetail }> {
    const normalizedSlug = slug.trim()
    const response = await apiClient.post<RawCommunityPostDetailResponse>(
      `/community/rooms/${encodeURIComponent(normalizedSlug)}/posts`,
      payload,
    )

    return {
      post: normalizePostDetail(response.data?.post ?? {}),
    }
  },

  async getPostById(postId: string): Promise<CommunityPostDetailResponse> {
    const normalizedPostId = postId.trim()
    const response = await apiClient.get<RawCommunityPostDetailResponse>(
      `/community/posts/${encodeURIComponent(normalizedPostId)}`,
    )

    return {
      post: normalizePostDetail(response.data?.post ?? {}),
      replies: Array.isArray(response.data?.replies)
        ? response.data.replies.map(normalizeReplyThread)
        : [],
    }
  },

  async createPostReply(
    postId: string,
    payload: { content: string; parentReply?: string },
  ): Promise<{ reply: CommunityReply }> {
    const normalizedPostId = postId.trim()
    const response = await apiClient.post<{ reply?: RawCommunityReply }>(
      `/community/posts/${encodeURIComponent(normalizedPostId)}/replies`,
      payload,
    )

    return {
      reply: normalizeReply(response.data?.reply ?? {}),
    }
  },

  async votePost(
    postId: string,
    direction: CommunityVoteDirection,
  ): Promise<CommunityVoteResponse> {
    const normalizedPostId = postId.trim()
    const response = await apiClient.post<CommunityVoteResponse>(
      `/community/posts/${encodeURIComponent(normalizedPostId)}/vote`,
      { direction },
    )
    return normalizeVoteResponse(response.data)
  },

  async voteReply(
    replyId: string,
    direction: CommunityVoteDirection,
  ): Promise<CommunityVoteResponse> {
    const normalizedReplyId = replyId.trim()
    const response = await apiClient.post<CommunityVoteResponse>(
      `/community/replies/${encodeURIComponent(normalizedReplyId)}/vote`,
      { direction },
    )
    return normalizeVoteResponse(response.data)
  },

  async getMyXp(): Promise<CommunityMyXpResponse> {
    const response = await apiClient.get<RawCommunityMyXpResponse>('/community/me/xp')
    return normalizeMyXp(response.data)
  },

  async getLeaderboard(): Promise<CommunityLeaderboardResponse> {
    const response = await apiClient.get<RawCommunityLeaderboardResponse>('/community/leaderboard')
    return normalizeLeaderboard(response.data)
  },
}
