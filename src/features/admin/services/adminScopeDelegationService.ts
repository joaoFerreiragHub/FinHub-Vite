import { apiClient } from '@/lib/api/client'
import type { AdminActorSummary } from '../types/adminUsers'
import type {
  AdminScopeDelegationCreatePayload,
  AdminScopeDelegationCreateResponse,
  AdminScopeDelegationItem,
  AdminScopeDelegationListQuery,
  AdminScopeDelegationListResponse,
  AdminScopeDelegationPagination,
  AdminScopeDelegationRevokePayload,
  AdminScopeDelegationRevokeResponse,
  AdminScopeDelegationStatus,
} from '../types/adminScopeDelegation'

interface BackendActorSummary {
  id?: unknown
  _id?: unknown
  name?: unknown
  username?: unknown
  email?: unknown
  role?: unknown
}

interface BackendDelegationItem {
  id?: unknown
  _id?: unknown
  scope?: unknown
  status?: unknown
  reason?: unknown
  note?: unknown
  delegatedBy?: BackendActorSummary | null
  delegatedTo?: BackendActorSummary | null
  startsAt?: unknown
  expiresAt?: unknown
  revokedAt?: unknown
  revokedBy?: BackendActorSummary | null
  revokeReason?: unknown
  revokeNote?: unknown
  createdAt?: unknown
  updatedAt?: unknown
}

interface BackendPagination {
  page?: unknown
  limit?: unknown
  total?: unknown
  pages?: unknown
}

interface BackendDelegationListResponse {
  items?: BackendDelegationItem[]
  pagination?: BackendPagination
}

interface BackendDelegationCreateResponse {
  message?: unknown
  items?: BackendDelegationItem[]
  summary?: {
    scopesRequested?: unknown
    delegationsAffected?: unknown
    maxDelegationHours?: unknown
  }
}

interface BackendDelegationRevokeResponse {
  message?: unknown
  changed?: unknown
  item?: BackendDelegationItem
}

const VALID_STATUS_SET = new Set<AdminScopeDelegationStatus>(['active', 'expired', 'revoked'])

const toString = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback

const toOptionalString = (value: unknown): string | undefined =>
  typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined

const toNullableString = (value: unknown): string | null =>
  typeof value === 'string' && value.trim().length > 0 ? value.trim() : null

const toInteger = (value: unknown, fallback: number): number => {
  const parsed =
    typeof value === 'number'
      ? value
      : typeof value === 'string'
        ? Number.parseInt(value, 10)
        : Number.NaN
  if (!Number.isFinite(parsed)) return fallback
  return Math.trunc(parsed)
}

const toIsoDateOrNull = (value: unknown): string | null => {
  if (typeof value !== 'string' || value.trim().length === 0) return null
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return null
  return parsed.toISOString()
}

const mapStatus = (value: unknown): AdminScopeDelegationStatus =>
  typeof value === 'string' && VALID_STATUS_SET.has(value as AdminScopeDelegationStatus)
    ? (value as AdminScopeDelegationStatus)
    : 'active'

const mapActor = (raw?: BackendActorSummary | null): AdminActorSummary | null => {
  if (!raw || typeof raw !== 'object') return null

  const id = toOptionalString(raw.id) ?? toOptionalString(raw._id)
  if (!id) return null

  return {
    id,
    name: toOptionalString(raw.name),
    username: toOptionalString(raw.username),
    email: toOptionalString(raw.email),
    role:
      raw.role === 'visitor' ||
      raw.role === 'free' ||
      raw.role === 'premium' ||
      raw.role === 'creator' ||
      raw.role === 'admin'
        ? raw.role
        : undefined,
  }
}

const mapDelegationItem = (raw: BackendDelegationItem): AdminScopeDelegationItem | null => {
  const id = toOptionalString(raw.id) ?? toOptionalString(raw._id)
  if (!id) return null

  return {
    id,
    scope: toString(raw.scope),
    status: mapStatus(raw.status),
    reason: toString(raw.reason),
    note: toNullableString(raw.note),
    delegatedBy: mapActor(raw.delegatedBy),
    delegatedTo: mapActor(raw.delegatedTo),
    startsAt: toIsoDateOrNull(raw.startsAt),
    expiresAt: toIsoDateOrNull(raw.expiresAt),
    revokedAt: toIsoDateOrNull(raw.revokedAt),
    revokedBy: mapActor(raw.revokedBy),
    revokeReason: toNullableString(raw.revokeReason),
    revokeNote: toNullableString(raw.revokeNote),
    createdAt: toIsoDateOrNull(raw.createdAt),
    updatedAt: toIsoDateOrNull(raw.updatedAt),
  }
}

const mapPagination = (raw?: BackendPagination): AdminScopeDelegationPagination => ({
  page: Math.max(1, toInteger(raw?.page, 1)),
  limit: Math.max(1, toInteger(raw?.limit, 20)),
  total: Math.max(0, toInteger(raw?.total, 0)),
  pages: Math.max(1, toInteger(raw?.pages, 1)),
})

const toListParams = (
  query: AdminScopeDelegationListQuery,
): Record<string, string | number> => {
  const params: Record<string, string | number> = {}
  if (query.scope?.trim()) params.scope = query.scope.trim()
  if (query.status) params.status = query.status
  if (typeof query.page === 'number' && query.page > 0) params.page = Math.trunc(query.page)
  if (typeof query.limit === 'number' && query.limit > 0) params.limit = Math.trunc(query.limit)
  return params
}

const toCreatePayload = (payload: AdminScopeDelegationCreatePayload): Record<string, unknown> => ({
  scopes: payload.scopes,
  expiresAt: payload.expiresAt,
  reason: payload.reason.trim(),
  ...(payload.note?.trim() ? { note: payload.note.trim() } : {}),
})

const toRevokePayload = (payload: AdminScopeDelegationRevokePayload): Record<string, unknown> => ({
  reason: payload.reason.trim(),
  ...(payload.note?.trim() ? { note: payload.note.trim() } : {}),
})

export const adminScopeDelegationService = {
  list: async (
    userId: string,
    query: AdminScopeDelegationListQuery = {},
  ): Promise<AdminScopeDelegationListResponse> => {
    const response = await apiClient.get<BackendDelegationListResponse>(
      `/admin/users/${encodeURIComponent(userId)}/scope-delegations`,
      {
        params: toListParams(query),
      },
    )

    return {
      items: Array.isArray(response.data.items)
        ? response.data.items
            .map(mapDelegationItem)
            .filter((item): item is AdminScopeDelegationItem => item !== null)
        : [],
      pagination: mapPagination(response.data.pagination),
    }
  },

  create: async (
    userId: string,
    payload: AdminScopeDelegationCreatePayload,
  ): Promise<AdminScopeDelegationCreateResponse> => {
    const response = await apiClient.post<BackendDelegationCreateResponse>(
      `/admin/users/${encodeURIComponent(userId)}/scope-delegations`,
      toCreatePayload(payload),
    )

    return {
      message: toString(response.data.message, 'Delegacoes temporarias atualizadas com sucesso.'),
      items: Array.isArray(response.data.items)
        ? response.data.items
            .map(mapDelegationItem)
            .filter((item): item is AdminScopeDelegationItem => item !== null)
        : [],
      summary: {
        scopesRequested: Math.max(0, toInteger(response.data.summary?.scopesRequested, 0)),
        delegationsAffected: Math.max(0, toInteger(response.data.summary?.delegationsAffected, 0)),
        maxDelegationHours: Math.max(1, toInteger(response.data.summary?.maxDelegationHours, 24)),
      },
    }
  },

  revoke: async (
    userId: string,
    delegationId: string,
    payload: AdminScopeDelegationRevokePayload,
  ): Promise<AdminScopeDelegationRevokeResponse> => {
    const response = await apiClient.post<BackendDelegationRevokeResponse>(
      `/admin/users/${encodeURIComponent(userId)}/scope-delegations/${encodeURIComponent(delegationId)}/revoke`,
      toRevokePayload(payload),
    )

    const item = response.data.item ? mapDelegationItem(response.data.item) : null
    if (!item) {
      throw new Error('Resposta admin invalida: delegacao em falta.')
    }

    return {
      message: toString(response.data.message, 'Delegacao revogada com sucesso.'),
      changed: response.data.changed === true,
      item,
    }
  },
}
