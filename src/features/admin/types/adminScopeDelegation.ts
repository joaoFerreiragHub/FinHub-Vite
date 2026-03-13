import type { AdminActorSummary } from './adminUsers'

export type AdminScopeDelegationStatus = 'active' | 'expired' | 'revoked'

export interface AdminScopeDelegationItem {
  id: string
  scope: string
  status: AdminScopeDelegationStatus
  reason: string
  note: string | null
  delegatedBy: AdminActorSummary | null
  delegatedTo: AdminActorSummary | null
  startsAt: string | null
  expiresAt: string | null
  revokedAt: string | null
  revokedBy: AdminActorSummary | null
  revokeReason: string | null
  revokeNote: string | null
  createdAt: string | null
  updatedAt: string | null
}

export interface AdminScopeDelegationPagination {
  page: number
  limit: number
  total: number
  pages: number
}

export interface AdminScopeDelegationListQuery {
  scope?: string
  status?: AdminScopeDelegationStatus
  page?: number
  limit?: number
}

export interface AdminScopeDelegationListResponse {
  items: AdminScopeDelegationItem[]
  pagination: AdminScopeDelegationPagination
}

export interface AdminScopeDelegationCreatePayload {
  scopes: string[]
  expiresAt: string
  reason: string
  note?: string
}

export interface AdminScopeDelegationCreateResponse {
  message: string
  items: AdminScopeDelegationItem[]
  summary: {
    scopesRequested: number
    delegationsAffected: number
    maxDelegationHours: number
  }
}

export interface AdminScopeDelegationRevokePayload {
  reason: string
  note?: string
}

export interface AdminScopeDelegationRevokeResponse {
  message: string
  changed: boolean
  item: AdminScopeDelegationItem
}
