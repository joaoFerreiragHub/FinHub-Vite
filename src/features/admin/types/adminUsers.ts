export type AdminUserRole = 'visitor' | 'free' | 'premium' | 'creator' | 'admin'

export type AdminUserAccountStatus = 'active' | 'suspended' | 'banned'

export type AdminUserSortField =
  | 'createdAt'
  | 'updatedAt'
  | 'lastLoginAt'
  | 'lastActiveAt'
  | 'username'
  | 'email'

export type AdminModerationAction = 'status_change' | 'force_logout' | 'internal_note'

export interface AdminActorSummary {
  id: string
  name?: string
  username?: string
  email?: string
  role?: AdminUserRole
}

export interface AdminUserRecord {
  id: string
  email: string
  name: string
  username: string
  avatar?: string
  role: AdminUserRole
  accountStatus: AdminUserAccountStatus
  adminReadOnly: boolean
  adminScopes: string[]
  statusReason: string | null
  statusChangedAt: string | null
  statusChangedBy: AdminActorSummary | null
  tokenVersion: number
  lastForcedLogoutAt: string | null
  lastLoginAt: string | null
  lastActiveAt: string | null
  createdAt: string
  updatedAt: string
}

export interface AdminPagination {
  page: number
  limit: number
  total: number
  pages: number
}

export interface AdminUsersListResponse {
  items: AdminUserRecord[]
  pagination: AdminPagination
}

export interface AdminUserListQuery {
  search?: string
  role?: AdminUserRole
  accountStatus?: AdminUserAccountStatus
  adminReadOnly?: boolean
  activeSinceDays?: number
  page?: number
  limit?: number
  sortBy?: AdminUserSortField
  sortOrder?: 'asc' | 'desc'
}

export interface AdminUserActionPayload {
  reason: string
  note?: string
}

export interface AdminAddNotePayload {
  reason?: string
  note: string
}

export interface AdminModerationEvent {
  id: string
  user: string
  actor: AdminActorSummary | null
  action: AdminModerationAction
  fromStatus: AdminUserAccountStatus | null
  toStatus: AdminUserAccountStatus | null
  reason: string
  note: string | null
  metadata: Record<string, unknown> | null
  createdAt: string
}

export interface AdminModerationHistoryResponse {
  items: AdminModerationEvent[]
  pagination: AdminPagination
}

export interface AdminUserActionResponse {
  message: string
  changed?: boolean
  fromStatus?: AdminUserAccountStatus
  user: AdminUserRecord
}

export interface AdminAddNoteResponse {
  message: string
  event: AdminModerationEvent
}
