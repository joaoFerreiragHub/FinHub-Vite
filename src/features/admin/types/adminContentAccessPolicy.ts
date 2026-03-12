import type { AdminActorSummary } from './adminUsers'

export type AdminContentAccessPolicyRequiredRole = 'free' | 'premium'
export type AdminContentAccessPolicyContentType =
  | 'article'
  | 'video'
  | 'course'
  | 'live'
  | 'podcast'
  | 'book'
export type AdminContentAccessPolicyCategory =
  | 'finance'
  | 'investing'
  | 'trading'
  | 'crypto'
  | 'economics'
  | 'personal-finance'
  | 'business'
  | 'technology'
  | 'education'
  | 'news'
  | 'analysis'
  | 'other'

export interface AdminContentAccessPolicyMatch {
  contentTypes: AdminContentAccessPolicyContentType[]
  categories: AdminContentAccessPolicyCategory[]
  tags: string[]
  featuredOnly: boolean
}

export interface AdminContentAccessPolicyAccess {
  requiredRole: AdminContentAccessPolicyRequiredRole
  teaserAllowed: boolean
  blockedMessage: string | null
}

export interface AdminContentAccessPolicyItem {
  id: string
  code: string
  label: string
  description: string | null
  active: boolean
  priority: number
  effectiveFrom: string | null
  effectiveTo: string | null
  match: AdminContentAccessPolicyMatch
  access: AdminContentAccessPolicyAccess
  version: number
  createdBy: AdminActorSummary | null
  updatedBy: AdminActorSummary | null
  historyCount: number
  createdAt: string | null
  updatedAt: string | null
}

export interface AdminContentAccessPolicyPagination {
  page: number
  limit: number
  total: number
  pages: number
}

export interface AdminContentAccessPolicyListQuery {
  active?: boolean
  requiredRole?: AdminContentAccessPolicyRequiredRole
  contentType?: AdminContentAccessPolicyContentType
  search?: string
  page?: number
  limit?: number
}

export interface AdminContentAccessPolicyListResponse {
  items: AdminContentAccessPolicyItem[]
  pagination: AdminContentAccessPolicyPagination
}

export interface AdminContentAccessPolicyMutationResponse {
  message: string
  item: AdminContentAccessPolicyItem
}

export interface AdminContentAccessPolicyPayload {
  code?: string
  label?: string
  description?: string | null
  active?: boolean
  priority?: number
  effectiveFrom?: string | null
  effectiveTo?: string | null
  changeReason?: string
  match?: {
    contentTypes?: AdminContentAccessPolicyContentType[]
    categories?: AdminContentAccessPolicyCategory[]
    tags?: string[]
    featuredOnly?: boolean
  }
  access?: {
    requiredRole?: AdminContentAccessPolicyRequiredRole
    teaserAllowed?: boolean
    blockedMessage?: string | null
  }
}

export interface AdminContentAccessPolicyPreviewCounts {
  total: number
  currentlyPremium: number
  currentlyFree: number
}

export interface AdminContentAccessPolicyPreviewSample {
  id: string
  contentType: AdminContentAccessPolicyContentType
  title: string
  isPremium: boolean
  category?: AdminContentAccessPolicyCategory
  publishedAt: string | null
}

export interface AdminContentAccessPolicyPreviewResponse {
  input: {
    match: AdminContentAccessPolicyMatch
    access: AdminContentAccessPolicyAccess
  }
  impact: {
    totalMatches: number
    currentlyPremium: number
    currentlyFree: number
    byContentType: Record<AdminContentAccessPolicyContentType, AdminContentAccessPolicyPreviewCounts>
  }
  sample: AdminContentAccessPolicyPreviewSample[]
  generatedAt: string | null
}
