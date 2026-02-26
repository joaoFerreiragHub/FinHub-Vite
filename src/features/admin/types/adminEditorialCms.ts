import type { AdminPagination } from './adminUsers'

export type AdminEditorialSectionStatus = 'active' | 'inactive'
export type AdminEditorialSectionType = 'content' | 'directory' | 'mixed' | 'custom'

export type AdminEditorialSectionItemTargetType =
  | 'article'
  | 'video'
  | 'course'
  | 'live'
  | 'podcast'
  | 'book'
  | 'directory_entry'
  | 'external_link'
  | 'custom'

export type AdminEditorialSectionItemStatus = 'active' | 'inactive'

export interface AdminEditorialSectionItem {
  id: string
  sectionId: string
  targetType: AdminEditorialSectionItemTargetType
  targetId: string
  titleOverride: string | null
  descriptionOverride: string | null
  imageOverride: string | null
  urlOverride: string | null
  badge: string | null
  sortOrder: number
  isPinned: boolean
  status: AdminEditorialSectionItemStatus
  startAt: string | null
  endAt: string | null
  metadata: Record<string, unknown> | null
  createdAt: string | null
  updatedAt: string | null
}

export interface AdminEditorialSection {
  id: string
  key: string
  title: string
  subtitle: string | null
  description: string | null
  sectionType: AdminEditorialSectionType
  order: number
  maxItems: number
  status: AdminEditorialSectionStatus
  showOnHome: boolean
  showOnLanding: boolean
  showOnShowAll: boolean
  createdBy: string | null
  updatedBy: string | null
  createdAt: string | null
  updatedAt: string | null
  itemCount: number
  items: AdminEditorialSectionItem[]
}

export interface AdminEditorialSectionsListResponse {
  items: AdminEditorialSection[]
  pagination: AdminPagination
}

export interface AdminEditorialSectionQuery {
  status?: AdminEditorialSectionStatus
  search?: string
  page?: number
  limit?: number
}

export interface AdminCreateEditorialSectionInput {
  key?: string
  title: string
  subtitle?: string
  description?: string
  sectionType?: AdminEditorialSectionType
  order?: number
  maxItems?: number
  status?: AdminEditorialSectionStatus
  showOnHome?: boolean
  showOnLanding?: boolean
  showOnShowAll?: boolean
}

export interface AdminUpdateEditorialSectionInput {
  key?: string
  title?: string
  subtitle?: string | null
  description?: string | null
  sectionType?: AdminEditorialSectionType
  order?: number
  maxItems?: number
  status?: AdminEditorialSectionStatus
  showOnHome?: boolean
  showOnLanding?: boolean
  showOnShowAll?: boolean
}

export interface AdminAddEditorialSectionItemInput {
  targetType: AdminEditorialSectionItemTargetType
  targetId: string
  titleOverride?: string
  descriptionOverride?: string
  imageOverride?: string
  urlOverride?: string
  badge?: string
  sortOrder?: number
  isPinned?: boolean
  status?: AdminEditorialSectionItemStatus
  startAt?: string | null
  endAt?: string | null
  metadata?: Record<string, unknown> | null
}

export interface AdminReorderEditorialSectionItemsPayload {
  items: Array<{
    itemId: string
    sortOrder: number
    isPinned?: boolean
    status?: AdminEditorialSectionItemStatus
  }>
}

export interface AdminReorderEditorialSectionItemsResponse {
  sectionId: string
  items: AdminEditorialSectionItem[]
}

export interface AdminRemoveEditorialSectionItemResponse {
  removed: boolean
  sectionId: string
  itemId: string
}

export interface EditorialHomePreviewSection {
  id: string
  key: string
  title: string
  subtitle: string | null
  description: string | null
  sectionType: AdminEditorialSectionType
  order: number
  maxItems: number
  items: AdminEditorialSectionItem[]
}

export interface EditorialHomePreviewResponse {
  items: EditorialHomePreviewSection[]
}

export type AdminEditorialClaimStatus = 'pending' | 'approved' | 'rejected' | 'cancelled'

export type AdminEditorialClaimTargetType =
  | 'article'
  | 'video'
  | 'course'
  | 'live'
  | 'podcast'
  | 'book'
  | 'directory_entry'

export type AdminOwnershipOwnerType = 'admin_seeded' | 'creator_owned'

export interface AdminEditorialClaimActorSummary {
  id: string
  name?: string
  username?: string
  email?: string
  role?: string
}

export interface AdminEditorialClaimRecord {
  id: string
  targetType: AdminEditorialClaimTargetType
  targetId: string
  creator: AdminEditorialClaimActorSummary | null
  requestedBy: AdminEditorialClaimActorSummary | null
  status: AdminEditorialClaimStatus
  reason: string
  note: string | null
  evidenceLinks: string[]
  reviewedBy: AdminEditorialClaimActorSummary | null
  reviewedAt: string | null
  reviewNote: string | null
  metadata: Record<string, unknown> | null
  createdAt: string | null
  updatedAt: string | null
}

export interface AdminEditorialClaimsQuery {
  status?: AdminEditorialClaimStatus
  targetType?: AdminEditorialClaimTargetType
  creatorId?: string
  page?: number
  limit?: number
}

export interface AdminEditorialClaimsListResponse {
  items: AdminEditorialClaimRecord[]
  pagination: AdminPagination
}

export interface AdminOwnershipTransferInput {
  targetType: AdminEditorialClaimTargetType
  targetId: string
  toOwnerType: AdminOwnershipOwnerType
  toOwnerUserId?: string | null
  reason: string
  note?: string
}

export interface AdminOwnershipTransferResult {
  changed: boolean
  targetType: AdminEditorialClaimTargetType
  targetId: string
  fromOwnerType: AdminOwnershipOwnerType
  fromOwnerUserId: string | null
  toOwnerType: AdminOwnershipOwnerType
  toOwnerUserId: string | null
  transferLogId: string
  transferAt: string | null
}

export interface AdminApproveEditorialClaimResponse {
  claim: AdminEditorialClaimRecord
  transfer: AdminOwnershipTransferResult
}
