import { apiClient } from '@/lib/api/client'
import type {
  AdminActorSummary,
  AdminCreatorTrustSignals,
  AdminPagination,
} from '../types/adminUsers'
import type {
  AdminContentModerationActionPayload,
  AdminContentModerationActionResponse,
  AdminContentModerationEvent,
  AdminContentModerationHistoryResponse,
  AdminContentPolicySignals,
  AdminContentModerationStatus,
  AdminContentPublishStatus,
  AdminContentQueueItem,
  AdminContentQueueQuery,
  AdminContentReportPriority,
  AdminContentReportSignals,
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
  reportSignals?: {
    openReports?: number
    uniqueReporters?: number
    latestReportAt?: string | null
    topReasons?: Array<{ reason?: string; count?: number }>
    priorityScore?: number
    priority?: string
  }
  policySignals?: {
    recommendedAction?: string
    escalation?: string
    automationEligible?: boolean
    automationEnabled?: boolean
    automationBlockedReason?: string | null
    matchedReasons?: string[]
    thresholds?: {
      autoHideMinPriority?: string
      autoHideMinUniqueReporters?: number
      autoHideAllowedReasons?: string[]
    }
  }
  creatorTrustSignals?: {
    trustScore?: number
    riskLevel?: string
    recommendedAction?: string
    generatedAt?: string
    summary?: {
      openReports?: number
      highPriorityTargets?: number
      criticalTargets?: number
      hiddenItems?: number
      restrictedItems?: number
      recentModerationActions30d?: number
      repeatModerationTargets30d?: number
      recentCreatorControlActions30d?: number
      activeControlFlags?: string[]
    }
    flags?: string[]
    reasons?: string[]
  } | null
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
  if (value === 'comment') return 'comment'
  if (value === 'review') return 'review'
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

const toIsoDate = (value: unknown): string | null => {
  if (typeof value !== 'string' || value.trim().length === 0) return null
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString()
}

const toReportPriority = (value: unknown): AdminContentReportPriority => {
  if (value === 'critical') return 'critical'
  if (value === 'high') return 'high'
  if (value === 'medium') return 'medium'
  if (value === 'low') return 'low'
  return 'none'
}

const mapTrustSignals = (
  signals?: BackendContentQueueItem['creatorTrustSignals'],
): AdminCreatorTrustSignals | null => {
  if (!signals || typeof signals !== 'object') return null

  return {
    trustScore: typeof signals.trustScore === 'number' ? signals.trustScore : 100,
    riskLevel:
      signals.riskLevel === 'critical'
        ? 'critical'
        : signals.riskLevel === 'high'
          ? 'high'
          : signals.riskLevel === 'medium'
            ? 'medium'
            : 'low',
    recommendedAction:
      signals.recommendedAction === 'review' ||
      signals.recommendedAction === 'set_cooldown' ||
      signals.recommendedAction === 'block_publishing' ||
      signals.recommendedAction === 'suspend_creator_ops'
        ? signals.recommendedAction
        : 'none',
    generatedAt: toIsoDate(signals.generatedAt) ?? new Date(0).toISOString(),
    summary: {
      openReports:
        typeof signals.summary?.openReports === 'number' ? signals.summary.openReports : 0,
      highPriorityTargets:
        typeof signals.summary?.highPriorityTargets === 'number'
          ? signals.summary.highPriorityTargets
          : 0,
      criticalTargets:
        typeof signals.summary?.criticalTargets === 'number' ? signals.summary.criticalTargets : 0,
      hiddenItems:
        typeof signals.summary?.hiddenItems === 'number' ? signals.summary.hiddenItems : 0,
      restrictedItems:
        typeof signals.summary?.restrictedItems === 'number' ? signals.summary.restrictedItems : 0,
      recentModerationActions30d:
        typeof signals.summary?.recentModerationActions30d === 'number'
          ? signals.summary.recentModerationActions30d
          : 0,
      repeatModerationTargets30d:
        typeof signals.summary?.repeatModerationTargets30d === 'number'
          ? signals.summary.repeatModerationTargets30d
          : 0,
      recentCreatorControlActions30d:
        typeof signals.summary?.recentCreatorControlActions30d === 'number'
          ? signals.summary.recentCreatorControlActions30d
          : 0,
      activeControlFlags: Array.isArray(signals.summary?.activeControlFlags)
        ? signals.summary.activeControlFlags.filter(
            (item): item is string => typeof item === 'string',
          )
        : [],
    },
    flags: Array.isArray(signals.flags)
      ? signals.flags.filter((item): item is string => typeof item === 'string')
      : [],
    reasons: Array.isArray(signals.reasons)
      ? signals.reasons.filter((item): item is string => typeof item === 'string')
      : [],
  }
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

const mapReportSignals = (
  input?: BackendContentQueueItem['reportSignals'],
): AdminContentReportSignals => ({
  openReports: typeof input?.openReports === 'number' ? input.openReports : 0,
  uniqueReporters: typeof input?.uniqueReporters === 'number' ? input.uniqueReporters : 0,
  latestReportAt: toIsoDate(input?.latestReportAt) ?? null,
  topReasons: Array.isArray(input?.topReasons)
    ? input.topReasons
        .map((item) =>
          typeof item?.reason === 'string' && typeof item?.count === 'number'
            ? { reason: item.reason, count: item.count }
            : null,
        )
        .filter((item): item is { reason: string; count: number } => item !== null)
    : [],
  priorityScore: typeof input?.priorityScore === 'number' ? input.priorityScore : 0,
  priority: toReportPriority(input?.priority),
})

const mapPolicySignals = (
  input?: BackendContentQueueItem['policySignals'],
): AdminContentPolicySignals => ({
  recommendedAction:
    input?.recommendedAction === 'review' ||
    input?.recommendedAction === 'restrict' ||
    input?.recommendedAction === 'hide'
      ? input.recommendedAction
      : 'none',
  escalation:
    input?.escalation === 'critical'
      ? 'critical'
      : input?.escalation === 'high'
        ? 'high'
        : input?.escalation === 'medium'
          ? 'medium'
          : input?.escalation === 'low'
            ? 'low'
            : 'none',
  automationEligible: Boolean(input?.automationEligible),
  automationEnabled: Boolean(input?.automationEnabled),
  automationBlockedReason:
    typeof input?.automationBlockedReason === 'string' ? input.automationBlockedReason : null,
  matchedReasons: Array.isArray(input?.matchedReasons)
    ? input.matchedReasons.filter((item): item is string => typeof item === 'string')
    : [],
  thresholds: {
    autoHideMinPriority: toReportPriority(input?.thresholds?.autoHideMinPriority),
    autoHideMinUniqueReporters:
      typeof input?.thresholds?.autoHideMinUniqueReporters === 'number'
        ? input.thresholds.autoHideMinUniqueReporters
        : 0,
    autoHideAllowedReasons: Array.isArray(input?.thresholds?.autoHideAllowedReasons)
      ? input.thresholds.autoHideAllowedReasons.filter(
          (item): item is string => typeof item === 'string',
        )
      : [],
  },
})

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
    moderatedAt: toIsoDate(item.moderatedAt) ?? null,
    moderatedBy: mapActor(item.moderatedBy),
    creator: mapActor(item.creator),
    createdAt: toIsoDate(item.createdAt) ?? null,
    updatedAt: toIsoDate(item.updatedAt) ?? null,
    reportSignals: mapReportSignals(item.reportSignals),
    policySignals: mapPolicySignals(item.policySignals),
    creatorTrustSignals: mapTrustSignals(item.creatorTrustSignals),
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
  if (query.flaggedOnly) params.flaggedOnly = 'true'
  if (query.minReportPriority) params.minReportPriority = query.minReportPriority
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
