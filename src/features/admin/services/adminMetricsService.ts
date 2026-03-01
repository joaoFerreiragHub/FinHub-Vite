import { apiClient } from '@/lib/api/client'
import type { UserRole } from '@/features/auth/types'
import type {
  AdminAutomatedModerationRule,
  AdminContentJobStatus,
  AdminContentJobType,
  AdminMetricBaseContentType,
  AdminMetricContentType,
  AdminMetricRouteErrors,
  AdminMetricRouteLatency,
  AdminMetricStatusClass,
  AdminMetricsDrilldown,
  AdminMetricsOverview,
} from '../types/adminMetrics'
import type { CreatorRiskLevel } from '../types/adminUsers'

type BackendMetricsOverview = Partial<AdminMetricsOverview>
type BackendMetricsDrilldown = Partial<AdminMetricsDrilldown>

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
const CREATOR_RISK_LEVELS: CreatorRiskLevel[] = ['low', 'medium', 'high', 'critical']
const AUTOMATED_MODERATION_RULES: AdminAutomatedModerationRule[] = [
  'spam',
  'suspicious_link',
  'flood',
  'mass_creation',
]
const JOB_TYPES: AdminContentJobType[] = ['bulk_moderate', 'bulk_rollback']

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

const normalizeCreatorRiskLevels = (raw: unknown): Record<CreatorRiskLevel, number> => {
  const input =
    raw && typeof raw === 'object'
      ? (raw as Record<string, unknown>)
      : ({} as Record<string, unknown>)
  const output: Record<CreatorRiskLevel, number> = {
    low: 0,
    medium: 0,
    high: 0,
    critical: 0,
  }

  for (const level of CREATOR_RISK_LEVELS) {
    output[level] = toNumber(input[level], 0)
  }

  return output
}

const normalizeAutomatedRuleCounts = (
  raw: unknown,
): Record<AdminAutomatedModerationRule, number> => {
  const input =
    raw && typeof raw === 'object'
      ? (raw as Record<string, unknown>)
      : ({} as Record<string, unknown>)
  const output: Record<AdminAutomatedModerationRule, number> = {
    spam: 0,
    suspicious_link: 0,
    flood: 0,
    mass_creation: 0,
  }

  for (const rule of AUTOMATED_MODERATION_RULES) {
    output[rule] = toNumber(input[rule], 0)
  }

  return output
}

const normalizeJobTypeCounts = (raw: unknown): Record<AdminContentJobType, number> => {
  const input =
    raw && typeof raw === 'object'
      ? (raw as Record<string, unknown>)
      : ({} as Record<string, unknown>)
  const output: Record<AdminContentJobType, number> = {
    bulk_moderate: 0,
    bulk_rollback: 0,
  }

  for (const jobType of JOB_TYPES) {
    output[jobType] = toNumber(input[jobType], 0)
  }

  return output
}

const toJobStatus = (value: unknown): AdminContentJobStatus => {
  if (value === 'running') return 'running'
  if (value === 'completed') return 'completed'
  if (value === 'completed_with_errors') return 'completed_with_errors'
  if (value === 'failed') return 'failed'
  return 'queued'
}

const toJobType = (value: unknown): AdminContentJobType =>
  value === 'bulk_rollback' ? 'bulk_rollback' : 'bulk_moderate'

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
  const moderationReports = moderation.reports ?? {}
  const moderationAutomation = moderation.automation ?? {}
  const moderationPolicyAutoHide = moderationAutomation.policyAutoHide ?? {}
  const moderationAutomatedDetection = moderationAutomation.automatedDetection ?? {}
  const moderationCreatorControls = moderation.creatorControls ?? {}
  const moderationCreatorControlsActive = moderationCreatorControls.active ?? {}
  const moderationCreatorControlsActions = moderationCreatorControls.actions ?? {}
  const moderationCreatorTrust = moderation.creatorTrust ?? {}
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
      reports: {
        openTotal: toNumber(moderationReports.openTotal, 0),
        highPriorityTargets: toNumber(moderationReports.highPriorityTargets, 0),
        criticalTargets: toNumber(moderationReports.criticalTargets, 0),
        topReasons: Array.isArray(moderationReports.topReasons)
          ? moderationReports.topReasons
              .map((item) => {
                if (!item || typeof item !== 'object') return null
                const record = item as Record<string, unknown>
                return typeof record.reason === 'string' && typeof record.count === 'number'
                  ? { reason: record.reason, count: record.count }
                  : null
              })
              .filter((item): item is { reason: string; count: number } => item !== null)
          : [],
        intake: {
          last24h: toNumber((moderationReports.intake ?? {}).last24h, 0),
          last7d: toNumber((moderationReports.intake ?? {}).last7d, 0),
        },
        resolved: {
          last24h: toNumber((moderationReports.resolved ?? {}).last24h, 0),
          last7d: toNumber((moderationReports.resolved ?? {}).last7d, 0),
        },
      },
      automation: {
        policyAutoHide: {
          successLast24h: toNumber(moderationPolicyAutoHide.successLast24h, 0),
          successLast7d: toNumber(moderationPolicyAutoHide.successLast7d, 0),
          errorLast24h: toNumber(moderationPolicyAutoHide.errorLast24h, 0),
          errorLast7d: toNumber(moderationPolicyAutoHide.errorLast7d, 0),
        },
        automatedDetection: {
          activeSignals: toNumber(moderationAutomatedDetection.activeSignals, 0),
          highRiskTargets: toNumber(moderationAutomatedDetection.highRiskTargets, 0),
          criticalTargets: toNumber(moderationAutomatedDetection.criticalTargets, 0),
          byRule: normalizeAutomatedRuleCounts(moderationAutomatedDetection.byRule),
          autoHide: {
            successLast24h: toNumber(
              (moderationAutomatedDetection.autoHide ?? {}).successLast24h,
              0,
            ),
            successLast7d: toNumber((moderationAutomatedDetection.autoHide ?? {}).successLast7d, 0),
            errorLast24h: toNumber((moderationAutomatedDetection.autoHide ?? {}).errorLast24h, 0),
            errorLast7d: toNumber((moderationAutomatedDetection.autoHide ?? {}).errorLast7d, 0),
          },
        },
      },
      creatorControls: {
        active: {
          affectedCreators: toNumber(moderationCreatorControlsActive.affectedCreators, 0),
          creationBlocked: toNumber(moderationCreatorControlsActive.creationBlocked, 0),
          publishingBlocked: toNumber(moderationCreatorControlsActive.publishingBlocked, 0),
          cooldownActive: toNumber(moderationCreatorControlsActive.cooldownActive, 0),
          fullyRestricted: toNumber(moderationCreatorControlsActive.fullyRestricted, 0),
        },
        actions: {
          last24h: toNumber(moderationCreatorControlsActions.last24h, 0),
          last7d: toNumber(moderationCreatorControlsActions.last7d, 0),
          byActionLast7d:
            moderationCreatorControlsActions.byActionLast7d &&
            typeof moderationCreatorControlsActions.byActionLast7d === 'object'
              ? Object.fromEntries(
                  Object.entries(
                    moderationCreatorControlsActions.byActionLast7d as Record<string, unknown>,
                  ).map(([key, value]) => [key, toNumber(value, 0)]),
                )
              : {},
        },
      },
      creatorTrust: {
        creatorsEvaluated: toNumber(moderationCreatorTrust.creatorsEvaluated, 0),
        needingIntervention: toNumber(moderationCreatorTrust.needingIntervention, 0),
        byRiskLevel: normalizeCreatorRiskLevels(moderationCreatorTrust.byRiskLevel),
        falsePositiveEventsLast30d: toNumber(moderationCreatorTrust.falsePositiveEventsLast30d, 0),
        creatorsWithFalsePositiveHistory: toNumber(
          moderationCreatorTrust.creatorsWithFalsePositiveHistory,
          0,
        ),
      },
      jobs: {
        queued: toNumber((moderation.jobs ?? {}).queued, 0),
        running: toNumber((moderation.jobs ?? {}).running, 0),
        completedLast24h: toNumber((moderation.jobs ?? {}).completedLast24h, 0),
        failedLast24h: toNumber((moderation.jobs ?? {}).failedLast24h, 0),
        byTypeActive: normalizeJobTypeCounts((moderation.jobs ?? {}).byTypeActive),
        averageDurationMinutesLast7d:
          typeof (moderation.jobs ?? {}).averageDurationMinutesLast7d === 'number'
            ? ((moderation.jobs ?? {}).averageDurationMinutesLast7d ?? null)
            : null,
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

const mapDrilldown = (raw: BackendMetricsDrilldown): AdminMetricsDrilldown => ({
  generatedAt: toIsoDate(raw.generatedAt),
  creators: Array.isArray(raw.creators)
    ? raw.creators
        .map((item) => {
          if (!item || typeof item !== 'object') return null
          const record = item as Record<string, unknown>
          return {
            creatorId: toString(record.creatorId),
            name: toString(record.name, 'Creator'),
            username: toString(record.username, ''),
            riskLevel:
              record.riskLevel === 'critical'
                ? 'critical'
                : record.riskLevel === 'high'
                  ? 'high'
                  : record.riskLevel === 'medium'
                    ? 'medium'
                    : 'low',
            trustScore: toNumber(record.trustScore, 100),
            recommendedAction: toString(record.recommendedAction, 'none'),
            openReports: toNumber(record.openReports, 0),
            criticalTargets: toNumber(record.criticalTargets, 0),
            activeControls: toNumber(record.activeControls, 0),
            falsePositiveEvents30d: toNumber(record.falsePositiveEvents30d, 0),
            falsePositiveRate30d: toNumber(record.falsePositiveRate30d, 0),
          }
        })
        .filter((item): item is AdminMetricsDrilldown['creators'][number] => item !== null)
    : [],
  targets: Array.isArray(raw.targets)
    ? raw.targets
        .map((item) => {
          if (!item || typeof item !== 'object') return null
          const record = item as Record<string, unknown>
          const contentType = record.contentType
          return contentType === 'article' ||
            contentType === 'video' ||
            contentType === 'course' ||
            contentType === 'live' ||
            contentType === 'podcast' ||
            contentType === 'book' ||
            contentType === 'comment' ||
            contentType === 'review'
            ? {
                contentType,
                contentId: toString(record.contentId),
                title: toString(record.title, ''),
                moderationStatus: toString(record.moderationStatus, 'visible'),
                reportPriority: toString(record.reportPriority, 'none'),
                openReports: toNumber(record.openReports, 0),
                automatedSeverity: toString(record.automatedSeverity, 'none'),
                creatorRiskLevel:
                  record.creatorRiskLevel === 'critical' ||
                  record.creatorRiskLevel === 'high' ||
                  record.creatorRiskLevel === 'medium' ||
                  record.creatorRiskLevel === 'low'
                    ? record.creatorRiskLevel
                    : null,
                surfaceKey: toString(record.surfaceKey),
                creator:
                  record.creator && typeof record.creator === 'object'
                    ? {
                        id: toString((record.creator as Record<string, unknown>).id),
                        name: toString((record.creator as Record<string, unknown>).name, ''),
                        username: toString(
                          (record.creator as Record<string, unknown>).username,
                          '',
                        ),
                      }
                    : null,
              }
            : null
        })
        .filter((item): item is AdminMetricsDrilldown['targets'][number] => item !== null)
    : [],
  surfaces: Array.isArray(raw.surfaces)
    ? raw.surfaces
        .map((item) => {
          if (!item || typeof item !== 'object') return null
          const record = item as Record<string, unknown>
          return {
            key: toString(record.key),
            label: toString(record.label, ''),
            enabled: Boolean(record.enabled),
            impact: toString(record.impact, 'read'),
            affectedFlaggedTargets: toNumber(record.affectedFlaggedTargets, 0),
            affectedCriticalTargets: toNumber(record.affectedCriticalTargets, 0),
            activeAutomatedSignals: toNumber(record.activeAutomatedSignals, 0),
            updatedAt: toIsoDate(record.updatedAt) ?? null,
            publicMessage: typeof record.publicMessage === 'string' ? record.publicMessage : null,
          }
        })
        .filter((item): item is AdminMetricsDrilldown['surfaces'][number] => item !== null)
    : [],
  jobs: Array.isArray(raw.jobs)
    ? raw.jobs
        .map((item) => {
          if (!item || typeof item !== 'object') return null
          const record = item as Record<string, unknown>
          return {
            id: toString(record.id),
            type: toJobType(record.type),
            status: toJobStatus(record.status),
            requested: toNumber(record.requested, 0),
            processed: toNumber(record.processed, 0),
            succeeded: toNumber(record.succeeded, 0),
            failed: toNumber(record.failed, 0),
            createdAt: toIsoDate(record.createdAt),
            startedAt: toIsoDate(record.startedAt) ?? null,
            finishedAt: toIsoDate(record.finishedAt) ?? null,
            actor:
              record.actor && typeof record.actor === 'object'
                ? {
                    id: toString((record.actor as Record<string, unknown>).id),
                    name: toString((record.actor as Record<string, unknown>).name, ''),
                    username: toString((record.actor as Record<string, unknown>).username, ''),
                  }
                : null,
          }
        })
        .filter((item): item is AdminMetricsDrilldown['jobs'][number] => item !== null)
    : [],
})

export const adminMetricsService = {
  getOverview: async (): Promise<AdminMetricsOverview> => {
    const response = await apiClient.get<BackendMetricsOverview>('/admin/metrics/overview')
    return mapOverview(response.data ?? {})
  },

  getDrilldown: async (limit = 6): Promise<AdminMetricsDrilldown> => {
    const response = await apiClient.get<BackendMetricsDrilldown>('/admin/metrics/drilldown', {
      params: { limit },
    })
    return mapDrilldown(response.data ?? {})
  },
}
