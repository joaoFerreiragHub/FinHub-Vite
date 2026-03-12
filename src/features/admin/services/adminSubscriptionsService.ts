import { apiClient } from '@/lib/api/client'
import type { AdminActorSummary } from '../types/adminUsers'
import type {
  AdminExtendSubscriptionTrialPayload,
  AdminReactivateSubscriptionPayload,
  AdminRevokeSubscriptionEntitlementPayload,
  AdminSubscriptionBillingCycle,
  AdminSubscriptionHistoryEntry,
  AdminSubscriptionItem,
  AdminSubscriptionListQuery,
  AdminSubscriptionListSummary,
  AdminSubscriptionListResponse,
  AdminSubscriptionMutationResponse,
  AdminSubscriptionPagination,
  AdminSubscriptionStatus,
} from '../types/adminSubscriptions'

interface BackendActorSummary {
  id?: string
  _id?: string
  name?: string
  username?: string
  email?: string
  role?: string
}

interface BackendSubscriptionUserSummary {
  id?: string
  _id?: string
  name?: string
  username?: string
  email?: string
  role?: string
  accountStatus?: string
  subscriptionExpiry?: string | null
}

interface BackendSubscriptionHistoryEntry {
  version?: number
  action?: string
  reason?: string
  note?: string | null
  changedAt?: string | null
  changedBy?: BackendActorSummary | null
  snapshot?: Record<string, unknown> | null
}

interface BackendSubscriptionItem {
  id?: string
  _id?: string
  user?: BackendSubscriptionUserSummary | null
  planCode?: string
  planLabel?: string
  billingCycle?: string
  status?: string
  derivedStatus?: string
  entitlementActive?: boolean
  currentPeriodStart?: string | null
  currentPeriodEnd?: string | null
  trialEndsAt?: string | null
  canceledAt?: string | null
  cancelAtPeriodEnd?: boolean
  source?: string
  externalSubscriptionId?: string | null
  metadata?: Record<string, unknown> | null
  version?: number
  createdBy?: BackendActorSummary | null
  updatedBy?: BackendActorSummary | null
  historyCount?: number
  lastHistoryEntry?: BackendSubscriptionHistoryEntry | null
  history?: BackendSubscriptionHistoryEntry[]
  createdAt?: string | null
  updatedAt?: string | null
}

interface BackendSubscriptionSummary {
  active?: number
  trialing?: number
  pastDue?: number
  canceled?: number
  entitlementActive?: number
  total?: number
}

interface BackendSubscriptionListResponse {
  items?: BackendSubscriptionItem[]
  pagination?: Partial<AdminSubscriptionPagination>
  summary?: BackendSubscriptionSummary
}

interface BackendSubscriptionMutationResponse {
  message?: string
  item?: BackendSubscriptionItem
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

const toStatus = (value: unknown): AdminSubscriptionStatus => {
  if (value === 'trialing') return 'trialing'
  if (value === 'past_due') return 'past_due'
  if (value === 'canceled') return 'canceled'
  return 'active'
}

const toBillingCycle = (value: unknown): AdminSubscriptionBillingCycle => {
  if (value === 'annual') return 'annual'
  if (value === 'lifetime') return 'lifetime'
  if (value === 'custom') return 'custom'
  return 'monthly'
}

const toSource = (
  value: unknown,
): 'manual_admin' | 'internal' | 'stripe' | 'import' => {
  if (value === 'manual_admin') return 'manual_admin'
  if (value === 'stripe') return 'stripe'
  if (value === 'import') return 'import'
  return 'internal'
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
  entry: BackendSubscriptionHistoryEntry,
): AdminSubscriptionHistoryEntry => ({
  version: toPositiveInt(entry.version, 1),
  action: toString(entry.action, 'updated'),
  reason: toString(entry.reason),
  note: toNullableString(entry.note),
  changedAt: toIsoDateOrNull(entry.changedAt),
  changedBy: mapActor(entry.changedBy),
  snapshot: entry.snapshot && typeof entry.snapshot === 'object' ? entry.snapshot : null,
})

const mapItem = (row: BackendSubscriptionItem): AdminSubscriptionItem | null => {
  const id = toOptionalString(row.id) ?? toOptionalString(row._id)
  if (!id) return null

  const historyEntries = Array.isArray(row.history) ? row.history.map(mapHistoryEntry) : undefined

  return {
    id,
    user: row.user
      ? {
          id: toOptionalString(row.user.id) ?? toOptionalString(row.user._id) ?? '',
          name: toOptionalString(row.user.name),
          username: toOptionalString(row.user.username),
          email: toOptionalString(row.user.email),
          role:
            row.user.role === 'free' || row.user.role === 'premium' ? row.user.role : undefined,
          accountStatus: toOptionalString(row.user.accountStatus),
          subscriptionExpiry: toIsoDateOrNull(row.user.subscriptionExpiry),
        }
      : null,
    planCode: toString(row.planCode, 'premium_monthly'),
    planLabel: toString(row.planLabel, 'Premium Monthly'),
    billingCycle: toBillingCycle(row.billingCycle),
    status: toStatus(row.status),
    derivedStatus: toStatus(row.derivedStatus ?? row.status),
    entitlementActive: row.entitlementActive === true,
    currentPeriodStart: toIsoDateOrNull(row.currentPeriodStart),
    currentPeriodEnd: toIsoDateOrNull(row.currentPeriodEnd),
    trialEndsAt: toIsoDateOrNull(row.trialEndsAt),
    canceledAt: toIsoDateOrNull(row.canceledAt),
    cancelAtPeriodEnd: row.cancelAtPeriodEnd === true,
    source: toSource(row.source),
    externalSubscriptionId: toNullableString(row.externalSubscriptionId),
    metadata: row.metadata && typeof row.metadata === 'object' ? row.metadata : null,
    version: toPositiveInt(row.version, 1),
    createdBy: mapActor(row.createdBy),
    updatedBy: mapActor(row.updatedBy),
    historyCount: toNonNegativeInt(row.historyCount, 0),
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
  pagination?: Partial<AdminSubscriptionPagination>,
): AdminSubscriptionPagination => ({
  page: toPositiveInt(pagination?.page, DEFAULT_PAGE),
  limit: toPositiveInt(pagination?.limit, DEFAULT_LIMIT),
  total: toNonNegativeInt(pagination?.total, 0),
  pages: toPositiveInt(pagination?.pages, 1),
})

const mapSummary = (summary?: BackendSubscriptionSummary): AdminSubscriptionListSummary => ({
  active: toNonNegativeInt(summary?.active, 0),
  trialing: toNonNegativeInt(summary?.trialing, 0),
  pastDue: toNonNegativeInt(summary?.pastDue, 0),
  canceled: toNonNegativeInt(summary?.canceled, 0),
  entitlementActive: toNonNegativeInt(summary?.entitlementActive, 0),
  total: toNonNegativeInt(summary?.total, 0),
})

const toListQueryParams = (query: AdminSubscriptionListQuery) => {
  const params: Record<string, string | number> = {}
  if (query.status) params.status = query.status
  if (query.planCode?.trim()) params.planCode = query.planCode.trim()
  if (query.periodFrom?.trim()) params.periodFrom = query.periodFrom.trim()
  if (query.periodTo?.trim()) params.periodTo = query.periodTo.trim()
  if (query.search?.trim()) params.search = query.search.trim()
  if (typeof query.page === 'number' && query.page > 0) params.page = query.page
  if (typeof query.limit === 'number' && query.limit > 0) params.limit = query.limit
  return params
}

export const adminSubscriptionsService = {
  list: async (query: AdminSubscriptionListQuery): Promise<AdminSubscriptionListResponse> => {
    const response = await apiClient.get<BackendSubscriptionListResponse>(
      '/admin/monetization/subscriptions',
      {
        params: toListQueryParams(query),
      },
    )

    return {
      items: (response.data.items ?? [])
        .map(mapItem)
        .filter((item): item is AdminSubscriptionItem => item !== null),
      pagination: mapPagination(response.data.pagination),
      summary: mapSummary(response.data.summary),
    }
  },

  getByUser: async (userId: string): Promise<AdminSubscriptionItem> => {
    const response = await apiClient.get<BackendSubscriptionItem>(
      `/admin/monetization/subscriptions/users/${encodeURIComponent(userId)}`,
    )
    const item = mapItem(response.data)
    if (!item) throw new Error('Resposta admin invalida: subscricao em falta.')
    return item
  },

  extendTrial: async (
    userId: string,
    payload: AdminExtendSubscriptionTrialPayload,
  ): Promise<AdminSubscriptionMutationResponse> => {
    const response = await apiClient.post<BackendSubscriptionMutationResponse>(
      `/admin/monetization/subscriptions/users/${encodeURIComponent(userId)}/extend-trial`,
      payload,
    )
    const item = mapItem(response.data.item ?? {})
    if (!item) throw new Error('Resposta admin invalida: subscricao em falta.')
    return {
      message: toString(response.data.message, 'Trial estendido com sucesso.'),
      item,
    }
  },

  revokeEntitlement: async (
    userId: string,
    payload: AdminRevokeSubscriptionEntitlementPayload,
  ): Promise<AdminSubscriptionMutationResponse> => {
    const response = await apiClient.post<BackendSubscriptionMutationResponse>(
      `/admin/monetization/subscriptions/users/${encodeURIComponent(userId)}/revoke-entitlement`,
      payload,
    )
    const item = mapItem(response.data.item ?? {})
    if (!item) throw new Error('Resposta admin invalida: subscricao em falta.')
    return {
      message: toString(response.data.message, 'Entitlement revogado com sucesso.'),
      item,
    }
  },

  reactivate: async (
    userId: string,
    payload: AdminReactivateSubscriptionPayload,
  ): Promise<AdminSubscriptionMutationResponse> => {
    const response = await apiClient.post<BackendSubscriptionMutationResponse>(
      `/admin/monetization/subscriptions/users/${encodeURIComponent(userId)}/reactivate`,
      payload,
    )
    const item = mapItem(response.data.item ?? {})
    if (!item) throw new Error('Resposta admin invalida: subscricao em falta.')
    return {
      message: toString(response.data.message, 'Subscricao reativada com sucesso.'),
      item,
    }
  },
}
