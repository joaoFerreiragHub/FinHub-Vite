import type { AdminPagination, AdminActorSummary } from './adminUsers'

export type AdminModerationTemplateChangeType = 'created' | 'updated' | 'status_change'

export interface AdminModerationTemplateSnapshot {
  label: string
  reason: string
  defaultNote: string | null
  tags: string[]
  active: boolean
  requiresNote: boolean
  requiresDoubleConfirm: boolean
}

export interface AdminModerationTemplateHistoryEntry {
  version: number
  changeType: AdminModerationTemplateChangeType
  changedAt: string | null
  changedBy: AdminActorSummary | null
  changeReason: string | null
  snapshot: AdminModerationTemplateSnapshot | null
}

export interface AdminModerationTemplateItem {
  id: string
  code: string
  label: string
  reason: string
  defaultNote: string | null
  tags: string[]
  active: boolean
  requiresNote: boolean
  requiresDoubleConfirm: boolean
  version: number
  createdBy: AdminActorSummary | null
  updatedBy: AdminActorSummary | null
  historyCount: number
  lastHistoryEntry: AdminModerationTemplateHistoryEntry | null
  createdAt: string | null
  updatedAt: string | null
}

export interface AdminModerationTemplatesListQuery {
  active?: boolean
  tag?: string
  search?: string
  page?: number
  limit?: number
}

export interface AdminModerationTemplatesListResponse {
  items: AdminModerationTemplateItem[]
  pagination: AdminPagination
}
