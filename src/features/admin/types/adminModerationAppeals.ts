import type { AdminContentType } from './adminContent'
import type { AdminActorSummary } from './adminUsers'

export type AdminModerationAppealContentType = AdminContentType

export type AdminModerationAppealStatus =
  | 'open'
  | 'under_review'
  | 'accepted'
  | 'rejected'
  | 'closed'

export type AdminModerationAppealSeverity = 'low' | 'medium' | 'high' | 'critical'
export type AdminModerationAppealReasonCategory =
  | 'false_positive'
  | 'context_missing'
  | 'policy_dispute'
  | 'other'

export interface AdminModerationAppealEventSummary {
  id: string | null
  contentType: AdminModerationAppealContentType | null
  contentId: string | null
  action: string | null
  fromStatus: string | null
  toStatus: string | null
  reason: string | null
  createdAt: string | null
}

export interface AdminModerationAppealHistoryEntry {
  fromStatus: AdminModerationAppealStatus
  toStatus: AdminModerationAppealStatus
  reason: string
  note: string | null
  changedAt: string | null
  changedBy: AdminActorSummary | null
}

export interface AdminModerationAppealSla {
  isBreached: boolean
  remainingMinutes: number | null
  firstResponseMinutes: number | null
  resolutionMinutes: number | null
}

export interface AdminModerationAppealItem {
  id: string
  moderationEvent: AdminModerationAppealEventSummary | null
  contentType: AdminModerationAppealContentType | null
  contentId: string | null
  appellant: AdminActorSummary | null
  status: AdminModerationAppealStatus
  severity: AdminModerationAppealSeverity
  reasonCategory: AdminModerationAppealReasonCategory
  reason: string
  note: string | null
  slaHours: number
  openedAt: string | null
  firstResponseAt: string | null
  resolvedAt: string | null
  dueAt: string | null
  sla: AdminModerationAppealSla
  createdBy: AdminActorSummary | null
  updatedBy: AdminActorSummary | null
  version: number
  historyCount: number
  lastHistoryEntry: AdminModerationAppealHistoryEntry | null
  history?: AdminModerationAppealHistoryEntry[]
  createdAt: string | null
  updatedAt: string | null
}

export interface AdminModerationAppealListSummary {
  open: number
  underReview: number
  accepted: number
  rejected: number
  closed: number
  breachedSla: number
  total: number
}

export interface AdminModerationAppealPagination {
  page: number
  limit: number
  total: number
  pages: number
}

export interface AdminModerationAppealListQuery {
  status?: AdminModerationAppealStatus
  severity?: AdminModerationAppealSeverity
  contentType?: AdminModerationAppealContentType
  breachedSla?: boolean
  search?: string
  page?: number
  limit?: number
}

export interface AdminModerationAppealListResponse {
  items: AdminModerationAppealItem[]
  pagination: AdminModerationAppealPagination
  summary: AdminModerationAppealListSummary
}

export interface AdminUpdateModerationAppealStatusPayload {
  status: AdminModerationAppealStatus
  reason: string
  note?: string
}

export interface AdminModerationAppealMutationResponse {
  message: string
  item: AdminModerationAppealItem
}
