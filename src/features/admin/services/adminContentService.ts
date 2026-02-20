import { apiClient } from '@/lib/api/client'
import type { AdminActorSummary, AdminPagination } from '../types/adminUsers'
import type {
  AdminContentModerationActionPayload,
  AdminContentModerationActionResponse,
  AdminContentModerationEvent,
  AdminContentModerationHistoryResponse,
  AdminContentModerationStatus,
  AdminContentPublishStatus,
  AdminContentQueueItem,
  AdminContentQueueQuery,
  AdminContentQueueResponse,
  AdminContentType,
} from '../types/adminContent'

interface BackendActorSummary {
  id?: string
  _id?: string
  name?: string
  username?: string
  email?: string
  role?: string
}

interface BackendContentQueueItem {
  id?: string
  _id?: string
  contentType?: string
  title?: string
  slug?: string
  description?: string
  category?: string
  status?: string
  moderationStatus?: string
  moderationReason?: string | null
  moderationNote?: string | null
  moderatedAt?: string | null
  moderatedBy?: BackendActorSummary | null
  creator?: BackendActorSummary | null
  createdAt?: string | null
  updatedAt?: string | null
}

interface BackendContentQueueResponse {
  items?: BackendContentQueueItem[]
  pagination?: Partial<AdminPagination>
}

interface BackendModerationEvent {
  id?: string
  _id?: string
  contentType?: string
  contentId?: string
  actor?: BackendActorSummary | null
  action?: string
  fromStatus?: string
  toStatus?: string
  reason?: string
  note?: string | null
  metadata?: Record<string, unknown> | null
  createdAt?: string
}

interface BackendModerationHistoryResponse {
  items?: BackendModerationEvent[]
  pagination?: Partial<AdminPagination>
}

interface BackendModerationActionResponse {
  message?: string
  changed?: boolean
  fromStatus?: string
  toStatus?: string
  content?: BackendContentQueueItem
}

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 25

const resolveId = (value: unknown): string | null => {
  if (typeof value === 'string' && value.length > 0) return value
  if (value && typeof value === 'object') {
    const maybeId = (value as { id?: unknown; _id?: unknown }).id
    if (typeof maybeId === 'string' && maybeId.length > 0) return maybeId

    const maybeObjectId = (value as { _id?: unknown })._id
    if (typeof maybeObjectId === 'string' && maybeObjectId.length > 0) return maybeObjectId
  }

  return null
}

const toContentType = (value: string | undefined): AdminContentType | null => {
  if (value === 'article') return 'article'
  if (value === 'video') return 'video'
  if (value === 'course') return 'course'
  if (value === 'live') return 'live'
  if (value === 'podcast') return 'podcast'
  if (value === 'book') return 'book'
  return null
}

const toModerationStatus = (value: string | undefined): AdminContentModerationStatus => {
  if (value === 'hidden') return 'hidden'
  if (value === 'restricted') return 'restricted'
  return 'visible'
}

const toPublishStatus = (value: string | undefined): AdminContentPublishStatus => {
  if (value === 'draft') return 'draft'
  if (value === 'archived') return 'archived'
  return 'published'
}

const toAction = (value: string | undefined): 'hide' | 'unhide' | 'restrict' | null => {
  if (value === 'hide') return 'hide'
  if (value === 'unhide') return 'unhide'
  if (value === 'restrict') return 'restrict'
  return null
}

const mapActor = (actor?: BackendActorSummary | null): AdminActorSummary | null => {
  if (!actor) return null

  const id = resolveId(actor)
  if (!id) return null

  return {
    id,
    name: actor.name,
    username: actor.username,
    email: actor.email,
    role:
      actor.role === 'visitor' ||
      actor.role === 'free' ||
      actor.role === 'premium' ||
      actor.role === 'creator' ||
      actor.role === 'admin'
        ? actor.role
        : undefined,
  }
}

const normalizePagination = (pagination?: Partial<AdminPagination>): AdminPagination => {
  return {
    page: pagination?.page && pagination.page > 0 ? pagination.page : DEFAULT_PAGE,
    limit: pagination?.limit && pagination.limit > 0 ? pagination.limit : DEFAULT_LIMIT,
    total: pagination?.total && pagination.total >= 0 ? pagination.total : 0,
    pages: pagination?.pages && pagination.pages > 0 ? pagination.pages : 1,
  }
}

const mapQueueItem = (item: BackendContentQueueItem): AdminContentQueueItem | null => {
  const id = resolveId(item)
  const contentType = toContentType(item.contentType)

  if (!id || !contentType) return null

  return {
    id,
    contentType,
    title: item.title ?? '',
    slug: item.slug ?? '',
    description: item.description ?? '',
    category: item.category ?? '',
    status: toPublishStatus(item.status),
    moderationStatus: toModerationStatus(item.moderationStatus),
    moderationReason: item.moderationReason ?? null,
    moderationNote: item.moderationNote ?? null,
    moderatedAt: item.moderatedAt ?? null,
    moderatedBy: mapActor(item.moderatedBy),
    creator: mapActor(item.creator),
    createdAt: item.createdAt ?? null,
    updatedAt: item.updatedAt ?? null,
  }
}

const mapEvent = (item: BackendModerationEvent): AdminContentModerationEvent | null => {
  const id = resolveId(item)
  const contentType = toContentType(item.contentType)
  const action = toAction(item.action)
  if (!id || !contentType || !action || !item.contentId || !item.reason || !item.createdAt) {
    return null
  }

  return {
    id,
    contentType,
    contentId: item.contentId,
    actor: mapActor(item.actor),
    action,
    fromStatus: toModerationStatus(item.fromStatus),
    toStatus: toModerationStatus(item.toStatus),
    reason: item.reason,
    note: item.note ?? null,
    metadata: item.metadata ?? null,
    createdAt: item.createdAt,
  }
}

const buildQueueParams = (query: AdminContentQueueQuery): Record<string, string | number> => {
  const params: Record<string, string | number> = {}

  if (query.contentType) params.contentType = query.contentType
  if (query.moderationStatus) params.moderationStatus = query.moderationStatus
  if (query.publishStatus) params.publishStatus = query.publishStatus
  if (query.search && query.search.trim().length > 0) params.search = query.search.trim()
  if (query.creatorId && query.creatorId.trim().length > 0)
    params.creatorId = query.creatorId.trim()
  if (typeof query.page === 'number' && query.page > 0) params.page = query.page
  if (typeof query.limit === 'number' && query.limit > 0) params.limit = query.limit

  return params
}

const mapActionResponse = (
  data: BackendModerationActionResponse,
): AdminContentModerationActionResponse => {
  const content = data.content ? mapQueueItem(data.content) : null
  if (!content) {
    throw new Error('Resposta admin invalida: conteudo em falta.')
  }

  return {
    message: data.message ?? 'Acao executada com sucesso.',
    changed: Boolean(data.changed),
    fromStatus: toModerationStatus(data.fromStatus),
    toStatus: toModerationStatus(data.toStatus),
    content,
  }
}

const postModerationAction = async (
  contentType: AdminContentType,
  contentId: string,
  action: 'hide' | 'unhide' | 'restrict',
  payload: AdminContentModerationActionPayload,
): Promise<AdminContentModerationActionResponse> => {
  const response = await apiClient.post<BackendModerationActionResponse>(
    `/admin/content/${contentType}/${contentId}/${action}`,
    payload,
  )
  return mapActionResponse(response.data)
}

export const adminContentService = {
  listQueue: async (query: AdminContentQueueQuery = {}): Promise<AdminContentQueueResponse> => {
    const response = await apiClient.get<BackendContentQueueResponse>('/admin/content/queue', {
      params: buildQueueParams(query),
    })

    const items = (response.data.items ?? [])
      .map(mapQueueItem)
      .filter((item): item is AdminContentQueueItem => item !== null)

    return {
      items,
      pagination: normalizePagination(response.data.pagination),
    }
  },

  getContentModerationHistory: async (
    contentType: AdminContentType,
    contentId: string,
    page = 1,
    limit = 10,
  ): Promise<AdminContentModerationHistoryResponse> => {
    const response = await apiClient.get<BackendModerationHistoryResponse>(
      `/admin/content/${contentType}/${contentId}/history`,
      {
        params: { page, limit },
      },
    )

    const items = (response.data.items ?? [])
      .map(mapEvent)
      .filter((item): item is AdminContentModerationEvent => item !== null)

    return {
      items,
      pagination: normalizePagination(response.data.pagination),
    }
  },

  hideContent: async (
    contentType: AdminContentType,
    contentId: string,
    payload: AdminContentModerationActionPayload,
  ): Promise<AdminContentModerationActionResponse> =>
    postModerationAction(contentType, contentId, 'hide', payload),

  unhideContent: async (
    contentType: AdminContentType,
    contentId: string,
    payload: AdminContentModerationActionPayload,
  ): Promise<AdminContentModerationActionResponse> =>
    postModerationAction(contentType, contentId, 'unhide', payload),

  restrictContent: async (
    contentType: AdminContentType,
    contentId: string,
    payload: AdminContentModerationActionPayload,
  ): Promise<AdminContentModerationActionResponse> =>
    postModerationAction(contentType, contentId, 'restrict', payload),
}
