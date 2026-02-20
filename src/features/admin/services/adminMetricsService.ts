import { apiClient } from '@/lib/api/client'
import type { UserRole } from '@/features/auth/types'
import type {
  AdminMetricBaseContentType,
  AdminMetricContentType,
  AdminMetricRouteErrors,
  AdminMetricRouteLatency,
  AdminMetricStatusClass,
  AdminMetricsOverview,
} from '../types/adminMetrics'

type BackendMetricsOverview = Partial<AdminMetricsOverview>

const CONTENT_TYPES: AdminMetricContentType[] = [
  'article',
  'video',
  'course',
  'live',
  'podcast',
  'book',
  'comment',
  'review',
]

const BASE_CONTENT_TYPES: AdminMetricBaseContentType[] = [
  'article',
  'video',
  'course',
  'live',
  'podcast',
  'book',
]

const STATUS_CLASSES: AdminMetricStatusClass[] = ['2xx', '3xx', '4xx', '5xx']
const ROLES: UserRole[] = ['visitor', 'free', 'premium', 'creator', 'admin']

const toNumber = (value: unknown, fallback = 0): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback

const toIsoDate = (value: unknown): string => {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return new Date(0).toISOString()
  }

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? new Date(0).toISOString() : date.toISOString()
}

const toString = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback

const normalizeByContentType = (
  raw: unknown,
  baseOnly = false,
): Record<AdminMetricContentType, number> | Record<AdminMetricBaseContentType, number> => {
  const input =
    raw && typeof raw === 'object'
      ? (raw as Record<string, unknown>)
      : ({} as Record<string, unknown>)

  if (baseOnly) {
    const output: Record<AdminMetricBaseContentType, number> = {
      article: 0,
      video: 0,
      course: 0,
      live: 0,
      podcast: 0,
      book: 0,
    }
    for (const type of BASE_CONTENT_TYPES) {
      output[type] = toNumber(input[type], 0)
    }
    return output
  }

  const output: Record<AdminMetricContentType, number> = {
    article: 0,
    video: 0,
    course: 0,
    live: 0,
    podcast: 0,
    book: 0,
    comment: 0,
    review: 0,
  }
  for (const type of CONTENT_TYPES) {
    output[type] = toNumber(input[type], 0)
  }
  return output
}

const normalizeRoleDistribution = (raw: unknown): Record<UserRole, number> => {
  const input =
    raw && typeof raw === 'object'
      ? (raw as Record<string, unknown>)
      : ({} as Record<string, unknown>)
  const output: Record<UserRole, number> = {
    visitor: 0,
    free: 0,
    premium: 0,
    creator: 0,
    admin: 0,
  }

  for (const role of ROLES) {
    output[role] = toNumber(input[role], 0)
  }

  return output
}

const normalizeStatusClassCounts = (raw: unknown): Record<AdminMetricStatusClass, number> => {
  const input =
    raw && typeof raw === 'object'
      ? (raw as Record<string, unknown>)
      : ({} as Record<string, unknown>)
  const output: Record<AdminMetricStatusClass, number> = {
    '2xx': 0,
    '3xx': 0,
    '4xx': 0,
    '5xx': 0,
  }

  for (const statusClass of STATUS_CLASSES) {
    output[statusClass] = toNumber(input[statusClass], 0)
  }

  return output
}

const normalizeRouteLatency = (raw: unknown): AdminMetricRouteLatency[] => {
  if (!Array.isArray(raw)) return []
  return raw
    .map((item): AdminMetricRouteLatency | null => {
      if (!item || typeof item !== 'object') return null
      const record = item as Record<string, unknown>
      return {
        method: toString(record.method, 'GET'),
        route: toString(record.route, '/'),
        requests: toNumber(record.requests, 0),
        avgLatencyMs: toNumber(record.avgLatencyMs, 0),
      }
    })
    .filter((item): item is AdminMetricRouteLatency => item !== null)
}

const normalizeRouteErrors = (raw: unknown): AdminMetricRouteErrors[] => {
  if (!Array.isArray(raw)) return []
  return raw
    .map((item): AdminMetricRouteErrors | null => {
      if (!item || typeof item !== 'object') return null
      const record = item as Record<string, unknown>
      return {
        method: toString(record.method, 'GET'),
        route: toString(record.route, '/'),
        requests: toNumber(record.requests, 0),
        errors5xx: toNumber(record.errors5xx, 0),
        errorRatePercent: toNumber(record.errorRatePercent, 0),
      }
    })
    .filter((item): item is AdminMetricRouteErrors => item !== null)
}

const mapOverview = (raw: BackendMetricsOverview): AdminMetricsOverview => {
  const windows = raw.windows ?? {}
  const usage = raw.usage ?? {}
  const engagement = raw.engagement ?? {}
  const moderation = raw.moderation ?? {}
  const operations = raw.operations ?? {}
  const usageNewUsers = usage.newUsers ?? {}
  const usageRetention = usage.retention ?? {}
  const usageFunnel = usage.funnel30d ?? {}
  const engagementInteractions = engagement.interactions ?? {}
  const engagementBreakdown = engagement.breakdown ?? {}
  const moderationQueue = moderation.queue ?? {}
  const moderationQueueByType = moderationQueue.byType ?? {}
  const moderationActions = moderation.actions ?? {}
  const moderationResolution = moderation.resolution ?? {}
  const moderationRecidivism = moderation.recidivismLast30d ?? {}
  const audit24h = operations.adminAuditLast24h ?? {}

  const breakdownLast24h = engagementBreakdown.last24h ?? {}
  const breakdownLast7d = engagementBreakdown.last7d ?? {}
  const breakdownLast30d = engagementBreakdown.last30d ?? {}
  const contentPublished = engagement.contentPublishedLast7d ?? {}

  return {
    generatedAt: toIsoDate(raw.generatedAt),
    windows: {
      last24hStart: toIsoDate(windows.last24hStart),
      last7dStart: toIsoDate(windows.last7dStart),
      last30dStart: toIsoDate(windows.last30dStart),
    },
    usage: {
      dau: toNumber(usage.dau, 0),
      wau: toNumber(usage.wau, 0),
      mau: toNumber(usage.mau, 0),
      totalUsers: toNumber(usage.totalUsers, 0),
      newUsers: {
        last24h: toNumber(usageNewUsers.last24h, 0),
        last7d: toNumber(usageNewUsers.last7d, 0),
        last30d: toNumber(usageNewUsers.last30d, 0),
      },
      retention: {
        cohortWindowDays: 30,
        activityWindowDays: 7,
        eligibleUsers: toNumber(usageRetention.eligibleUsers, 0),
        retainedUsers: toNumber(usageRetention.retainedUsers, 0),
        retainedRatePercent: toNumber(usageRetention.retainedRatePercent, 0),
      },
      roleDistribution: normalizeRoleDistribution(usage.roleDistribution),
      funnel30d: {
        registered: toNumber(usageFunnel.registered, 0),
        active30d: toNumber(usageFunnel.active30d, 0),
        premiumOrHigher: toNumber(usageFunnel.premiumOrHigher, 0),
        creatorOrAdmin: toNumber(usageFunnel.creatorOrAdmin, 0),
      },
    },
    engagement: {
      interactions: {
        last24h: toNumber(engagementInteractions.last24h, 0),
        last7d: toNumber(engagementInteractions.last7d, 0),
        last30d: toNumber(engagementInteractions.last30d, 0),
      },
      breakdown: {
        last24h: {
          follows: toNumber(breakdownLast24h.follows, 0),
          favorites: toNumber(breakdownLast24h.favorites, 0),
          comments: toNumber(breakdownLast24h.comments, 0),
          reviews: toNumber(breakdownLast24h.reviews, 0),
        },
        last7d: {
          follows: toNumber(breakdownLast7d.follows, 0),
          favorites: toNumber(breakdownLast7d.favorites, 0),
          comments: toNumber(breakdownLast7d.comments, 0),
          reviews: toNumber(breakdownLast7d.reviews, 0),
        },
        last30d: {
          follows: toNumber(breakdownLast30d.follows, 0),
          favorites: toNumber(breakdownLast30d.favorites, 0),
          comments: toNumber(breakdownLast30d.comments, 0),
          reviews: toNumber(breakdownLast30d.reviews, 0),
        },
      },
      contentPublishedLast7d: {
        total: toNumber(contentPublished.total, 0),
        byType: normalizeByContentType(contentPublished.byType, true) as Record<
          AdminMetricBaseContentType,
          number
        >,
      },
    },
    moderation: {
      queue: {
        total: toNumber(moderationQueue.total, 0),
        hidden: toNumber(moderationQueue.hidden, 0),
        restricted: toNumber(moderationQueue.restricted, 0),
        visible: toNumber(moderationQueue.visible, 0),
        byType: {
          total: normalizeByContentType(moderationQueueByType.total, false) as Record<
            AdminMetricContentType,
            number
          >,
          hidden: normalizeByContentType(moderationQueueByType.hidden, false) as Record<
            AdminMetricContentType,
            number
          >,
          restricted: normalizeByContentType(moderationQueueByType.restricted, false) as Record<
            AdminMetricContentType,
            number
          >,
        },
      },
      actions: {
        last24h: toNumber(moderationActions.last24h, 0),
        last7d: toNumber(moderationActions.last7d, 0),
        volumeByTypeLast7d: normalizeByContentType(
          moderationActions.volumeByTypeLast7d,
          false,
        ) as Record<AdminMetricContentType, number>,
      },
      resolution: {
        sampleSize: toNumber(moderationResolution.sampleSize, 0),
        averageHours:
          typeof moderationResolution.averageHours === 'number'
            ? moderationResolution.averageHours
            : null,
        medianHours:
          typeof moderationResolution.medianHours === 'number'
            ? moderationResolution.medianHours
            : null,
      },
      recidivismLast30d: {
        repeatedTargets: toNumber(moderationRecidivism.repeatedTargets, 0),
        repeatedActors: toNumber(moderationRecidivism.repeatedActors, 0),
      },
    },
    operations: {
      source:
        operations.source === 'in_memory_since_process_boot'
          ? 'in_memory_since_process_boot'
          : 'in_memory_since_process_boot',
      snapshotGeneratedAt: toIsoDate(operations.snapshotGeneratedAt),
      processUptimeSeconds: toNumber(operations.processUptimeSeconds, 0),
      mongoReady: Boolean(operations.mongoReady),
      totalRequests: toNumber(operations.totalRequests, 0),
      statusClassCounts: normalizeStatusClassCounts(operations.statusClassCounts),
      errorRatePercent: toNumber(operations.errorRatePercent, 0),
      availabilityPercent: toNumber(operations.availabilityPercent, 0),
      avgLatencyMs: toNumber(operations.avgLatencyMs, 0),
      topSlowRoutes: normalizeRouteLatency(operations.topSlowRoutes),
      topErrorRoutes: normalizeRouteErrors(operations.topErrorRoutes),
      adminAuditLast24h: {
        success: toNumber(audit24h.success, 0),
        forbidden: toNumber(audit24h.forbidden, 0),
        error: toNumber(audit24h.error, 0),
        total: toNumber(audit24h.total, 0),
      },
    },
  }
}

export const adminMetricsService = {
  getOverview: async (): Promise<AdminMetricsOverview> => {
    const response = await apiClient.get<BackendMetricsOverview>('/admin/metrics/overview')
    return mapOverview(response.data ?? {})
  },
}
