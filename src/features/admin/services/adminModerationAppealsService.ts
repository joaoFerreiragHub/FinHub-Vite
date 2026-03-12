import { apiClient } from '@/lib/api/client'
import type { AdminContentType } from '../types/adminContent'
import type { AdminActorSummary } from '../types/adminUsers'
import type {
  AdminModerationAppealHistoryEntry,
  AdminModerationAppealItem,
  AdminModerationAppealListQuery,
  AdminModerationAppealListResponse,
  AdminModerationAppealListSummary,
  AdminModerationAppealMutationResponse,
  AdminModerationAppealPagination,
  AdminModerationAppealReasonCategory,
  AdminModerationAppealSeverity,
  AdminModerationAppealStatus,
  AdminUpdateModerationAppealStatusPayload,
} from '../types/adminModerationAppeals'

interface BackendActorSummary {
  id?: string
  _id?: string
  name?: string
  username?: string
  email?: string
  role?: string
}

interface BackendAppealHistoryEntry {
  fromStatus?: string
  toStatus?: string
  reason?: string
  note?: string | null
  changedAt?: string | null
  changedBy?: BackendActorSummary | null
}

interface BackendAppealModerationEvent {
  id?: string
  _id?: string
  contentType?: string | null
  contentId?: string | null
  action?: string | null
  fromStatus?: string | null
  toStatus?: string | null
  reason?: string | null
  createdAt?: string | null
}

interface BackendAppealItem {
  id?: string
  _id?: string
  moderationEvent?: BackendAppealModerationEvent | null
  contentType?: string | null
  contentId?: string | null
  appellant?: BackendActorSummary | null
  status?: string
  severity?: string
  reasonCategory?: string
  reason?: string
  note?: string | null
  slaHours?: number
  openedAt?: string | null
  firstResponseAt?: string | null
  resolvedAt?: string | null
  dueAt?: string | null
  sla?: {
    isBreached?: boolean
    remainingMinutes?: number | null
    firstResponseMinutes?: number | null
    resolutionMinutes?: number | null
  } | null
  createdBy?: BackendActorSummary | null
  updatedBy?: BackendActorSummary | null
  version?: number
  historyCount?: number
  lastHistoryEntry?: BackendAppealHistoryEntry | null
  history?: BackendAppealHistoryEntry[]
  createdAt?: string | null
  updatedAt?: string | null
}

interface BackendAppealListResponse {
  items?: BackendAppealItem[]
  pagination?: Partial<AdminModerationAppealPagination>
  summary?: Partial<AdminModerationAppealListSummary>
}

interface BackendAppealMutationResponse {
  message?: string
  item?: BackendAppealItem
}

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 25

const toString = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback

const toOptionalString = (value: unknown): string | undefined =>
  typeof value === 'string' && value.trim().length > 0 ? value : undefined

const toNullableString = (value: unknown): string | null =>
  typeof value === 'string' && value.trim().length > 0 ? value : null

const toIsoDateOrNull = (value: unknown): string | null => {
  if (typeof value !== 'string' || value.trim().length === 0) return null
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString()
}

const toNonNegativeInt = (value: unknown, fallback = 0): number => {
  const parsed =
    typeof value === 'number'
      ? value
      : typeof value === 'string'
        ? Number.parseInt(value, 10)
        : Number.NaN
  if (!Number.isFinite(parsed) || parsed < 0) return fallback
  return Math.trunc(parsed)
}

const toPositiveInt = (value: unknown, fallback: number): number => {
  const parsed = toNonNegativeInt(value, fallback)
  if (parsed < 1) return fallback
  return parsed
}

const toStatus = (value: unknown): AdminModerationAppealStatus => {
  if (value === 'under_review') return 'under_review'
  if (value === 'accepted') return 'accepted'
  if (value === 'rejected') return 'rejected'
  if (value === 'closed') return 'closed'
  return 'open'
}

const toSeverity = (value: unknown): AdminModerationAppealSeverity => {
  if (value === 'low') return 'low'
  if (value === 'high') return 'high'
  if (value === 'critical') return 'critical'
  return 'medium'
}

const toReasonCategory = (value: unknown): AdminModerationAppealReasonCategory => {
  if (value === 'false_positive') return 'false_positive'
  if (value === 'context_missing') return 'context_missing'
  if (value === 'policy_dispute') return 'policy_dispute'
  return 'other'
}

const toContentType = (value: unknown): AdminContentType | null => {
  if (
    value === 'article' ||
    value === 'video' ||
    value === 'course' ||
    value === 'live' ||
    value === 'podcast' ||
    value === 'book' ||
    value === 'comment' ||
    value === 'review'
  ) {
    return value
  }
  return null
}

const mapActor = (value: BackendActorSummary | null | undefined): AdminActorSummary | null => {
  if (!value || typeof value !== 'object') return null
  const id = toOptionalString(value.id) ?? toOptionalString(value._id)
  if (!id) return null

  return {
    id,
    name: toOptionalString(value.name),
    username: toOptionalString(value.username),
    email: toOptionalString(value.email),
    role:
      value.role === 'visitor' ||
      value.role === 'free' ||
      value.role === 'premium' ||
      value.role === 'creator' ||
      value.role === 'admin'
        ? value.role
        : undefined,
  }
}

const mapHistoryEntry = (
  entry: BackendAppealHistoryEntry,
): AdminModerationAppealHistoryEntry => ({
  fromStatus: toStatus(entry.fromStatus),
  toStatus: toStatus(entry.toStatus),
  reason: toString(entry.reason),
  note: toNullableString(entry.note),
  changedAt: toIsoDateOrNull(entry.changedAt),
  changedBy: mapActor(entry.changedBy),
})

const mapItem = (row: BackendAppealItem): AdminModerationAppealItem | null => {
  const id = toOptionalString(row.id) ?? toOptionalString(row._id)
  if (!id) return null

  const historyEntries = Array.isArray(row.history) ? row.history.map(mapHistoryEntry) : undefined

  return {
    id,
    moderationEvent:
      row.moderationEvent && typeof row.moderationEvent === 'object'
        ? {
            id:
              toOptionalString(row.moderationEvent.id) ??
              toOptionalString(row.moderationEvent._id) ??
              null,
            contentType: toContentType(row.moderationEvent.contentType),
            contentId: toNullableString(row.moderationEvent.contentId),
            action: toNullableString(row.moderationEvent.action),
            fromStatus: toNullableString(row.moderationEvent.fromStatus),
            toStatus: toNullableString(row.moderationEvent.toStatus),
            reason: toNullableString(row.moderationEvent.reason),
            createdAt: toIsoDateOrNull(row.moderationEvent.createdAt),
          }
        : null,
    contentType: toContentType(row.contentType),
    contentId: toNullableString(row.contentId),
    appellant: mapActor(row.appellant),
    status: toStatus(row.status),
    severity: toSeverity(row.severity),
    reasonCategory: toReasonCategory(row.reasonCategory),
    reason: toString(row.reason),
    note: toNullableString(row.note),
    slaHours: toPositiveInt(row.slaHours, 48),
    openedAt: toIsoDateOrNull(row.openedAt),
    firstResponseAt: toIsoDateOrNull(row.firstResponseAt),
    resolvedAt: toIsoDateOrNull(row.resolvedAt),
    dueAt: toIsoDateOrNull(row.dueAt),
    sla: {
      isBreached: row.sla?.isBreached === true,
      remainingMinutes:
        typeof row.sla?.remainingMinutes === 'number' && Number.isFinite(row.sla.remainingMinutes)
          ? Math.trunc(row.sla.remainingMinutes)
          : null,
      firstResponseMinutes:
        typeof row.sla?.firstResponseMinutes === 'number' &&
        Number.isFinite(row.sla.firstResponseMinutes)
          ? Math.trunc(row.sla.firstResponseMinutes)
          : null,
      resolutionMinutes:
        typeof row.sla?.resolutionMinutes === 'number' && Number.isFinite(row.sla.resolutionMinutes)
          ? Math.trunc(row.sla.resolutionMinutes)
          : null,
    },
    createdBy: mapActor(row.createdBy),
    updatedBy: mapActor(row.updatedBy),
    version: toPositiveInt(row.version, 1),
    historyCount: toNonNegativeInt(row.historyCount, historyEntries?.length ?? 0),
    lastHistoryEntry:
      row.lastHistoryEntry && typeof row.lastHistoryEntry === 'object'
        ? mapHistoryEntry(row.lastHistoryEntry)
        : null,
    history: historyEntries,
    createdAt: toIsoDateOrNull(row.createdAt),
    updatedAt: toIsoDateOrNull(row.updatedAt),
  }
}

const mapPagination = (
  value?: Partial<AdminModerationAppealPagination>,
): AdminModerationAppealPagination => ({
  page: toPositiveInt(value?.page, DEFAULT_PAGE),
  limit: toPositiveInt(value?.limit, DEFAULT_LIMIT),
  total: toNonNegativeInt(value?.total, 0),
  pages: toPositiveInt(value?.pages, 1),
})

const mapSummary = (
  value?: Partial<AdminModerationAppealListSummary>,
): AdminModerationAppealListSummary => ({
  open: toNonNegativeInt(value?.open, 0),
  underReview: toNonNegativeInt(value?.underReview, 0),
  accepted: toNonNegativeInt(value?.accepted, 0),
  rejected: toNonNegativeInt(value?.rejected, 0),
  closed: toNonNegativeInt(value?.closed, 0),
  breachedSla: toNonNegativeInt(value?.breachedSla, 0),
  total: toNonNegativeInt(value?.total, 0),
})

const toListQueryParams = (query: AdminModerationAppealListQuery) => {
  const params: Record<string, string | number> = {}
  if (query.status) params.status = query.status
  if (query.severity) params.severity = query.severity
  if (query.contentType) params.contentType = query.contentType
  if (typeof query.breachedSla === 'boolean') params.breachedSla = query.breachedSla ? 'true' : 'false'
  if (query.search?.trim()) params.search = query.search.trim()
  if (typeof query.page === 'number' && query.page > 0) params.page = query.page
  if (typeof query.limit === 'number' && query.limit > 0) params.limit = query.limit
  return params
}

export const adminModerationAppealsService = {
  list: async (query: AdminModerationAppealListQuery): Promise<AdminModerationAppealListResponse> => {
    const response = await apiClient.get<BackendAppealListResponse>('/admin/content/appeals', {
      params: toListQueryParams(query),
    })

    return {
      items: (response.data.items ?? [])
        .map(mapItem)
        .filter((item): item is AdminModerationAppealItem => item !== null),
      pagination: mapPagination(response.data.pagination),
      summary: mapSummary(response.data.summary),
    }
  },

  getById: async (appealId: string): Promise<AdminModerationAppealItem> => {
    const response = await apiClient.get<BackendAppealItem>(
      `/admin/content/appeals/${encodeURIComponent(appealId)}`,
    )
    const item = mapItem(response.data)
    if (!item) throw new Error('Resposta admin invalida: apelacao em falta.')
    return item
  },

  updateStatus: async (
    appealId: string,
    payload: AdminUpdateModerationAppealStatusPayload,
  ): Promise<AdminModerationAppealMutationResponse> => {
    const response = await apiClient.patch<BackendAppealMutationResponse>(
      `/admin/content/appeals/${encodeURIComponent(appealId)}/status`,
      payload,
    )
    const item = mapItem(response.data.item ?? {})
    if (!item) throw new Error('Resposta admin invalida: apelacao em falta.')
    return {
      message: toString(response.data.message, 'Estado da apelacao atualizado com sucesso.'),
      item,
    }
  },
}
