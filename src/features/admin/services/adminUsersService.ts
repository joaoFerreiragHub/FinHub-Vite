import { apiClient } from '@/lib/api/client'
import type {
  AdminActorSummary,
  AdminAddNotePayload,
  AdminAddNoteResponse,
  AdminCreatorControlPayload,
  AdminCreatorControlResponse,
  AdminCreatorControls,
  AdminCreatorTrustProfileResponse,
  AdminCreatorTrustSignals,
  AdminModerationEvent,
  AdminModerationHistoryResponse,
  AdminPagination,
  AdminUserActionPayload,
  AdminUserActionResponse,
  AdminUserAccountStatus,
  AdminUserListQuery,
  AdminUserRecord,
  AdminUsersListResponse,
} from '../types/adminUsers'

interface BackendAdminActorSummary {
  id?: string
  _id?: string
  name?: string
  username?: string
  email?: string
  role?: string
}

interface BackendAdminUserRecord {
  id?: string
  _id?: string
  email?: string
  name?: string
  username?: string
  avatar?: string
  role?: string
  accountStatus?: string
  adminReadOnly?: boolean
  adminScopes?: string[]
  statusReason?: string | null
  statusChangedAt?: string | null
  statusChangedBy?: BackendAdminActorSummary | null
  creatorControls?: {
    creationBlocked?: boolean
    creationBlockedReason?: string | null
    publishingBlocked?: boolean
    publishingBlockedReason?: string | null
    cooldownUntil?: string | null
    updatedAt?: string | null
    updatedBy?: BackendAdminActorSummary | null
  } | null
  trustSignals?: {
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
  tokenVersion?: number
  lastForcedLogoutAt?: string | null
  lastLoginAt?: string | null
  lastActiveAt?: string | null
  createdAt?: string
  updatedAt?: string
}

interface BackendAdminUsersListResponse {
  items?: BackendAdminUserRecord[]
  pagination?: Partial<AdminPagination>
}

interface BackendAdminModerationEvent {
  id?: string
  _id?: string
  user?: string
  actor?: BackendAdminActorSummary | null
  action?: 'status_change' | 'force_logout' | 'internal_note' | 'creator_control'
  fromStatus?: string | null
  toStatus?: string | null
  reason?: string
  note?: string | null
  metadata?: Record<string, unknown> | null
  createdAt?: string
}

interface BackendAdminModerationHistoryResponse {
  items?: BackendAdminModerationEvent[]
  pagination?: Partial<AdminPagination>
}

interface BackendAdminActionResponse {
  message?: string
  changed?: boolean
  fromStatus?: AdminUserAccountStatus
  user?: BackendAdminUserRecord
}

interface BackendAdminCreatorControlResponse {
  message?: string
  action?: string
  creatorControls?: BackendAdminUserRecord['creatorControls']
  user?: BackendAdminUserRecord
}

interface BackendAdminCreatorTrustProfileResponse {
  user?: BackendAdminUserRecord
  trustSignals?: BackendAdminUserRecord['trustSignals']
}

interface BackendAdminAddNoteResponse {
  message?: string
  event?: BackendAdminModerationEvent
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

const toStatus = (value: string | undefined): AdminUserAccountStatus => {
  if (value === 'suspended') return 'suspended'
  if (value === 'banned') return 'banned'
  return 'active'
}

const toIsoDate = (value: unknown): string | null => {
  if (typeof value !== 'string' || value.trim().length === 0) return null
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString()
}

const toRiskLevel = (value: unknown): AdminCreatorTrustSignals['riskLevel'] => {
  if (value === 'critical') return 'critical'
  if (value === 'high') return 'high'
  if (value === 'medium') return 'medium'
  return 'low'
}

const toRecommendedAction = (value: unknown): AdminCreatorTrustSignals['recommendedAction'] => {
  if (value === 'review') return 'review'
  if (value === 'set_cooldown') return 'set_cooldown'
  if (value === 'block_publishing') return 'block_publishing'
  if (value === 'suspend_creator_ops') return 'suspend_creator_ops'
  return 'none'
}

const toCreatorControlAction = (value: unknown): AdminCreatorControlResponse['action'] => {
  if (value === 'set_cooldown') return 'set_cooldown'
  if (value === 'clear_cooldown') return 'clear_cooldown'
  if (value === 'block_creation') return 'block_creation'
  if (value === 'unblock_creation') return 'unblock_creation'
  if (value === 'block_publishing') return 'block_publishing'
  if (value === 'unblock_publishing') return 'unblock_publishing'
  if (value === 'suspend_creator_ops') return 'suspend_creator_ops'
  return 'restore_creator_ops'
}

const mapActor = (actor?: BackendAdminActorSummary | null): AdminActorSummary | null => {
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

const mapCreatorControls = (
  controls?: BackendAdminUserRecord['creatorControls'] | null,
): AdminCreatorControls => ({
  creationBlocked: Boolean(controls?.creationBlocked),
  creationBlockedReason: controls?.creationBlockedReason ?? null,
  publishingBlocked: Boolean(controls?.publishingBlocked),
  publishingBlockedReason: controls?.publishingBlockedReason ?? null,
  cooldownUntil: toIsoDate(controls?.cooldownUntil) ?? null,
  updatedAt: toIsoDate(controls?.updatedAt) ?? null,
  updatedBy: mapActor(controls?.updatedBy),
})

const mapTrustSignals = (
  signals?: BackendAdminUserRecord['trustSignals'] | null,
): AdminCreatorTrustSignals | null => {
  if (!signals || typeof signals !== 'object') return null

  return {
    trustScore: typeof signals.trustScore === 'number' ? signals.trustScore : 100,
    riskLevel: toRiskLevel(signals.riskLevel),
    recommendedAction: toRecommendedAction(signals.recommendedAction),
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

const mapAdminUser = (item: BackendAdminUserRecord): AdminUserRecord | null => {
  const id = resolveId(item)
  if (!id) return null

  return {
    id,
    email: item.email ?? '',
    name: item.name ?? 'Utilizador',
    username: item.username ?? id,
    avatar: item.avatar,
    role:
      item.role === 'visitor' ||
      item.role === 'free' ||
      item.role === 'premium' ||
      item.role === 'creator' ||
      item.role === 'admin'
        ? item.role
        : 'free',
    accountStatus: toStatus(item.accountStatus),
    adminReadOnly: Boolean(item.adminReadOnly),
    adminScopes: Array.isArray(item.adminScopes)
      ? item.adminScopes.filter((scope): scope is string => typeof scope === 'string')
      : [],
    statusReason: item.statusReason ?? null,
    statusChangedAt: toIsoDate(item.statusChangedAt) ?? null,
    statusChangedBy: mapActor(item.statusChangedBy),
    creatorControls: mapCreatorControls(item.creatorControls),
    trustSignals: mapTrustSignals(item.trustSignals),
    tokenVersion: typeof item.tokenVersion === 'number' ? item.tokenVersion : 0,
    lastForcedLogoutAt: toIsoDate(item.lastForcedLogoutAt) ?? null,
    lastLoginAt: toIsoDate(item.lastLoginAt) ?? null,
    lastActiveAt: toIsoDate(item.lastActiveAt) ?? null,
    createdAt: toIsoDate(item.createdAt) ?? new Date(0).toISOString(),
    updatedAt: toIsoDate(item.updatedAt) ?? new Date(0).toISOString(),
  }
}

const mapModerationEvent = (item: BackendAdminModerationEvent): AdminModerationEvent | null => {
  const id = resolveId(item)
  if (!id || !item.user || !item.action || !item.reason || !item.createdAt) {
    return null
  }

  return {
    id,
    user: item.user,
    actor: mapActor(item.actor),
    action: item.action,
    fromStatus: item.fromStatus ? toStatus(item.fromStatus) : null,
    toStatus: item.toStatus ? toStatus(item.toStatus) : null,
    reason: item.reason,
    note: item.note ?? null,
    metadata: item.metadata ?? null,
    createdAt: item.createdAt,
  }
}

const buildListQueryParams = (
  query: AdminUserListQuery,
): Record<string, string | number | boolean> => {
  const params: Record<string, string | number | boolean> = {}

  if (query.search && query.search.trim().length > 0) params.search = query.search.trim()
  if (query.role) params.role = query.role
  if (query.accountStatus) params.accountStatus = query.accountStatus
  if (typeof query.adminReadOnly === 'boolean') params.adminReadOnly = query.adminReadOnly
  if (typeof query.activeSinceDays === 'number' && query.activeSinceDays > 0) {
    params.activeSinceDays = query.activeSinceDays
  }
  if (typeof query.page === 'number' && query.page > 0) params.page = query.page
  if (typeof query.limit === 'number' && query.limit > 0) params.limit = query.limit
  if (query.sortBy) params.sortBy = query.sortBy
  if (query.sortOrder) params.sortOrder = query.sortOrder

  return params
}

const mapActionResponse = (data: BackendAdminActionResponse): AdminUserActionResponse => {
  const mappedUser = data.user ? mapAdminUser(data.user) : null
  if (!mappedUser) {
    throw new Error('Resposta admin invalida: user em falta.')
  }

  return {
    message: data.message ?? 'Acao executada com sucesso.',
    changed: data.changed,
    fromStatus: data.fromStatus,
    user: mappedUser,
  }
}

const mapCreatorControlResponse = (
  data: BackendAdminCreatorControlResponse,
): AdminCreatorControlResponse => {
  const mappedUser = data.user ? mapAdminUser(data.user) : null
  if (!mappedUser) {
    throw new Error('Resposta admin invalida: user em falta.')
  }

  return {
    message: data.message ?? 'Controlos operacionais atualizados com sucesso.',
    action: toCreatorControlAction(data.action),
    creatorControls: mapCreatorControls(data.creatorControls),
    user: mappedUser,
  }
}

const postUserAction = async (
  userId: string,
  actionPath: 'suspend' | 'ban' | 'unban' | 'force-logout',
  payload: AdminUserActionPayload,
): Promise<AdminUserActionResponse> => {
  const response = await apiClient.post<BackendAdminActionResponse>(
    `/admin/users/${userId}/${actionPath}`,
    payload,
  )
  return mapActionResponse(response.data)
}

export const adminUsersService = {
  listUsers: async (query: AdminUserListQuery = {}): Promise<AdminUsersListResponse> => {
    const response = await apiClient.get<BackendAdminUsersListResponse>('/admin/users', {
      params: buildListQueryParams(query),
    })

    const items = (response.data.items ?? [])
      .map(mapAdminUser)
      .filter((item): item is AdminUserRecord => item !== null)

    return {
      items,
      pagination: normalizePagination(response.data.pagination),
    }
  },

  getUserModerationHistory: async (
    userId: string,
    page = 1,
    limit = 10,
  ): Promise<AdminModerationHistoryResponse> => {
    const response = await apiClient.get<BackendAdminModerationHistoryResponse>(
      `/admin/users/${userId}/history`,
      {
        params: { page, limit },
      },
    )

    const items = (response.data.items ?? [])
      .map(mapModerationEvent)
      .filter((item): item is AdminModerationEvent => item !== null)

    return {
      items,
      pagination: normalizePagination(response.data.pagination),
    }
  },

  addUserInternalNote: async (
    userId: string,
    payload: AdminAddNotePayload,
  ): Promise<AdminAddNoteResponse> => {
    const response = await apiClient.post<BackendAdminAddNoteResponse>(
      `/admin/users/${userId}/notes`,
      {
        reason: payload.reason,
        note: payload.note,
      },
    )

    const mappedEvent = response.data.event ? mapModerationEvent(response.data.event) : null
    if (!mappedEvent) {
      throw new Error('Resposta admin invalida: evento de nota em falta.')
    }

    return {
      message: response.data.message ?? 'Nota interna registada.',
      event: mappedEvent,
    }
  },

  suspendUser: async (
    userId: string,
    payload: AdminUserActionPayload,
  ): Promise<AdminUserActionResponse> => postUserAction(userId, 'suspend', payload),

  banUser: async (
    userId: string,
    payload: AdminUserActionPayload,
  ): Promise<AdminUserActionResponse> => postUserAction(userId, 'ban', payload),

  unbanUser: async (
    userId: string,
    payload: AdminUserActionPayload,
  ): Promise<AdminUserActionResponse> => postUserAction(userId, 'unban', payload),

  forceLogoutUser: async (
    userId: string,
    payload: AdminUserActionPayload,
  ): Promise<AdminUserActionResponse> => postUserAction(userId, 'force-logout', payload),

  applyCreatorControls: async (
    userId: string,
    payload: AdminCreatorControlPayload,
  ): Promise<AdminCreatorControlResponse> => {
    const response = await apiClient.post<BackendAdminCreatorControlResponse>(
      `/admin/users/${userId}/creator-controls`,
      payload,
    )

    return mapCreatorControlResponse(response.data)
  },

  getCreatorTrustProfile: async (userId: string): Promise<AdminCreatorTrustProfileResponse> => {
    const response = await apiClient.get<BackendAdminCreatorTrustProfileResponse>(
      `/admin/users/${userId}/trust-profile`,
    )

    const mappedUser = response.data.user ? mapAdminUser(response.data.user) : null
    if (!mappedUser) {
      throw new Error('Resposta admin invalida: user em falta.')
    }

    return {
      user: mappedUser,
      trustSignals: mapTrustSignals(response.data.trustSignals),
    }
  },
}
