import type { AdminActorSummary, AdminPagination } from './adminUsers'

export type AdminContentType =
  | 'article'
  | 'video'
  | 'course'
  | 'live'
  | 'podcast'
  | 'book'
  | 'comment'
  | 'review'
export type AdminContentModerationStatus = 'visible' | 'hidden' | 'restricted'
export type AdminContentPublishStatus = 'draft' | 'published' | 'archived'
export type AdminContentModerationAction = 'hide' | 'unhide' | 'restrict'

export interface AdminContentQueueItem {
  id: string
  contentType: AdminContentType
  title: string
  slug: string
  description: string
  category: string
  status: AdminContentPublishStatus
  moderationStatus: AdminContentModerationStatus
  moderationReason: string | null
  moderationNote: string | null
  moderatedAt: string | null
  moderatedBy: AdminActorSummary | null
  creator: AdminActorSummary | null
  createdAt: string | null
  updatedAt: string | null
}

export interface AdminContentQueueQuery {
  contentType?: AdminContentType
  moderationStatus?: AdminContentModerationStatus
  publishStatus?: AdminContentPublishStatus
  search?: string
  creatorId?: string
  page?: number
  limit?: number
}

export interface AdminContentQueueResponse {
  items: AdminContentQueueItem[]
  pagination: AdminPagination
}

export interface AdminContentModerationActionPayload {
  reason: string
  note?: string
}

export interface AdminContentModerationActionResponse {
  message: string
  changed: boolean
  fromStatus: AdminContentModerationStatus
  toStatus: AdminContentModerationStatus
  content: AdminContentQueueItem
}

export interface AdminContentModerationEvent {
  id: string
  contentType: AdminContentType
  contentId: string
  actor: AdminActorSummary | null
  action: AdminContentModerationAction
  fromStatus: AdminContentModerationStatus
  toStatus: AdminContentModerationStatus
  reason: string
  note: string | null
  metadata: Record<string, unknown> | null
  createdAt: string
}

export interface AdminContentModerationHistoryResponse {
  items: AdminContentModerationEvent[]
  pagination: AdminPagination
}
