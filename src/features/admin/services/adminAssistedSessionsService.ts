import { AuthTokens, User, UserRole } from '@/features/auth/types'
import { apiClient } from '@/lib/api/client'
import type {
  AssistedSessionAuditEvent,
  AssistedSessionAuditResponse,
  AssistedSessionListResponse,
  AssistedSessionPagination,
  AssistedSessionRecord,
  AssistedSessionStatus,
  AssistedSessionUserSummary,
  RequestAssistedSessionPayload,
  RequestAssistedSessionResponse,
  RevokeAssistedSessionPayload,
  RevokeAssistedSessionResponse,
  StartAssistedSessionResponse,
} from '../types/assistedSessions'

interface BackendPagination {
  page?: number
  limit?: number
  total?: number
  pages?: number
}

interface BackendSessionUserSummary {
  id?: string
  _id?: string
  name?: string
  username?: string
  email?: string
  role?: string
}

interface BackendSessionRecord {
  id?: string
  _id?: string
  adminUser?: BackendSessionUserSummary | null
  targetUser?: BackendSessionUserSummary | null
  scope?: string
  status?: string
  reason?: string
  note?: string | null
  consentExpiresAt?: string
  requestedSessionTtlMinutes?: number
  approvedAt?: string | null
  startedAt?: string | null
  sessionExpiresAt?: string | null
  declinedAt?: string | null
  declinedReason?: string | null
  revokedAt?: string | null
  revokedBy?: string | null
  revokedReason?: string | null
  createdAt?: string
  updatedAt?: string
}

interface BackendListResponse {
  items?: BackendSessionRecord[]
  pagination?: BackendPagination
}

interface BackendRequestResponse {
  message?: string
  session?: BackendSessionRecord
}

interface BackendStartResponse {
  message?: string
  session?: BackendSessionRecord
  actingUser?: Partial<User>
  tokens?: Partial<AuthTokens>
}

interface BackendRevokeResponse {
  message?: string
  changed?: boolean
  session?: BackendSessionRecord
}

interface BackendAuditEvent {
  id?: string
  _id?: string
  session?: string
  adminUser?: string
  targetUser?: string
  method?: string
  path?: string
  statusCode?: number
  outcome?: 'success' | 'forbidden' | 'error'
  requestId?: string | null
  ip?: string | null
  userAgent?: string | null
  metadata?: Record<string, unknown> | null
  createdAt?: string
}

interface BackendAuditResponse {
  items?: BackendAuditEvent[]
  pagination?: BackendPagination
}

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 20

const resolveId = (value: unknown): string | null => {
  if (typeof value === 'string' && value.length > 0) return value
  if (value && typeof value === 'object') {
    const record = value as { id?: unknown; _id?: unknown }
    if (typeof record.id === 'string' && record.id.length > 0) return record.id
    if (typeof record._id === 'string' && record._id.length > 0) return record._id
  }
  return null
}

const toUserRole = (value: unknown): UserRole => {
  if (
    value === UserRole.VISITOR ||
    value === UserRole.FREE ||
    value === UserRole.PREMIUM ||
    value === UserRole.CREATOR ||
    value === UserRole.ADMIN
  ) {
    return value
  }
  return UserRole.FREE
}

const toSessionStatus = (value: unknown): AssistedSessionStatus => {
  if (
    value === 'pending' ||
    value === 'approved' ||
    value === 'active' ||
    value === 'declined' ||
    value === 'revoked' ||
    value === 'expired'
  ) {
    return value
  }
  return 'pending'
}

const normalizePagination = (pagination?: BackendPagination): AssistedSessionPagination => ({
  page: pagination?.page && pagination.page > 0 ? pagination.page : DEFAULT_PAGE,
  limit: pagination?.limit && pagination.limit > 0 ? pagination.limit : DEFAULT_LIMIT,
  total: pagination?.total && pagination.total >= 0 ? pagination.total : 0,
  pages: pagination?.pages && pagination.pages > 0 ? pagination.pages : 1,
})

const mapSessionUserSummary = (
  item?: BackendSessionUserSummary | null,
): AssistedSessionUserSummary | null => {
  if (!item) return null
  const id = resolveId(item)
  if (!id) return null

  return {
    id,
    name: item.name ?? 'Utilizador',
    username: item.username ?? id,
    email: item.email ?? '',
    role: item.role ?? 'free',
  }
}

const mapSession = (item?: BackendSessionRecord): AssistedSessionRecord | null => {
  if (!item) return null
  const id = resolveId(item)
  if (!id) return null

  return {
    id,
    adminUser: mapSessionUserSummary(item.adminUser),
    targetUser: mapSessionUserSummary(item.targetUser),
    scope: item.scope === 'read_only' ? 'read_only' : 'read_only',
    status: toSessionStatus(item.status),
    reason: item.reason ?? '',
    note: item.note ?? null,
    consentExpiresAt: item.consentExpiresAt ?? '',
    requestedSessionTtlMinutes:
      typeof item.requestedSessionTtlMinutes === 'number' ? item.requestedSessionTtlMinutes : 15,
    approvedAt: item.approvedAt ?? null,
    startedAt: item.startedAt ?? null,
    sessionExpiresAt: item.sessionExpiresAt ?? null,
    declinedAt: item.declinedAt ?? null,
    declinedReason: item.declinedReason ?? null,
    revokedAt: item.revokedAt ?? null,
    revokedBy: item.revokedBy ?? null,
    revokedReason: item.revokedReason ?? null,
    createdAt: item.createdAt ?? '',
    updatedAt: item.updatedAt ?? '',
  }
}

const mapStartActingUser = (item?: Partial<User>): User => {
  const id = resolveId(item?.id)
  if (!id) {
    throw new Error('Resposta invalida: utilizador assistido em falta.')
  }

  return {
    id,
    name: item?.name ?? 'Utilizador',
    email: item?.email ?? '',
    username: item?.username ?? id,
    avatar: item?.avatar,
    role: toUserRole(item?.role),
    isEmailVerified: item?.isEmailVerified ?? true,
    favoriteTopics: Array.isArray(item?.favoriteTopics)
      ? item.favoriteTopics.filter((topic): topic is string => typeof topic === 'string')
      : [],
    createdAt: item?.createdAt ?? new Date().toISOString(),
    updatedAt: item?.updatedAt ?? new Date().toISOString(),
    accountStatus: item?.accountStatus,
    adminReadOnly: item?.adminReadOnly,
    adminScopes: Array.isArray(item?.adminScopes)
      ? item.adminScopes.filter((scope): scope is string => typeof scope === 'string')
      : [],
    assistedSession: item?.assistedSession,
  }
}

const mapTokens = (tokens?: Partial<AuthTokens>): AuthTokens => {
  if (!tokens?.accessToken || !tokens?.refreshToken) {
    throw new Error('Resposta invalida: tokens em falta.')
  }
  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  }
}

export const adminAssistedSessionsService = {
  listSessions: async (params?: {
    status?: AssistedSessionStatus
    targetUserId?: string
    page?: number
    limit?: number
  }): Promise<AssistedSessionListResponse> => {
    const response = await apiClient.get<BackendListResponse>('/admin/support/sessions', { params })
    const items = (response.data.items ?? [])
      .map(mapSession)
      .filter((item): item is AssistedSessionRecord => item !== null)

    return {
      items,
      pagination: normalizePagination(response.data.pagination),
    }
  },

  requestSession: async (
    payload: RequestAssistedSessionPayload,
  ): Promise<RequestAssistedSessionResponse> => {
    const response = await apiClient.post<BackendRequestResponse>(
      '/admin/support/sessions/request',
      payload,
    )
    const session = mapSession(response.data.session)
    if (!session) {
      throw new Error('Resposta invalida: sessao assistida em falta.')
    }

    return {
      message: response.data.message ?? 'Pedido criado com sucesso.',
      session,
    }
  },

  startSession: async (sessionId: string): Promise<StartAssistedSessionResponse> => {
    const response = await apiClient.post<BackendStartResponse>(
      `/admin/support/sessions/${sessionId}/start`,
    )
    const session = mapSession(response.data.session)
    if (!session) {
      throw new Error('Resposta invalida: sessao assistida em falta.')
    }

    return {
      message: response.data.message ?? 'Sessao assistida iniciada.',
      session,
      actingUser: mapStartActingUser(response.data.actingUser),
      tokens: mapTokens(response.data.tokens),
    }
  },

  revokeSession: async (
    sessionId: string,
    payload: RevokeAssistedSessionPayload,
  ): Promise<RevokeAssistedSessionResponse> => {
    const response = await apiClient.post<BackendRevokeResponse>(
      `/admin/support/sessions/${sessionId}/revoke`,
      payload,
    )
    const session = mapSession(response.data.session)
    if (!session) {
      throw new Error('Resposta invalida: sessao assistida em falta.')
    }

    return {
      message: response.data.message ?? 'Sessao assistida revogada.',
      changed: Boolean(response.data.changed),
      session,
    }
  },

  getSessionHistory: async (
    sessionId: string,
    page = 1,
    limit = 20,
  ): Promise<AssistedSessionAuditResponse> => {
    const response = await apiClient.get<BackendAuditResponse>(
      `/admin/support/sessions/${sessionId}/history`,
      {
        params: { page, limit },
      },
    )

    const items: AssistedSessionAuditEvent[] = (response.data.items ?? [])
      .map((item) => {
        const id = resolveId(item)
        if (
          !id ||
          !item.session ||
          !item.adminUser ||
          !item.targetUser ||
          !item.method ||
          !item.path ||
          typeof item.statusCode !== 'number' ||
          !item.outcome ||
          !item.createdAt
        ) {
          return null
        }

        return {
          id,
          session: item.session,
          adminUser: item.adminUser,
          targetUser: item.targetUser,
          method: item.method,
          path: item.path,
          statusCode: item.statusCode,
          outcome: item.outcome,
          requestId: item.requestId ?? null,
          ip: item.ip ?? null,
          userAgent: item.userAgent ?? null,
          metadata: item.metadata ?? null,
          createdAt: item.createdAt,
        }
      })
      .filter((item): item is AssistedSessionAuditEvent => item !== null)

    return {
      items,
      pagination: normalizePagination(response.data.pagination),
    }
  },
}
