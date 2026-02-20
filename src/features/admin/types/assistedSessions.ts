import { AuthTokens, User } from '@/features/auth/types'

export type AssistedSessionStatus =
  | 'pending'
  | 'approved'
  | 'active'
  | 'declined'
  | 'revoked'
  | 'expired'

export type AssistedSessionScope = 'read_only'

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
  scope: AssistedSessionScope
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

export interface AssistedSessionPagination {
  page: number
  limit: number
  total: number
  pages: number
}

export interface AssistedSessionListResponse {
  items: AssistedSessionRecord[]
  pagination: AssistedSessionPagination
}

export interface RequestAssistedSessionPayload {
  targetUserId: string
  reason: string
  note?: string
  consentTtlMinutes?: number
  sessionTtlMinutes?: number
}

export interface RequestAssistedSessionResponse {
  message: string
  session: AssistedSessionRecord
}

export interface StartAssistedSessionResponse {
  message: string
  session: AssistedSessionRecord
  actingUser: User
  tokens: AuthTokens
}

export interface RevokeAssistedSessionPayload {
  reason: string
}

export interface RevokeAssistedSessionResponse {
  message: string
  changed: boolean
  session: AssistedSessionRecord
}

export interface AssistedSessionAuditEvent {
  id: string
  session: string
  adminUser: string
  targetUser: string
  method: string
  path: string
  statusCode: number
  outcome: 'success' | 'forbidden' | 'error'
  requestId: string | null
  ip: string | null
  userAgent: string | null
  metadata: Record<string, unknown> | null
  createdAt: string
}

export interface AssistedSessionAuditResponse {
  items: AssistedSessionAuditEvent[]
  pagination: AssistedSessionPagination
}
