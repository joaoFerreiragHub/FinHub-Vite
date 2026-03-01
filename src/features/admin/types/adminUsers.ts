export type AdminUserRole = 'visitor' | 'free' | 'premium' | 'creator' | 'admin'

export type AdminUserAccountStatus = 'active' | 'suspended' | 'banned'

export type AdminUserSortField =
  | 'createdAt'
  | 'updatedAt'
  | 'lastLoginAt'
  | 'lastActiveAt'
  | 'username'
  | 'email'

export type AdminModerationAction =
  | 'status_change'
  | 'force_logout'
  | 'internal_note'
  | 'creator_control'

export type AdminCreatorControlAction =
  | 'set_cooldown'
  | 'clear_cooldown'
  | 'block_creation'
  | 'unblock_creation'
  | 'block_publishing'
  | 'unblock_publishing'
  | 'suspend_creator_ops'
  | 'restore_creator_ops'

export type CreatorRiskLevel = 'low' | 'medium' | 'high' | 'critical'
export type CreatorTrustRecommendedAction =
  | 'none'
  | 'review'
  | 'set_cooldown'
  | 'block_publishing'
  | 'suspend_creator_ops'

export interface AdminActorSummary {
  id: string
  name?: string
  username?: string
  email?: string
  role?: AdminUserRole
}

export interface AdminCreatorControls {
  creationBlocked: boolean
  creationBlockedReason: string | null
  publishingBlocked: boolean
  publishingBlockedReason: string | null
  cooldownUntil: string | null
  updatedAt: string | null
  updatedBy: AdminActorSummary | null
}

export interface AdminCreatorTrustSignals {
  trustScore: number
  riskLevel: CreatorRiskLevel
  recommendedAction: CreatorTrustRecommendedAction
  generatedAt: string
  summary: {
    openReports: number
    highPriorityTargets: number
    criticalTargets: number
    hiddenItems: number
    restrictedItems: number
    recentModerationActions30d: number
    repeatModerationTargets30d: number
    recentCreatorControlActions30d: number
    falsePositiveEvents30d: number
    automatedFalsePositiveEvents30d: number
    falsePositiveRate30d: number
    activeControlFlags: string[]
  }
  flags: string[]
  reasons: string[]
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
  creatorControls: AdminCreatorControls
  trustSignals: AdminCreatorTrustSignals | null
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

export interface AdminCreatorControlPayload extends AdminUserActionPayload {
  action: AdminCreatorControlAction
  cooldownHours?: number
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

export interface AdminCreatorControlResponse {
  message: string
  action: AdminCreatorControlAction
  creatorControls: AdminCreatorControls
  user: AdminUserRecord
}

export interface AdminAddNoteResponse {
  message: string
  event: AdminModerationEvent
}

export interface AdminCreatorTrustProfileResponse {
  user: AdminUserRecord
  trustSignals: AdminCreatorTrustSignals | null
}
