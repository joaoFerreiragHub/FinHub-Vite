import type { AdminActorSummary, AdminPagination } from './adminUsers'

export type AdminDirectoryVertical =
  | 'broker'
  | 'exchange'
  | 'site'
  | 'app'
  | 'podcast'
  | 'event'
  | 'other'

export type AdminDirectoryStatus = 'draft' | 'published' | 'archived'
export type AdminDirectoryVerificationStatus = 'unverified' | 'pending' | 'verified'
export type AdminDirectoryOwnerType = 'admin_seeded' | 'creator_owned'
export type AdminDirectorySourceType = 'internal' | 'external_profile' | 'external_content'

export interface AdminDirectoryEntry {
  id: string
  name: string
  slug: string
  verticalType: AdminDirectoryVertical
  shortDescription: string
  description: string | null
  logo: string | null
  coverImage: string | null
  website: string | null
  canonicalUrl: string | null
  country: string | null
  region: string | null
  categories: string[]
  tags: string[]
  socialLinks: Record<string, unknown> | null
  status: AdminDirectoryStatus
  verificationStatus: AdminDirectoryVerificationStatus
  isActive: boolean
  isFeatured: boolean
  showInHomeSection: boolean
  showInDirectory: boolean
  landingEnabled: boolean
  showAllEnabled: boolean
  ownerType: AdminDirectoryOwnerType
  sourceType: AdminDirectorySourceType
  claimable: boolean
  ownerUser: AdminActorSummary | null
  metadata: Record<string, unknown> | null
  publishedAt: string | null
  archivedAt: string | null
  createdBy: AdminActorSummary | null
  updatedBy: AdminActorSummary | null
  createdAt: string | null
  updatedAt: string | null
}

export interface AdminDirectoryListQuery {
  status?: AdminDirectoryStatus
  search?: string
  isActive?: boolean
  isFeatured?: boolean
  claimable?: boolean
  page?: number
  limit?: number
}

export interface AdminDirectoryListResponse {
  items: AdminDirectoryEntry[]
  pagination: AdminPagination
}

export interface AdminDirectoryCreateInput {
  name: string
  slug?: string
  shortDescription: string
  description?: string
  logo?: string
  coverImage?: string
  website?: string
  canonicalUrl?: string
  country?: string
  region?: string
  categories?: string[]
  tags?: string[]
  socialLinks?: Record<string, unknown>
  status?: AdminDirectoryStatus
  verificationStatus?: AdminDirectoryVerificationStatus
  isActive?: boolean
  isFeatured?: boolean
  showInHomeSection?: boolean
  showInDirectory?: boolean
  landingEnabled?: boolean
  showAllEnabled?: boolean
  ownerType?: AdminDirectoryOwnerType
  sourceType?: AdminDirectorySourceType
  claimable?: boolean
  ownerUserId?: string | null
  metadata?: Record<string, unknown> | null
}

export interface AdminDirectoryUpdateInput {
  name?: string
  slug?: string
  shortDescription?: string
  description?: string
  logo?: string
  coverImage?: string
  website?: string
  canonicalUrl?: string
  country?: string
  region?: string
  categories?: string[]
  tags?: string[]
  socialLinks?: Record<string, unknown>
  status?: AdminDirectoryStatus
  verificationStatus?: AdminDirectoryVerificationStatus
  isActive?: boolean
  isFeatured?: boolean
  showInHomeSection?: boolean
  showInDirectory?: boolean
  landingEnabled?: boolean
  showAllEnabled?: boolean
  ownerType?: AdminDirectoryOwnerType
  sourceType?: AdminDirectorySourceType
  claimable?: boolean
  ownerUserId?: string | null
  metadata?: Record<string, unknown> | null
}

export interface AdminDirectoryPublishArchiveResponse {
  changed: boolean
  entry: AdminDirectoryEntry
}
