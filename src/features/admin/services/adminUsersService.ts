import { apiClient } from '@/lib/api/client'
import type {
  AdminActorSummary,
  AdminAddNotePayload,
  AdminAddNoteResponse,
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
  action?: 'status_change' | 'force_logout' | 'internal_note'
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
    statusChangedAt: item.statusChangedAt ?? null,
    statusChangedBy: mapActor(item.statusChangedBy),
    tokenVersion: typeof item.tokenVersion === 'number' ? item.tokenVersion : 0,
    lastForcedLogoutAt: item.lastForcedLogoutAt ?? null,
    lastLoginAt: item.lastLoginAt ?? null,
    lastActiveAt: item.lastActiveAt ?? null,
    createdAt: item.createdAt ?? '',
    updatedAt: item.updatedAt ?? '',
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
}
