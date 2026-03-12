import { apiClient } from '@/lib/api/client'
import type { AdminActorSummary, AdminPagination } from '../types/adminUsers'
import type {
  AdminModerationTemplateHistoryEntry,
  AdminModerationTemplateItem,
  AdminModerationTemplatesListQuery,
  AdminModerationTemplatesListResponse,
} from '../types/adminModerationTemplates'

interface BackendActorSummary {
  id?: string
  _id?: string
  name?: string
  username?: string
  email?: string
  role?: string
}

interface BackendModerationTemplateSnapshot {
  label?: string
  reason?: string
  defaultNote?: string | null
  tags?: string[]
  active?: boolean
  requiresNote?: boolean
  requiresDoubleConfirm?: boolean
}

interface BackendModerationTemplateHistoryEntry {
  version?: number
  changeType?: string
  changedAt?: string | null
  changedBy?: BackendActorSummary | null
  changeReason?: string | null
  snapshot?: BackendModerationTemplateSnapshot | null
}

interface BackendModerationTemplateItem {
  id?: string
  _id?: string
  code?: string
  label?: string
  reason?: string
  defaultNote?: string | null
  tags?: string[]
  active?: boolean
  requiresNote?: boolean
  requiresDoubleConfirm?: boolean
  version?: number
  createdBy?: BackendActorSummary | null
  updatedBy?: BackendActorSummary | null
  historyCount?: number
  lastHistoryEntry?: BackendModerationTemplateHistoryEntry | null
  createdAt?: string | null
  updatedAt?: string | null
}

interface BackendModerationTemplatesListResponse {
  items?: BackendModerationTemplateItem[]
  pagination?: Partial<AdminPagination>
}

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 25

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

const toNonNegativeInt = (value: unknown, fallback: number): number => {
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

const mapHistoryEntry = (
  entry: BackendModerationTemplateHistoryEntry,
): AdminModerationTemplateHistoryEntry => ({
  version: toPositiveInt(entry.version, 1),
  changeType:
    entry.changeType === 'created' ||
    entry.changeType === 'updated' ||
    entry.changeType === 'status_change'
      ? entry.changeType
      : 'updated',
  changedAt: toIsoDateOrNull(entry.changedAt),
  changedBy: mapActor(entry.changedBy),
  changeReason: toNullableString(entry.changeReason),
  snapshot:
    entry.snapshot && typeof entry.snapshot === 'object'
      ? {
          label: toString(entry.snapshot.label),
          reason: toString(entry.snapshot.reason),
          defaultNote: toNullableString(entry.snapshot.defaultNote),
          tags: Array.isArray(entry.snapshot.tags)
            ? entry.snapshot.tags.filter((item): item is string => typeof item === 'string')
            : [],
          active: entry.snapshot.active === true,
          requiresNote: entry.snapshot.requiresNote === true,
          requiresDoubleConfirm: entry.snapshot.requiresDoubleConfirm === true,
        }
      : null,
})

const mapItem = (row: BackendModerationTemplateItem): AdminModerationTemplateItem | null => {
  const id = toOptionalString(row.id) ?? toOptionalString(row._id)
  if (!id) return null

  return {
    id,
    code: toString(row.code),
    label: toString(row.label),
    reason: toString(row.reason),
    defaultNote: toNullableString(row.defaultNote),
    tags: Array.isArray(row.tags) ? row.tags.filter((item): item is string => typeof item === 'string') : [],
    active: row.active === true,
    requiresNote: row.requiresNote === true,
    requiresDoubleConfirm: row.requiresDoubleConfirm === true,
    version: toPositiveInt(row.version, 1),
    createdBy: mapActor(row.createdBy),
    updatedBy: mapActor(row.updatedBy),
    historyCount: toNonNegativeInt(row.historyCount, 0),
    lastHistoryEntry:
      row.lastHistoryEntry && typeof row.lastHistoryEntry === 'object'
        ? mapHistoryEntry(row.lastHistoryEntry)
        : null,
    createdAt: toIsoDateOrNull(row.createdAt),
    updatedAt: toIsoDateOrNull(row.updatedAt),
  }
}

const mapPagination = (pagination?: Partial<AdminPagination>): AdminPagination => ({
  page: toPositiveInt(pagination?.page, DEFAULT_PAGE),
  limit: toPositiveInt(pagination?.limit, DEFAULT_LIMIT),
  total: toNonNegativeInt(pagination?.total, 0),
  pages: toPositiveInt(pagination?.pages, 1),
})

const toListQueryParams = (query: AdminModerationTemplatesListQuery) => {
  const params: Record<string, string | number> = {}
  if (typeof query.active === 'boolean') params.active = query.active ? 'true' : 'false'
  if (query.tag?.trim()) params.tag = query.tag.trim()
  if (query.search?.trim()) params.search = query.search.trim()
  if (typeof query.page === 'number' && query.page > 0) params.page = query.page
  if (typeof query.limit === 'number' && query.limit > 0) params.limit = query.limit
  return params
}

export const adminModerationTemplatesService = {
  list: async (
    query: AdminModerationTemplatesListQuery,
  ): Promise<AdminModerationTemplatesListResponse> => {
    const response = await apiClient.get<BackendModerationTemplatesListResponse>(
      '/admin/content/moderation-templates',
      {
        params: toListQueryParams(query),
      },
    )

    return {
      items: (response.data.items ?? [])
        .map(mapItem)
        .filter((item): item is AdminModerationTemplateItem => item !== null),
      pagination: mapPagination(response.data.pagination),
    }
  },

  getById: async (templateId: string): Promise<AdminModerationTemplateItem> => {
    const response = await apiClient.get<BackendModerationTemplateItem>(
      `/admin/content/moderation-templates/${encodeURIComponent(templateId)}`,
    )

    const item = mapItem(response.data)
    if (!item) {
      throw new Error('Resposta admin invalida: template em falta.')
    }
    return item
  },
}
