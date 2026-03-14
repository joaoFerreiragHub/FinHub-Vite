import type { AdminActorSummary } from './adminUsers'

export type AdminBroadcastStatus = 'draft' | 'approved' | 'sent' | 'failed' | 'canceled'
export type AdminBroadcastChannel = 'in_app'
export type AdminBroadcastRole =
  | 'visitor'
  | 'free'
  | 'premium'
  | 'creator'
  | 'brand_manager'
  | 'admin'
export type AdminBroadcastAccountStatus = 'active' | 'suspended' | 'banned'
export type AdminBroadcastHistoryAction =
  | 'created'
  | 'approved'
  | 'send_started'
  | 'sent'
  | 'failed'
  | 'canceled'

export interface AdminBroadcastSegment {
  roles: AdminBroadcastRole[]
  accountStatuses: AdminBroadcastAccountStatus[]
  includeUsers: string[]
  excludeUsers: string[]
  lastActiveWithinDays: number | null
}

export interface AdminBroadcastApproval {
  required: boolean
  approvedAt: string | null
  approvedBy: AdminActorSummary | null
  reason: string | null
}

export interface AdminBroadcastDelivery {
  attempted: number
  sent: number
  failed: number
  sentAt: string | null
  lastError: string | null
}

export interface AdminBroadcastHistoryEntry {
  action: AdminBroadcastHistoryAction
  reason: string | null
  note: string | null
  metadata: Record<string, unknown> | null
  changedAt: string | null
  changedBy: AdminActorSummary | null
}

export interface AdminBroadcastItem {
  id: string
  title: string
  message: string
  channel: AdminBroadcastChannel
  status: AdminBroadcastStatus
  segment: AdminBroadcastSegment
  audienceEstimate: number
  approval: AdminBroadcastApproval
  delivery: AdminBroadcastDelivery
  createdBy: AdminActorSummary | null
  updatedBy: AdminActorSummary | null
  version: number
  historyCount: number
  lastHistoryEntry: AdminBroadcastHistoryEntry | null
  history?: AdminBroadcastHistoryEntry[]
  createdAt: string | null
  updatedAt: string | null
}

export interface AdminBroadcastPagination {
  page: number
  limit: number
  total: number
  pages: number
}

export interface AdminBroadcastListSummary {
  draft: number
  approved: number
  sent: number
  failed: number
  canceled: number
  total: number
}

export interface AdminBroadcastListQuery {
  status?: AdminBroadcastStatus
  channel?: AdminBroadcastChannel
  search?: string
  page?: number
  limit?: number
}

export interface AdminBroadcastListResponse {
  items: AdminBroadcastItem[]
  pagination: AdminBroadcastPagination
  summary: AdminBroadcastListSummary
}

export interface AdminBroadcastSegmentInput {
  roles?: AdminBroadcastRole[]
  accountStatuses?: AdminBroadcastAccountStatus[]
  includeUsers?: string[]
  excludeUsers?: string[]
  lastActiveWithinDays?: number
}

export interface AdminBroadcastPreviewSample {
  id: string | null
  name: string | null
  username: string | null
  email: string | null
  role: AdminBroadcastRole | null
  accountStatus: AdminBroadcastAccountStatus | null
  lastActiveAt: string | null
  createdAt: string | null
}

export interface AdminBroadcastPreviewResponse {
  segment: AdminBroadcastSegment
  estimatedRecipients: number
  approvalRequired: boolean
  massApprovalMinRecipients: number
  sample: AdminBroadcastPreviewSample[]
}

export interface AdminBroadcastPreviewPayload {
  segment?: AdminBroadcastSegmentInput
  sampleLimit?: number
}

export interface AdminBroadcastCreatePayload {
  title: string
  message: string
  channel?: AdminBroadcastChannel
  segment?: AdminBroadcastSegmentInput
  note?: string
}

export interface AdminBroadcastActionPayload {
  reason: string
  note?: string
}

export interface AdminBroadcastMutationResponse {
  message: string
  item: AdminBroadcastItem
}
