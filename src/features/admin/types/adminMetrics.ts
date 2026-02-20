import type { UserRole } from '@/features/auth/types'

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
