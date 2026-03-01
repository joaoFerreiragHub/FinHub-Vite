import type { UserRole } from '@/features/auth/types'
import type { CreatorRiskLevel } from './adminUsers'

export type AdminMetricContentType =
  | 'article'
  | 'video'
  | 'course'
  | 'live'
  | 'podcast'
  | 'book'
  | 'comment'
  | 'review'

export type AdminMetricBaseContentType = Exclude<AdminMetricContentType, 'comment' | 'review'>
export type AdminMetricStatusClass = '2xx' | '3xx' | '4xx' | '5xx'
export type AdminAutomatedModerationRule = 'spam' | 'suspicious_link' | 'flood' | 'mass_creation'
export type AdminContentJobType = 'bulk_moderate' | 'bulk_rollback'
export type AdminContentJobStatus =
  | 'queued'
  | 'running'
  | 'completed'
  | 'completed_with_errors'
  | 'failed'

export interface AdminMetricRouteLatency {
  method: string
  route: string
  requests: number
  avgLatencyMs: number
}

export interface AdminMetricRouteErrors {
  method: string
  route: string
  requests: number
  errors5xx: number
  errorRatePercent: number
}

export interface AdminMetricsOverview {
  generatedAt: string
  windows: {
    last24hStart: string
    last7dStart: string
    last30dStart: string
  }
  usage: {
    dau: number
    wau: number
    mau: number
    totalUsers: number
    newUsers: {
      last24h: number
      last7d: number
      last30d: number
    }
    retention: {
      cohortWindowDays: 30
      activityWindowDays: 7
      eligibleUsers: number
      retainedUsers: number
      retainedRatePercent: number
    }
    roleDistribution: Record<UserRole, number>
    funnel30d: {
      registered: number
      active30d: number
      premiumOrHigher: number
      creatorOrAdmin: number
    }
  }
  engagement: {
    interactions: {
      last24h: number
      last7d: number
      last30d: number
    }
    breakdown: {
      last24h: {
        follows: number
        favorites: number
        comments: number
        reviews: number
      }
      last7d: {
        follows: number
        favorites: number
        comments: number
        reviews: number
      }
      last30d: {
        follows: number
        favorites: number
        comments: number
        reviews: number
      }
    }
    contentPublishedLast7d: {
      total: number
      byType: Record<AdminMetricBaseContentType, number>
    }
  }
  moderation: {
    queue: {
      total: number
      hidden: number
      restricted: number
      visible: number
      byType: {
        total: Record<AdminMetricContentType, number>
        hidden: Record<AdminMetricContentType, number>
        restricted: Record<AdminMetricContentType, number>
      }
    }
    actions: {
      last24h: number
      last7d: number
      volumeByTypeLast7d: Record<AdminMetricContentType, number>
    }
    resolution: {
      sampleSize: number
      averageHours: number | null
      medianHours: number | null
    }
    recidivismLast30d: {
      repeatedTargets: number
      repeatedActors: number
    }
    reports: {
      openTotal: number
      highPriorityTargets: number
      criticalTargets: number
      topReasons: Array<{ reason: string; count: number }>
      intake: {
        last24h: number
        last7d: number
      }
      resolved: {
        last24h: number
        last7d: number
      }
    }
    automation: {
      policyAutoHide: {
        successLast24h: number
        successLast7d: number
        errorLast24h: number
        errorLast7d: number
      }
      automatedDetection: {
        activeSignals: number
        highRiskTargets: number
        criticalTargets: number
        byRule: Record<AdminAutomatedModerationRule, number>
        autoHide: {
          successLast24h: number
          successLast7d: number
          errorLast24h: number
          errorLast7d: number
        }
      }
    }
    creatorControls: {
      active: {
        affectedCreators: number
        creationBlocked: number
        publishingBlocked: number
        cooldownActive: number
        fullyRestricted: number
      }
      actions: {
        last24h: number
        last7d: number
        byActionLast7d: Record<string, number>
      }
    }
    creatorTrust: {
      creatorsEvaluated: number
      needingIntervention: number
      byRiskLevel: Record<CreatorRiskLevel, number>
      falsePositiveEventsLast30d: number
      creatorsWithFalsePositiveHistory: number
    }
    jobs: {
      queued: number
      running: number
      completedLast24h: number
      failedLast24h: number
      byTypeActive: Record<AdminContentJobType, number>
      averageDurationMinutesLast7d: number | null
    }
  }
  operations: {
    source: 'in_memory_since_process_boot'
    snapshotGeneratedAt: string
    processUptimeSeconds: number
    mongoReady: boolean
    totalRequests: number
    statusClassCounts: Record<AdminMetricStatusClass, number>
    errorRatePercent: number
    availabilityPercent: number
    avgLatencyMs: number
    topSlowRoutes: AdminMetricRouteLatency[]
    topErrorRoutes: AdminMetricRouteErrors[]
    adminAuditLast24h: {
      success: number
      forbidden: number
      error: number
      total: number
    }
  }
}

export interface AdminMetricsDrilldown {
  generatedAt: string
  creators: Array<{
    creatorId: string
    name: string
    username: string
    riskLevel: CreatorRiskLevel
    trustScore: number
    recommendedAction: string
    openReports: number
    criticalTargets: number
    activeControls: number
    falsePositiveEvents30d: number
    falsePositiveRate30d: number
  }>
  targets: Array<{
    contentType: AdminMetricContentType
    contentId: string
    title: string
    moderationStatus: string
    reportPriority: string
    openReports: number
    automatedSeverity: string
    creatorRiskLevel: CreatorRiskLevel | null
    surfaceKey: string
    creator: {
      id: string
      name?: string
      username?: string
    } | null
  }>
  surfaces: Array<{
    key: string
    label: string
    enabled: boolean
    impact: string
    affectedFlaggedTargets: number
    affectedCriticalTargets: number
    activeAutomatedSignals: number
    updatedAt: string | null
    publicMessage: string | null
  }>
  jobs: Array<{
    id: string
    type: AdminContentJobType
    status: AdminContentJobStatus
    requested: number
    processed: number
    succeeded: number
    failed: number
    createdAt: string
    startedAt: string | null
    finishedAt: string | null
    actor: {
      id: string
      name?: string
      username?: string
    } | null
  }>
}
