import { apiClient } from '@/lib/api/client'
import type {
  AdminCreatorPositiveAnalyticsExportQuery,
  AdminCreatorPositiveAnalyticsItem,
  AdminCreatorPositiveAnalyticsPagination,
  AdminCreatorPositiveAnalyticsQuery,
  AdminCreatorPositiveAnalyticsResponse,
  AdminCreatorPositiveAnalyticsSummary,
  AdminCreatorPositiveSortBy,
  AdminCreatorPositiveSortOrder,
} from '../types/adminCreatorPositiveAnalytics'
import type {
  AdminUserAccountStatus,
  CreatorRiskLevel,
  CreatorTrustRecommendedAction,
} from '../types/adminUsers'

interface BackendCreatorIdentity {
  id?: unknown
  _id?: unknown
  name?: unknown
  username?: unknown
  email?: unknown
  avatar?: unknown
  accountStatus?: unknown
  followers?: unknown
  following?: unknown
  createdAt?: unknown
  lastActiveAt?: unknown
}

interface BackendContentByTypeRow {
  total?: unknown
  published?: unknown
}

interface BackendCreatorPositiveAnalyticsItem {
  creatorId?: unknown
  creator?: BackendCreatorIdentity
  content?: {
    total?: unknown
    published?: unknown
    premiumPublished?: unknown
    featuredPublished?: unknown
    byType?: Partial<
      Record<'article' | 'video' | 'course' | 'live' | 'podcast' | 'book', BackendContentByTypeRow>
    >
  }
  growth?: {
    windowDays?: unknown
    followsLastWindow?: unknown
    followsPrevWindow?: unknown
    followsDelta?: unknown
    followsTrendPercent?: unknown
    publishedLastWindow?: unknown
    publishedPrevWindow?: unknown
    publishedDelta?: unknown
    score?: unknown
  }
  engagement?: {
    views?: unknown
    likes?: unknown
    favorites?: unknown
    comments?: unknown
    ratingsCount?: unknown
    averageRating?: unknown
    actionsTotal?: unknown
    actionsPerPublished?: unknown
    score?: unknown
  }
  trust?: {
    trustScore?: unknown
    riskLevel?: unknown
    recommendedAction?: unknown
    openReports?: unknown
    highPriorityTargets?: unknown
    criticalTargets?: unknown
    falsePositiveRate30d?: unknown
  }
}

interface BackendCreatorPositiveAnalyticsResponse {
  items?: BackendCreatorPositiveAnalyticsItem[]
  pagination?: Partial<AdminCreatorPositiveAnalyticsPagination>
  sort?: {
    sortBy?: unknown
    sortOrder?: unknown
  }
  summary?: Partial<AdminCreatorPositiveAnalyticsSummary>
}

const SORT_BY_VALUES: readonly AdminCreatorPositiveSortBy[] = [
  'growth',
  'engagement',
  'followers',
  'trust',
]
const SORT_ORDER_VALUES: readonly AdminCreatorPositiveSortOrder[] = ['asc', 'desc']
const ACCOUNT_STATUS_VALUES: readonly AdminUserAccountStatus[] = ['active', 'suspended', 'banned']
const RISK_LEVEL_VALUES: readonly CreatorRiskLevel[] = ['low', 'medium', 'high', 'critical']
const RECOMMENDED_ACTION_VALUES: readonly CreatorTrustRecommendedAction[] = [
  'none',
  'review',
  'set_cooldown',
  'block_publishing',
  'suspend_creator_ops',
]

const SORT_BY_SET = new Set<string>(SORT_BY_VALUES)
const SORT_ORDER_SET = new Set<string>(SORT_ORDER_VALUES)
const ACCOUNT_STATUS_SET = new Set<string>(ACCOUNT_STATUS_VALUES)
const RISK_LEVEL_SET = new Set<string>(RISK_LEVEL_VALUES)
const RECOMMENDED_ACTION_SET = new Set<string>(RECOMMENDED_ACTION_VALUES)

const toNumber = (value: unknown, fallback = 0): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback

const toInteger = (value: unknown, fallback: number): number => Math.trunc(toNumber(value, fallback))

const toString = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback

const toOptionalString = (value: unknown): string | null =>
  typeof value === 'string' && value.trim().length > 0 ? value.trim() : null

const toIsoDateOrNull = (value: unknown): string | null => {
  if (typeof value !== 'string' || value.trim().length === 0) return null
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString()
}

const toSortBy = (value: unknown): AdminCreatorPositiveSortBy =>
  typeof value === 'string' && SORT_BY_SET.has(value) ? (value as AdminCreatorPositiveSortBy) : 'growth'

const toSortOrder = (value: unknown): AdminCreatorPositiveSortOrder =>
  typeof value === 'string' && SORT_ORDER_SET.has(value)
    ? (value as AdminCreatorPositiveSortOrder)
    : 'desc'

const toAccountStatus = (value: unknown): AdminUserAccountStatus =>
  typeof value === 'string' && ACCOUNT_STATUS_SET.has(value) ? (value as AdminUserAccountStatus) : 'active'

const toRiskLevel = (value: unknown): CreatorRiskLevel =>
  typeof value === 'string' && RISK_LEVEL_SET.has(value) ? (value as CreatorRiskLevel) : 'low'

const toRecommendedAction = (value: unknown): CreatorTrustRecommendedAction | string => {
  if (typeof value !== 'string' || value.trim().length === 0) return 'none'
  return RECOMMENDED_ACTION_SET.has(value) ? (value as CreatorTrustRecommendedAction) : value
}

const resolveCreatorId = (item: BackendCreatorPositiveAnalyticsItem): string | null => {
  const fromCreatorId = toOptionalString(item.creatorId)
  if (fromCreatorId) return fromCreatorId

  const creator = item.creator
  if (!creator || typeof creator !== 'object') return null

  const fromId = toOptionalString(creator.id)
  if (fromId) return fromId
  const fromLegacyId = toOptionalString(creator._id)
  if (fromLegacyId) return fromLegacyId
  return null
}

const mapByType = (
  value:
    | Partial<Record<'article' | 'video' | 'course' | 'live' | 'podcast' | 'book', BackendContentByTypeRow>>
    | undefined,
): AdminCreatorPositiveAnalyticsItem['content']['byType'] => ({
  article: {
    total: toInteger(value?.article?.total, 0),
    published: toInteger(value?.article?.published, 0),
  },
  video: {
    total: toInteger(value?.video?.total, 0),
    published: toInteger(value?.video?.published, 0),
  },
  course: {
    total: toInteger(value?.course?.total, 0),
    published: toInteger(value?.course?.published, 0),
  },
  live: {
    total: toInteger(value?.live?.total, 0),
    published: toInteger(value?.live?.published, 0),
  },
  podcast: {
    total: toInteger(value?.podcast?.total, 0),
    published: toInteger(value?.podcast?.published, 0),
  },
  book: {
    total: toInteger(value?.book?.total, 0),
    published: toInteger(value?.book?.published, 0),
  },
})

const mapItem = (item: BackendCreatorPositiveAnalyticsItem): AdminCreatorPositiveAnalyticsItem | null => {
  const creatorId = resolveCreatorId(item)
  if (!creatorId) return null

  const creator = item.creator ?? {}
  return {
    creatorId,
    creator: {
      id: creatorId,
      name: toString(creator.name),
      username: toString(creator.username),
      email: toString(creator.email),
      avatar: toOptionalString(creator.avatar),
      accountStatus: toAccountStatus(creator.accountStatus),
      followers: toInteger(creator.followers, 0),
      following: toInteger(creator.following, 0),
      createdAt: toIsoDateOrNull(creator.createdAt),
      lastActiveAt: toIsoDateOrNull(creator.lastActiveAt),
    },
    content: {
      total: toInteger(item.content?.total, 0),
      published: toInteger(item.content?.published, 0),
      premiumPublished: toInteger(item.content?.premiumPublished, 0),
      featuredPublished: toInteger(item.content?.featuredPublished, 0),
      byType: mapByType(item.content?.byType),
    },
    growth: {
      windowDays: toInteger(item.growth?.windowDays, 30),
      followsLastWindow: toInteger(item.growth?.followsLastWindow, 0),
      followsPrevWindow: toInteger(item.growth?.followsPrevWindow, 0),
      followsDelta: toInteger(item.growth?.followsDelta, 0),
      followsTrendPercent: toNumber(item.growth?.followsTrendPercent, 0),
      publishedLastWindow: toInteger(item.growth?.publishedLastWindow, 0),
      publishedPrevWindow: toInteger(item.growth?.publishedPrevWindow, 0),
      publishedDelta: toInteger(item.growth?.publishedDelta, 0),
      score: toNumber(item.growth?.score, 0),
    },
    engagement: {
      views: toInteger(item.engagement?.views, 0),
      likes: toInteger(item.engagement?.likes, 0),
      favorites: toInteger(item.engagement?.favorites, 0),
      comments: toInteger(item.engagement?.comments, 0),
      ratingsCount: toInteger(item.engagement?.ratingsCount, 0),
      averageRating: toNumber(item.engagement?.averageRating, 0),
      actionsTotal: toInteger(item.engagement?.actionsTotal, 0),
      actionsPerPublished: toNumber(item.engagement?.actionsPerPublished, 0),
      score: toNumber(item.engagement?.score, 0),
    },
    trust: {
      trustScore: toNumber(item.trust?.trustScore, 100),
      riskLevel: toRiskLevel(item.trust?.riskLevel),
      recommendedAction: toRecommendedAction(item.trust?.recommendedAction),
      openReports: toInteger(item.trust?.openReports, 0),
      highPriorityTargets: toInteger(item.trust?.highPriorityTargets, 0),
      criticalTargets: toInteger(item.trust?.criticalTargets, 0),
      falsePositiveRate30d: toNumber(item.trust?.falsePositiveRate30d, 0),
    },
  }
}

const toQueryParams = (
  query: AdminCreatorPositiveAnalyticsQuery | AdminCreatorPositiveAnalyticsExportQuery,
): Record<string, string | number> => {
  const params: Record<string, string | number> = {}

  if (query.search?.trim()) params.search = query.search.trim()
  if (query.accountStatus) params.accountStatus = query.accountStatus
  if (query.riskLevel) params.riskLevel = query.riskLevel
  if (query.sortBy) params.sortBy = query.sortBy
  if (query.sortOrder) params.sortOrder = query.sortOrder
  if (typeof query.windowDays === 'number' && query.windowDays > 0) params.windowDays = query.windowDays
  if ('page' in query && typeof query.page === 'number' && query.page > 0) params.page = query.page
  if ('limit' in query && typeof query.limit === 'number' && query.limit > 0) params.limit = query.limit
  if ('maxRows' in query && typeof query.maxRows === 'number' && query.maxRows > 0) {
    params.maxRows = query.maxRows
  }

  return params
}

const mapPagination = (
  value?: Partial<AdminCreatorPositiveAnalyticsPagination>,
): AdminCreatorPositiveAnalyticsPagination => ({
  page: Math.max(1, toInteger(value?.page, 1)),
  limit: Math.max(1, toInteger(value?.limit, 25)),
  total: Math.max(0, toInteger(value?.total, 0)),
  pages: Math.max(1, toInteger(value?.pages, 1)),
})

const mapSummary = (value?: Partial<AdminCreatorPositiveAnalyticsSummary>): AdminCreatorPositiveAnalyticsSummary => ({
  totalCreators: Math.max(0, toInteger(value?.totalCreators, 0)),
  avgGrowthScore: toNumber(value?.avgGrowthScore, 0),
  avgEngagementScore: toNumber(value?.avgEngagementScore, 0),
  avgTrustScore: toNumber(value?.avgTrustScore, 0),
})

export const adminCreatorPositiveAnalyticsService = {
  list: async (
    query: AdminCreatorPositiveAnalyticsQuery,
  ): Promise<AdminCreatorPositiveAnalyticsResponse> => {
    const response = await apiClient.get<BackendCreatorPositiveAnalyticsResponse>(
      '/admin/creators/analytics/positive',
      {
        params: toQueryParams(query),
      },
    )

    const data = response.data ?? {}
    const sortBy = toSortBy(data.sort?.sortBy ?? query.sortBy)
    const sortOrder = toSortOrder(data.sort?.sortOrder ?? query.sortOrder)

    return {
      items: Array.isArray(data.items)
        ? data.items.map(mapItem).filter((item): item is AdminCreatorPositiveAnalyticsItem => item !== null)
        : [],
      pagination: mapPagination(data.pagination),
      sort: {
        sortBy,
        sortOrder,
      },
      summary: mapSummary(data.summary),
    }
  },

  exportCsv: async (query: AdminCreatorPositiveAnalyticsExportQuery): Promise<void> => {
    const response = await apiClient.get('/admin/creators/analytics/positive/export.csv', {
      params: toQueryParams(query),
      responseType: 'blob',
    })

    const blob =
      response.data instanceof Blob
        ? response.data
        : new Blob([response.data], { type: 'text/csv;charset=utf-8' })
    const url = window.URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `admin-creators-positive-analytics-${new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/[:T]/g, '-')}.csv`
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    window.URL.revokeObjectURL(url)
  },
}
