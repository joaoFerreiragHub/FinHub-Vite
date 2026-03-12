import type {
  AdminUserAccountStatus,
  CreatorRiskLevel,
  CreatorTrustRecommendedAction,
} from './adminUsers'

export type AdminCreatorPositiveSortBy = 'growth' | 'engagement' | 'followers' | 'trust'
export type AdminCreatorPositiveSortOrder = 'asc' | 'desc'

export interface AdminCreatorPositiveAnalyticsContentBreakdown {
  total: number
  published: number
}

export interface AdminCreatorPositiveAnalyticsItem {
  creatorId: string
  creator: {
    id: string
    name: string
    username: string
    email: string
    avatar: string | null
    accountStatus: AdminUserAccountStatus
    followers: number
    following: number
    createdAt: string | null
    lastActiveAt: string | null
  }
  content: {
    total: number
    published: number
    premiumPublished: number
    featuredPublished: number
    byType: Record<
      'article' | 'video' | 'course' | 'live' | 'podcast' | 'book',
      AdminCreatorPositiveAnalyticsContentBreakdown
    >
  }
  growth: {
    windowDays: number
    followsLastWindow: number
    followsPrevWindow: number
    followsDelta: number
    followsTrendPercent: number
    publishedLastWindow: number
    publishedPrevWindow: number
    publishedDelta: number
    score: number
  }
  engagement: {
    views: number
    likes: number
    favorites: number
    comments: number
    ratingsCount: number
    averageRating: number
    actionsTotal: number
    actionsPerPublished: number
    score: number
  }
  trust: {
    trustScore: number
    riskLevel: CreatorRiskLevel
    recommendedAction: CreatorTrustRecommendedAction | string
    openReports: number
    highPriorityTargets: number
    criticalTargets: number
    falsePositiveRate30d: number
  }
}

export interface AdminCreatorPositiveAnalyticsPagination {
  page: number
  limit: number
  total: number
  pages: number
}

export interface AdminCreatorPositiveAnalyticsSummary {
  totalCreators: number
  avgGrowthScore: number
  avgEngagementScore: number
  avgTrustScore: number
}

export interface AdminCreatorPositiveAnalyticsResponse {
  items: AdminCreatorPositiveAnalyticsItem[]
  pagination: AdminCreatorPositiveAnalyticsPagination
  sort: {
    sortBy: AdminCreatorPositiveSortBy
    sortOrder: AdminCreatorPositiveSortOrder
  }
  summary: AdminCreatorPositiveAnalyticsSummary
}

export interface AdminCreatorPositiveAnalyticsQuery {
  page?: number
  limit?: number
  search?: string
  accountStatus?: AdminUserAccountStatus
  riskLevel?: CreatorRiskLevel
  sortBy?: AdminCreatorPositiveSortBy
  sortOrder?: AdminCreatorPositiveSortOrder
  windowDays?: number
}

export interface AdminCreatorPositiveAnalyticsExportQuery
  extends Omit<AdminCreatorPositiveAnalyticsQuery, 'page' | 'limit'> {
  maxRows?: number
}
