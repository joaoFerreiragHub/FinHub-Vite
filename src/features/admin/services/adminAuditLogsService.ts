import { apiClient } from '@/lib/api/client'
import type {
  AdminAuditLogItem,
  AdminAuditLogsPagination,
  AdminAuditLogsQuery,
  AdminAuditLogsResponse,
  AdminAuditOutcome,
} from '../types/adminAuditLogs'
import type { AdminActorSummary } from '../types/adminUsers'

interface BackendAdminActorSummary {
  id?: string
  _id?: string
  name?: string
  username?: string
  email?: string
  role?: string
}

interface BackendAdminAuditLogItem {
  id?: string
  _id?: string
  createdAt?: string
  actor?: BackendAdminActorSummary | null
  actorRole?: string
  action?: string
  scope?: string | null
  resourceType?: string
  resourceId?: string | null
  reason?: string | null
  requestId?: string | null
  method?: string
  path?: string
  statusCode?: number
  outcome?: string
  ip?: string | null
  userAgent?: string | null
  metadata?: Record<string, unknown> | null
}

interface BackendAdminAuditLogsResponse {
  items?: BackendAdminAuditLogItem[]
  pagination?: Partial<AdminAuditLogsPagination>
}

const toIsoDate = (value: unknown): string => {
  if (typeof value !== 'string' || value.trim().length === 0) return new Date(0).toISOString()
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? new Date(0).toISOString() : parsed.toISOString()
}

const toNumber = (value: unknown, fallback: number): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback

const toString = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback

const toOptionalString = (value: unknown): string | undefined =>
  typeof value === 'string' && value.trim().length > 0 ? value : undefined

const toOutcome = (value: unknown): AdminAuditOutcome => {
  if (value === 'forbidden') return 'forbidden'
  if (value === 'error') return 'error'
  return 'success'
}

const resolveId = (value: unknown): string | null => {
  if (!value || typeof value !== 'object') return null
  const record = value as { id?: unknown; _id?: unknown }
  if (typeof record.id === 'string' && record.id.length > 0) return record.id
  if (typeof record._id === 'string' && record._id.length > 0) return record._id
  return null
}

const mapActor = (actor?: BackendAdminActorSummary | null): AdminActorSummary | null => {
  if (!actor) return null
  const id = resolveId(actor)
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

const mapItem = (item: BackendAdminAuditLogItem): AdminAuditLogItem | null => {
  const id = toOptionalString(item.id) ?? toOptionalString(item._id)
  if (!id) return null

  return {
    id,
    createdAt: toIsoDate(item.createdAt),
    actor: mapActor(item.actor),
    actorRole: toString(item.actorRole, ''),
    action: toString(item.action, ''),
    scope: toOptionalString(item.scope),
    resourceType: toString(item.resourceType, ''),
    resourceId: toOptionalString(item.resourceId),
    reason: toOptionalString(item.reason),
    requestId: toOptionalString(item.requestId),
    method: toString(item.method, ''),
    path: toString(item.path, ''),
    statusCode: toNumber(item.statusCode, 0),
    outcome: toOutcome(item.outcome),
    ip: toOptionalString(item.ip),
    userAgent: toOptionalString(item.userAgent),
    metadata:
      item.metadata && typeof item.metadata === 'object'
        ? (item.metadata as Record<string, unknown>)
        : undefined,
  }
}

const normalizePagination = (
  pagination?: Partial<AdminAuditLogsPagination>,
): AdminAuditLogsPagination => ({
  page: toNumber(pagination?.page, 1),
  limit: toNumber(pagination?.limit, 50),
  total: toNumber(pagination?.total, 0),
  pages: toNumber(pagination?.pages, 1),
})

const toQueryParams = (query: AdminAuditLogsQuery): Record<string, string | number> => {
  const params: Record<string, string | number> = {}
  if (query.actorId) params.actorId = query.actorId
  if (query.action) params.action = query.action
  if (query.resourceType) params.resourceType = query.resourceType
  if (query.outcome) params.outcome = query.outcome
  if (query.requestId) params.requestId = query.requestId
  if (query.from) params.from = query.from
  if (query.to) params.to = query.to
  if (typeof query.page === 'number' && query.page > 0) params.page = query.page
  if (typeof query.limit === 'number' && query.limit > 0) params.limit = query.limit
  return params
}

export const adminAuditLogsService = {
  list: async (query: AdminAuditLogsQuery): Promise<AdminAuditLogsResponse> => {
    const response = await apiClient.get<BackendAdminAuditLogsResponse>('/admin/audit-logs', {
      params: toQueryParams(query),
    })
    const data = response.data ?? {}

    return {
      items: (data.items ?? [])
        .map(mapItem)
        .filter((item): item is AdminAuditLogItem => item !== null),
      pagination: normalizePagination(data.pagination),
    }
  },
  exportCsv: async (query: AdminAuditLogsQuery & { maxRows?: number }): Promise<void> => {
    const response = await apiClient.get('/admin/audit-logs/export.csv', {
      params: toQueryParams(query),
      responseType: 'blob',
    })

    const blob =
      response.data instanceof Blob
        ? response.data
        : new Blob([response.data], { type: 'text/csv;charset=utf-8' })
    const url = window.URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `admin-audit-logs-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.csv`
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    window.URL.revokeObjectURL(url)
  },
}
