import type { AdminActorSummary } from './adminUsers'

export type AdminAuditOutcome = 'success' | 'forbidden' | 'error'

export interface AdminAuditLogItem {
  id: string
  createdAt: string
  actor: AdminActorSummary | null
  actorRole: string
  action: string
  scope?: string
  resourceType: string
  resourceId?: string
  reason?: string
  requestId?: string
  method: string
  path: string
  statusCode: number
  outcome: AdminAuditOutcome
  ip?: string
  userAgent?: string
  metadata?: Record<string, unknown>
}

export interface AdminAuditLogsQuery {
  actorId?: string
  action?: string
  resourceType?: string
  outcome?: AdminAuditOutcome
  requestId?: string
  from?: string
  to?: string
  page?: number
  limit?: number
}

export interface AdminAuditLogsPagination {
  page: number
  limit: number
  total: number
  pages: number
}

export interface AdminAuditLogsResponse {
  items: AdminAuditLogItem[]
  pagination: AdminAuditLogsPagination
}
