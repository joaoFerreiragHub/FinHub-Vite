import { apiClient } from '@/lib/api/client'
import type { AdminActorSummary } from '../types/adminUsers'
import type {
  AdminBroadcastAccountStatus,
  AdminBroadcastActionPayload,
  AdminBroadcastChannel,
  AdminBroadcastCreatePayload,
  AdminBroadcastHistoryAction,
  AdminBroadcastHistoryEntry,
  AdminBroadcastItem,
  AdminBroadcastListQuery,
  AdminBroadcastListResponse,
  AdminBroadcastListSummary,
  AdminBroadcastMutationResponse,
  AdminBroadcastPagination,
  AdminBroadcastPreviewPayload,
  AdminBroadcastPreviewResponse,
  AdminBroadcastRole,
  AdminBroadcastSegment,
  AdminBroadcastSegmentInput,
  AdminBroadcastStatus,
} from '../types/adminBroadcasts'

interface BackendActorSummary {
  id?: string
  _id?: string
  name?: string
  username?: string
  email?: string
  role?: string
}

interface BackendBroadcastSegment {
  roles?: unknown[]
  accountStatuses?: unknown[]
  includeUsers?: unknown[]
  excludeUsers?: unknown[]
  lastActiveWithinDays?: unknown
}

interface BackendBroadcastHistoryEntry {
  action?: unknown
  reason?: unknown
  note?: unknown
  metadata?: unknown
  changedAt?: unknown
  changedBy?: BackendActorSummary | null
}

interface BackendBroadcastItem {
  id?: unknown
  _id?: unknown
  title?: unknown
  message?: unknown
  channel?: unknown
  status?: unknown
  segment?: BackendBroadcastSegment | null
  audienceEstimate?: unknown
  approval?: {
    required?: unknown
    approvedAt?: unknown
    approvedBy?: BackendActorSummary | null
    reason?: unknown
  } | null
  delivery?: {
    attempted?: unknown
    sent?: unknown
    failed?: unknown
    sentAt?: unknown
    lastError?: unknown
  } | null
  createdBy?: BackendActorSummary | null
  updatedBy?: BackendActorSummary | null
  version?: unknown
  historyCount?: unknown
  lastHistoryEntry?: BackendBroadcastHistoryEntry | null
  history?: BackendBroadcastHistoryEntry[]
  createdAt?: unknown
  updatedAt?: unknown
}

interface BackendBroadcastListResponse {
  items?: BackendBroadcastItem[]
  pagination?: Partial<AdminBroadcastPagination>
  summary?: Partial<AdminBroadcastListSummary>
}

interface BackendBroadcastPreviewSample {
  id?: unknown
  name?: unknown
  username?: unknown
  email?: unknown
  role?: unknown
  accountStatus?: unknown
  lastActiveAt?: unknown
  createdAt?: unknown
}

interface BackendBroadcastPreviewResponse {
  segment?: BackendBroadcastSegment
  estimatedRecipients?: unknown
  approvalRequired?: unknown
  massApprovalMinRecipients?: unknown
  sample?: BackendBroadcastPreviewSample[]
}

interface BackendBroadcastMutationResponse {
  message?: unknown
  item?: BackendBroadcastItem
}

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 25

const BROADCAST_STATUSES: readonly AdminBroadcastStatus[] = [
  'draft',
  'approved',
  'sent',
  'failed',
  'canceled',
]
const BROADCAST_CHANNELS: readonly AdminBroadcastChannel[] = ['in_app']
const BROADCAST_ROLES: readonly AdminBroadcastRole[] = [
  'visitor',
  'free',
  'premium',
  'creator',
  'admin',
]
const BROADCAST_ACCOUNT_STATUSES: readonly AdminBroadcastAccountStatus[] = [
  'active',
  'suspended',
  'banned',
]
const BROADCAST_HISTORY_ACTIONS: readonly AdminBroadcastHistoryAction[] = [
  'created',
  'approved',
  'send_started',
  'sent',
  'failed',
  'canceled',
]

const STATUS_SET = new Set<string>(BROADCAST_STATUSES)
const CHANNEL_SET = new Set<string>(BROADCAST_CHANNELS)
const ROLE_SET = new Set<string>(BROADCAST_ROLES)
const ACCOUNT_STATUS_SET = new Set<string>(BROADCAST_ACCOUNT_STATUSES)
const HISTORY_ACTION_SET = new Set<string>(BROADCAST_HISTORY_ACTIONS)

const toString = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback

const toOptionalString = (value: unknown): string | undefined =>
  typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined

const toNullableString = (value: unknown): string | null =>
  typeof value === 'string' && value.trim().length > 0 ? value.trim() : null

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

const isStatus = (value: unknown): value is AdminBroadcastStatus =>
  typeof value === 'string' && STATUS_SET.has(value)

const isChannel = (value: unknown): value is AdminBroadcastChannel =>
  typeof value === 'string' && CHANNEL_SET.has(value)

const isRole = (value: unknown): value is AdminBroadcastRole =>
  typeof value === 'string' && ROLE_SET.has(value)

const isAccountStatus = (value: unknown): value is AdminBroadcastAccountStatus =>
  typeof value === 'string' && ACCOUNT_STATUS_SET.has(value)

const isHistoryAction = (value: unknown): value is AdminBroadcastHistoryAction =>
  typeof value === 'string' && HISTORY_ACTION_SET.has(value)

const mapActor = (actor?: BackendActorSummary | null): AdminActorSummary | null => {
  if (!actor || typeof actor !== 'object') return null
  const id = toOptionalString(actor.id) ?? toOptionalString(actor._id)
  if (!id) return null

  return {
    id,
    name: toOptionalString(actor.name),
    username: toOptionalString(actor.username),
    email: toOptionalString(actor.email),
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

const resolveUnknownId = (value: unknown): string | null => {
  if (typeof value === 'string' && value.trim().length > 0) return value.trim()
  if (value && typeof value === 'object') {
    const asRecord = value as { id?: unknown; _id?: unknown }
    if (typeof asRecord.id === 'string' && asRecord.id.trim().length > 0) return asRecord.id.trim()
    if (typeof asRecord._id === 'string' && asRecord._id.trim().length > 0) {
      return asRecord._id.trim()
    }
  }
  return null
}

const mapSegment = (segment?: BackendBroadcastSegment | null): AdminBroadcastSegment => {
  const roles = Array.isArray(segment?.roles)
    ? segment!.roles.filter((item): item is AdminBroadcastRole => isRole(item))
    : []

  const accountStatuses = Array.isArray(segment?.accountStatuses)
    ? segment!.accountStatuses.filter((item): item is AdminBroadcastAccountStatus =>
        isAccountStatus(item),
      )
    : []

  const includeUsers = Array.isArray(segment?.includeUsers)
    ? segment!.includeUsers
        .map((value) => resolveUnknownId(value))
        .filter((value): value is string => Boolean(value))
    : []

  const excludeUsers = Array.isArray(segment?.excludeUsers)
    ? segment!.excludeUsers
        .map((value) => resolveUnknownId(value))
        .filter((value): value is string => Boolean(value))
    : []

  return {
    roles,
    accountStatuses: accountStatuses.length > 0 ? accountStatuses : ['active'],
    includeUsers,
    excludeUsers,
    lastActiveWithinDays:
      typeof segment?.lastActiveWithinDays === 'number' && segment.lastActiveWithinDays > 0
        ? Math.trunc(segment.lastActiveWithinDays)
        : typeof segment?.lastActiveWithinDays === 'string' &&
            Number.parseInt(segment.lastActiveWithinDays, 10) > 0
          ? Number.parseInt(segment.lastActiveWithinDays, 10)
          : null,
  }
}

const mapHistoryEntry = (entry: BackendBroadcastHistoryEntry): AdminBroadcastHistoryEntry => ({
  action: isHistoryAction(entry.action) ? entry.action : 'created',
  reason: toNullableString(entry.reason),
  note: toNullableString(entry.note),
  metadata: entry.metadata && typeof entry.metadata === 'object' ? entry.metadata : null,
  changedAt: toIsoDateOrNull(entry.changedAt),
  changedBy: mapActor(entry.changedBy),
})

const mapItem = (row: BackendBroadcastItem): AdminBroadcastItem | null => {
  const id = resolveUnknownId(row.id) ?? resolveUnknownId(row._id)
  if (!id) return null

  const history = Array.isArray(row.history) ? row.history.map(mapHistoryEntry) : undefined
  const lastHistoryEntry =
    row.lastHistoryEntry && typeof row.lastHistoryEntry === 'object'
      ? mapHistoryEntry(row.lastHistoryEntry)
      : history && history.length > 0
        ? history[history.length - 1]
        : null

  return {
    id,
    title: toString(row.title),
    message: toString(row.message),
    channel: isChannel(row.channel) ? row.channel : 'in_app',
    status: isStatus(row.status) ? row.status : 'draft',
    segment: mapSegment(row.segment),
    audienceEstimate: toNonNegativeInt(row.audienceEstimate, 0),
    approval: {
      required: row.approval?.required === true,
      approvedAt: toIsoDateOrNull(row.approval?.approvedAt),
      approvedBy: mapActor(row.approval?.approvedBy),
      reason: toNullableString(row.approval?.reason),
    },
    delivery: {
      attempted: toNonNegativeInt(row.delivery?.attempted, 0),
      sent: toNonNegativeInt(row.delivery?.sent, 0),
      failed: toNonNegativeInt(row.delivery?.failed, 0),
      sentAt: toIsoDateOrNull(row.delivery?.sentAt),
      lastError: toNullableString(row.delivery?.lastError),
    },
    createdBy: mapActor(row.createdBy),
    updatedBy: mapActor(row.updatedBy),
    version: toPositiveInt(row.version, 1),
    historyCount: toNonNegativeInt(row.historyCount, history?.length ?? 0),
    lastHistoryEntry,
    history,
    createdAt: toIsoDateOrNull(row.createdAt),
    updatedAt: toIsoDateOrNull(row.updatedAt),
  }
}

const mapPagination = (value?: Partial<AdminBroadcastPagination>): AdminBroadcastPagination => ({
  page: toPositiveInt(value?.page, DEFAULT_PAGE),
  limit: toPositiveInt(value?.limit, DEFAULT_LIMIT),
  total: toNonNegativeInt(value?.total, 0),
  pages: toPositiveInt(value?.pages, 1),
})

const mapSummary = (value?: Partial<AdminBroadcastListSummary>): AdminBroadcastListSummary => ({
  draft: toNonNegativeInt(value?.draft, 0),
  approved: toNonNegativeInt(value?.approved, 0),
  sent: toNonNegativeInt(value?.sent, 0),
  failed: toNonNegativeInt(value?.failed, 0),
  canceled: toNonNegativeInt(value?.canceled, 0),
  total: toNonNegativeInt(value?.total, 0),
})

const toListQueryParams = (query: AdminBroadcastListQuery) => {
  const params: Record<string, string | number> = {}
  if (query.status) params.status = query.status
  if (query.channel) params.channel = query.channel
  if (query.search?.trim()) params.search = query.search.trim()
  if (typeof query.page === 'number' && query.page > 0) params.page = query.page
  if (typeof query.limit === 'number' && query.limit > 0) params.limit = query.limit
  return params
}

const toBackendSegment = (
  segment?: AdminBroadcastSegmentInput,
): Record<string, unknown> | undefined => {
  if (!segment || typeof segment !== 'object') return undefined

  const payload: Record<string, unknown> = {}
  if (Array.isArray(segment.roles) && segment.roles.length > 0) payload.roles = segment.roles
  if (Array.isArray(segment.accountStatuses) && segment.accountStatuses.length > 0) {
    payload.accountStatuses = segment.accountStatuses
  }
  if (Array.isArray(segment.includeUsers) && segment.includeUsers.length > 0) {
    payload.includeUsers = segment.includeUsers
  }
  if (Array.isArray(segment.excludeUsers) && segment.excludeUsers.length > 0) {
    payload.excludeUsers = segment.excludeUsers
  }
  if (
    typeof segment.lastActiveWithinDays === 'number' &&
    Number.isFinite(segment.lastActiveWithinDays) &&
    segment.lastActiveWithinDays > 0
  ) {
    payload.lastActiveWithinDays = Math.trunc(segment.lastActiveWithinDays)
  }

  return Object.keys(payload).length > 0 ? payload : undefined
}

const toBackendPreviewPayload = (
  payload: AdminBroadcastPreviewPayload,
): Record<string, unknown> => {
  const body: Record<string, unknown> = {}
  const segment = toBackendSegment(payload.segment)
  if (segment) body.segment = segment
  if (typeof payload.sampleLimit === 'number' && payload.sampleLimit > 0) {
    body.sampleLimit = Math.trunc(payload.sampleLimit)
  }
  return body
}

const toBackendCreatePayload = (payload: AdminBroadcastCreatePayload): Record<string, unknown> => {
  const body: Record<string, unknown> = {
    title: payload.title.trim(),
    message: payload.message.trim(),
  }
  if (payload.channel) body.channel = payload.channel
  const segment = toBackendSegment(payload.segment)
  if (segment) body.segment = segment
  if (payload.note?.trim()) body.note = payload.note.trim()
  return body
}

const toBackendActionPayload = (payload: AdminBroadcastActionPayload): Record<string, unknown> => {
  const body: Record<string, unknown> = {
    reason: payload.reason.trim(),
  }
  if (payload.note?.trim()) body.note = payload.note.trim()
  return body
}

const mapPreview = (value: BackendBroadcastPreviewResponse): AdminBroadcastPreviewResponse => ({
  segment: mapSegment(value.segment),
  estimatedRecipients: toNonNegativeInt(value.estimatedRecipients, 0),
  approvalRequired: value.approvalRequired === true,
  massApprovalMinRecipients: toPositiveInt(value.massApprovalMinRecipients, 500),
  sample: Array.isArray(value.sample)
    ? value.sample.map((row) => ({
        id: resolveUnknownId(row.id),
        name: toNullableString(row.name),
        username: toNullableString(row.username),
        email: toNullableString(row.email),
        role: isRole(row.role) ? row.role : null,
        accountStatus: isAccountStatus(row.accountStatus) ? row.accountStatus : null,
        lastActiveAt: toIsoDateOrNull(row.lastActiveAt),
        createdAt: toIsoDateOrNull(row.createdAt),
      }))
    : [],
})

const mapMutationResponse = (
  response: BackendBroadcastMutationResponse,
  fallbackMessage: string,
): AdminBroadcastMutationResponse => {
  const item = mapItem(response.item ?? {})
  if (!item) throw new Error('Resposta admin invalida: broadcast em falta.')
  return {
    message: toString(response.message, fallbackMessage),
    item,
  }
}

export const adminBroadcastsService = {
  list: async (query: AdminBroadcastListQuery): Promise<AdminBroadcastListResponse> => {
    const response = await apiClient.get<BackendBroadcastListResponse>(
      '/admin/communications/broadcasts',
      {
        params: toListQueryParams(query),
      },
    )

    return {
      items: (response.data.items ?? [])
        .map(mapItem)
        .filter((item): item is AdminBroadcastItem => item !== null),
      pagination: mapPagination(response.data.pagination),
      summary: mapSummary(response.data.summary),
    }
  },

  getById: async (broadcastId: string): Promise<AdminBroadcastItem> => {
    const response = await apiClient.get<BackendBroadcastItem>(
      `/admin/communications/broadcasts/${encodeURIComponent(broadcastId)}`,
    )
    const item = mapItem(response.data)
    if (!item) throw new Error('Resposta admin invalida: broadcast em falta.')
    return item
  },

  previewAudience: async (
    payload: AdminBroadcastPreviewPayload,
  ): Promise<AdminBroadcastPreviewResponse> => {
    const response = await apiClient.post<BackendBroadcastPreviewResponse>(
      '/admin/communications/broadcasts/preview',
      toBackendPreviewPayload(payload),
    )
    return mapPreview(response.data)
  },

  create: async (payload: AdminBroadcastCreatePayload): Promise<AdminBroadcastMutationResponse> => {
    const response = await apiClient.post<BackendBroadcastMutationResponse>(
      '/admin/communications/broadcasts',
      toBackendCreatePayload(payload),
    )
    return mapMutationResponse(response.data, 'Broadcast criado com sucesso.')
  },

  approve: async (
    broadcastId: string,
    payload: AdminBroadcastActionPayload,
  ): Promise<AdminBroadcastMutationResponse> => {
    const response = await apiClient.post<BackendBroadcastMutationResponse>(
      `/admin/communications/broadcasts/${encodeURIComponent(broadcastId)}/approve`,
      toBackendActionPayload(payload),
    )
    return mapMutationResponse(response.data, 'Broadcast aprovado com sucesso.')
  },

  send: async (
    broadcastId: string,
    payload: AdminBroadcastActionPayload,
  ): Promise<AdminBroadcastMutationResponse> => {
    const response = await apiClient.post<BackendBroadcastMutationResponse>(
      `/admin/communications/broadcasts/${encodeURIComponent(broadcastId)}/send`,
      toBackendActionPayload(payload),
    )
    return mapMutationResponse(response.data, 'Envio de broadcast executado.')
  },
}
