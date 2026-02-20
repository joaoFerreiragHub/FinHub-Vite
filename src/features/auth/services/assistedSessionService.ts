import { apiClient } from '@/lib/api/client'

export type AssistedSessionStatus =
  | 'pending'
  | 'approved'
  | 'active'
  | 'declined'
  | 'revoked'
  | 'expired'

export interface AssistedSessionUserSummary {
  id: string
  name: string
  username: string
  email: string
  role: string
}

export interface AssistedSessionRecord {
  id: string
  adminUser: AssistedSessionUserSummary | null
  targetUser: AssistedSessionUserSummary | null
  scope: 'read_only'
  status: AssistedSessionStatus
  reason: string
  note: string | null
  consentExpiresAt: string
  requestedSessionTtlMinutes: number
  approvedAt: string | null
  startedAt: string | null
  sessionExpiresAt: string | null
  declinedAt: string | null
  declinedReason: string | null
  revokedAt: string | null
  revokedBy: string | null
  revokedReason: string | null
  createdAt: string
  updatedAt: string
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
  total?: number
}

interface BackendActionResponse {
  message?: string
  changed?: boolean
  session?: BackendSessionRecord
}

const resolveId = (value: unknown): string | null => {
  if (typeof value === 'string' && value.length > 0) return value
  if (value && typeof value === 'object') {
    const record = value as { id?: unknown; _id?: unknown }
    if (typeof record.id === 'string' && record.id.length > 0) return record.id
    if (typeof record._id === 'string' && record._id.length > 0) return record._id
  }
  return null
}

const toStatus = (value: unknown): AssistedSessionStatus => {
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

const mapUserSummary = (
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
    adminUser: mapUserSummary(item.adminUser),
    targetUser: mapUserSummary(item.targetUser),
    scope: 'read_only',
    status: toStatus(item.status),
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

const mapListResponse = (data: BackendListResponse) => {
  return {
    items: (data.items ?? [])
      .map(mapSession)
      .filter((session): session is AssistedSessionRecord => session !== null),
    total: typeof data.total === 'number' ? data.total : 0,
  }
}

const mapActionResponse = (data: BackendActionResponse) => {
  const session = mapSession(data.session)
  if (!session) {
    throw new Error('Resposta invalida: sessao assistida em falta.')
  }

  return {
    message: data.message ?? 'Operacao concluida.',
    changed: Boolean(data.changed),
    session,
  }
}

export const assistedSessionService = {
  listPending: async () => {
    const response = await apiClient.get<BackendListResponse>('/auth/assisted-sessions/pending')
    return mapListResponse(response.data)
  },

  listActive: async () => {
    const response = await apiClient.get<BackendListResponse>('/auth/assisted-sessions/active')
    return mapListResponse(response.data)
  },

  respondConsent: async (
    sessionId: string,
    payload: { decision: 'approve' | 'decline'; note?: string },
  ) => {
    const response = await apiClient.post<BackendActionResponse>(
      `/auth/assisted-sessions/${sessionId}/consent`,
      payload,
    )
    return mapActionResponse(response.data)
  },

  revoke: async (sessionId: string, payload: { reason?: string }) => {
    const response = await apiClient.post<BackendActionResponse>(
      `/auth/assisted-sessions/${sessionId}/revoke`,
      payload,
    )
    return mapActionResponse(response.data)
  },
}
