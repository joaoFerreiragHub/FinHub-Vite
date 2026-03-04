import { apiClient } from '@/lib/api/client'
import type {
  AdminActorSummary,
  AdminCreatorTrustSignals,
  AdminPagination,
} from '../types/adminUsers'
import type {
  AdminContentAutomatedSignals,
  AdminBulkModerationJobPayload,
  AdminBulkModerationJobResponse,
  AdminContentJob,
  AdminContentJobApprovalPayload,
  AdminContentJobMutationResponse,
  AdminContentJobReviewPayload,
  AdminContentJobWorkerStatus,
  AdminContentJobsResponse,
  AdminContentModerationActionPayload,
  AdminContentModerationActionResponse,
  AdminContentModerationEvent,
  AdminContentModerationHistoryResponse,
  AdminContentRollbackPayload,
  AdminContentRollbackResponse,
  AdminContentRollbackReviewResponse,
  AdminContentPolicySignals,
  AdminContentModerationStatus,
  AdminContentPublishStatus,
  AdminContentQueueItem,
  AdminContentQueueCursor,
  AdminContentQueueQuery,
  AdminContentReportPriority,
  AdminContentReportSignals,
  AdminContentQueueResponse,
  AdminContentType,
} from '../types/adminContent'

interface BackendActorSummary {
  id?: string
  _id?: string
  name?: string
  username?: string
  email?: string
  role?: string
}

interface BackendContentQueueItem {
  id?: string
  _id?: string
  contentType?: string
  title?: string
  slug?: string
  description?: string
  category?: string
  status?: string
  moderationStatus?: string
  moderationReason?: string | null
  moderationNote?: string | null
  moderatedAt?: string | null
  moderatedBy?: BackendActorSummary | null
  creator?: BackendActorSummary | null
  createdAt?: string | null
  updatedAt?: string | null
  reportSignals?: {
    openReports?: number
    uniqueReporters?: number
    latestReportAt?: string | null
    topReasons?: Array<{ reason?: string; count?: number }>
    priorityScore?: number
    priority?: string
  }
  policySignals?: {
    recommendedAction?: string
    escalation?: string
    automationEligible?: boolean
    automationEnabled?: boolean
    automationBlockedReason?: string | null
    matchedReasons?: string[]
    profile?: {
      key?: string
      label?: string
      primarySurface?: string
      surfaces?: string[]
    }
    thresholds?: {
      reviewMinPriority?: string
      restrictMinPriority?: string
      highPriorityHideMinUniqueReporters?: number
      highRiskHideMinUniqueReporters?: number
      autoHideMinPriority?: string
      autoHideMinUniqueReporters?: number
      autoHideAllowedReasons?: string[]
    }
  }
  automatedSignals?: {
    active?: boolean
    status?: string
    score?: number
    severity?: string
    recommendedAction?: string
    triggerSource?: string | null
    triggeredRules?: Array<{
      rule?: string
      score?: number
      severity?: string
      description?: string
      metadata?: Record<string, unknown> | null
    }>
    lastDetectedAt?: string | null
    lastEvaluatedAt?: string | null
    textSignals?: {
      textLength?: number
      tokenCount?: number
      uniqueTokenRatio?: number
      urlCount?: number
      suspiciousUrlCount?: number
      duplicateUrlCount?: number
      repeatedTokenCount?: number
      duplicateLineCount?: number
    }
    activitySignals?: {
      sameSurfaceLast10m?: number
      sameSurfaceLast60m?: number
      portfolioLast10m?: number
      portfolioLast60m?: number
    }
    automation?: {
      enabled?: boolean
      eligible?: boolean
      blockedReason?: string | null
      attempted?: boolean
      executed?: boolean
      action?: string | null
      lastOutcome?: 'success' | 'error' | null
      lastError?: string | null
      lastAttemptAt?: string | null
    }
  }
  creatorTrustSignals?: {
    trustScore?: number
    riskLevel?: string
    recommendedAction?: string
    generatedAt?: string
    summary?: {
      openReports?: number
      highPriorityTargets?: number
      criticalTargets?: number
      hiddenItems?: number
      restrictedItems?: number
      recentModerationActions30d?: number
      repeatModerationTargets30d?: number
      recentCreatorControlActions30d?: number
      falsePositiveEvents30d?: number
      automatedFalsePositiveEvents30d?: number
      falsePositiveRate30d?: number
      falsePositiveCompensationScore30d?: number
      dominantFalsePositiveCategory30d?: string | null
      dominantAutomatedFalsePositiveRule30d?: string | null
      falsePositiveCategoryBreakdown30d?: {
        reports?: number
        policy_auto_hide?: number
        automated_detection?: number
        manual_moderation?: number
      }
      automatedFalsePositiveRuleBreakdown30d?: {
        spam?: number
        suspicious_link?: number
        flood?: number
        mass_creation?: number
      }
      activeControlFlags?: string[]
    }
    flags?: string[]
    reasons?: string[]
  } | null
}

interface BackendContentQueueResponse {
  items?: BackendContentQueueItem[]
  pagination?: Partial<AdminPagination>
  cursor?: {
    mode?: 'offset' | 'cursor'
    current?: string | null
    next?: string | null
    hasMore?: boolean
  }
}

interface BackendModerationEvent {
  id?: string
  _id?: string
  contentType?: string
  contentId?: string
  actor?: BackendActorSummary | null
  action?: string
  fromStatus?: string
  toStatus?: string
  reason?: string
  note?: string | null
  metadata?: Record<string, unknown> | null
  createdAt?: string
}

interface BackendModerationHistoryResponse {
  items?: BackendModerationEvent[]
  pagination?: Partial<AdminPagination>
}

interface BackendModerationActionResponse {
  message?: string
  changed?: boolean
  fromStatus?: string
  toStatus?: string
  content?: BackendContentQueueItem
}

interface BackendRollbackReviewResponse {
  content?: BackendContentQueueItem
  event?: BackendModerationEvent
  rollback?: {
    action?: string
    targetStatus?: string
    currentStatus?: string
    canRollback?: boolean
    requiresConfirm?: boolean
    falsePositiveEligible?: boolean
    warnings?: string[]
    blockers?: string[]
    guidance?: string[]
    checks?: {
      isLatestEvent?: boolean
      newerEventsCount?: number
      currentMatchesEventToStatus?: boolean
      openReports?: number
      uniqueReporters?: number
      automatedSignalActive?: boolean
      automatedSeverity?: string
      creatorRiskLevel?: string | null
    }
  }
}

interface BackendRollbackActionResponse extends BackendModerationActionResponse {
  rollback?: {
    eventId?: string
    action?: string
    targetStatus?: string
    requiresConfirm?: boolean
    warnings?: string[]
    falsePositiveRecorded?: boolean
  }
}

interface BackendJobItem {
  contentType?: string
  contentId?: string
  eventId?: string | null
  status?: string
  changed?: boolean
  fromStatus?: string
  toStatus?: string
  error?: string | null
  statusCode?: number | null
}

interface BackendJobRecord {
  id?: string
  _id?: string
  type?: string
  status?: string
  action?: string | null
  reason?: string
  note?: string | null
  confirm?: boolean
  markFalsePositive?: boolean
  attemptCount?: number
  maxAttempts?: number
  workerId?: string | null
  leaseExpiresAt?: string | null
  lastHeartbeatAt?: string | null
  actor?: BackendActorSummary | null
  items?: BackendJobItem[]
  progress?: {
    requested?: number
    processed?: number
    succeeded?: number
    failed?: number
    changed?: number
  }
  guardrails?: {
    maxItems?: number
    confirmThreshold?: number
    duplicatesSkipped?: number
  } | null
  approval?: {
    required?: boolean
    reviewStatus?: string
    reviewNote?: string | null
    reviewRequestedAt?: string | null
    reviewRequestedBy?: BackendActorSummary | null
    approvalNote?: string | null
    approvedAt?: string | null
    approvedBy?: BackendActorSummary | null
    sampleRequired?: boolean
    recommendedSampleSize?: number
    reviewedSampleKeys?: string[]
    sampleItems?: Array<{
      contentType?: string
      contentId?: string
      eventId?: string
      title?: string
      targetStatus?: string
      openReports?: number
      uniqueReporters?: number
      automatedSeverity?: string
      creatorRiskLevel?: string | null
      requiresConfirm?: boolean
      warnings?: string[]
    }>
    riskSummary?: {
      restoreVisibleCount?: number
      activeRiskCount?: number
      highRiskCount?: number
      criticalRiskCount?: number
      falsePositiveEligibleCount?: number
    }
    falsePositiveValidationRequired?: boolean
    falsePositiveValidated?: boolean
  } | null
  error?: string | null
  startedAt?: string | null
  finishedAt?: string | null
  createdAt?: string
  updatedAt?: string
}

interface BackendJobsResponse {
  items?: BackendJobRecord[]
  pagination?: Partial<AdminPagination>
}

interface BackendJobMutationResponse {
  message?: string
  job?: BackendJobRecord
}

interface BackendJobWorkerStatusResponse {
  generatedAt?: string
  worker?: {
    key?: string
    status?: string
    workerId?: string | null
    processId?: number | null
    host?: string | null
    startedAt?: string | null
    stoppedAt?: string | null
    lastHeartbeatAt?: string | null
    currentJobId?: string | null
    currentJobType?: string | null
    currentJobStartedAt?: string | null
    lastJobFinishedAt?: string | null
    stats?: {
      claimedJobs?: number
      completedJobs?: number
      failedJobs?: number
      requeuedJobs?: number
    }
    lastError?: string | null
    lastErrorAt?: string | null
  }
  queue?: {
    queued?: number
    awaitingApproval?: number
    running?: number
    staleRunning?: number
    retrying?: number
    maxAttemptsReached?: number
    failedLast24h?: number
  }
  currentJob?: BackendJobRecord | null
  config?: {
    leaseMs?: number
    heartbeatMs?: number
    staleAfterMs?: number
    maxAttempts?: number
  }
}

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 25

const resolveId = (value: unknown): string | null => {
  if (typeof value === 'string' && value.length > 0) return value
  if (value && typeof value === 'object') {
    const maybeId = (value as { id?: unknown; _id?: unknown }).id
    if (typeof maybeId === 'string' && maybeId.length > 0) return maybeId

    const maybeObjectId = (value as { _id?: unknown })._id
    if (typeof maybeObjectId === 'string' && maybeObjectId.length > 0) return maybeObjectId
  }

  return null
}

const toContentType = (value: string | undefined): AdminContentType | null => {
  if (value === 'article') return 'article'
  if (value === 'video') return 'video'
  if (value === 'course') return 'course'
  if (value === 'live') return 'live'
  if (value === 'podcast') return 'podcast'
  if (value === 'book') return 'book'
  if (value === 'comment') return 'comment'
  if (value === 'review') return 'review'
  return null
}

const toModerationStatus = (value: string | undefined): AdminContentModerationStatus => {
  if (value === 'hidden') return 'hidden'
  if (value === 'restricted') return 'restricted'
  return 'visible'
}

const toPublishStatus = (value: string | undefined): AdminContentPublishStatus => {
  if (value === 'draft') return 'draft'
  if (value === 'archived') return 'archived'
  return 'published'
}

const toIsoDate = (value: unknown): string | null => {
  if (typeof value !== 'string' || value.trim().length === 0) return null
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString()
}

const toReportPriority = (value: unknown): AdminContentReportPriority => {
  if (value === 'critical') return 'critical'
  if (value === 'high') return 'high'
  if (value === 'medium') return 'medium'
  if (value === 'low') return 'low'
  return 'none'
}

const toAutomatedSeverity = (value: unknown): AdminContentAutomatedSignals['severity'] => {
  if (value === 'critical') return 'critical'
  if (value === 'high') return 'high'
  if (value === 'medium') return 'medium'
  if (value === 'low') return 'low'
  return 'none'
}

const mapAutomatedSignals = (
  input?: BackendContentQueueItem['automatedSignals'],
): AdminContentAutomatedSignals => ({
  active: Boolean(input?.active),
  status:
    input?.status === 'active' || input?.status === 'reviewed' || input?.status === 'cleared'
      ? input.status
      : 'none',
  score: typeof input?.score === 'number' ? input.score : 0,
  severity: toAutomatedSeverity(input?.severity),
  recommendedAction:
    input?.recommendedAction === 'review' ||
    input?.recommendedAction === 'restrict' ||
    input?.recommendedAction === 'hide'
      ? input.recommendedAction
      : 'none',
  triggerSource:
    input?.triggerSource === 'create' ||
    input?.triggerSource === 'update' ||
    input?.triggerSource === 'publish'
      ? input.triggerSource
      : null,
  triggeredRules: Array.isArray(input?.triggeredRules)
    ? input.triggeredRules
        .map((rule) => {
          if (
            !rule ||
            typeof rule !== 'object' ||
            (rule.rule !== 'spam' &&
              rule.rule !== 'suspicious_link' &&
              rule.rule !== 'flood' &&
              rule.rule !== 'mass_creation')
          ) {
            return null
          }

          return {
            rule: rule.rule,
            score: typeof rule.score === 'number' ? rule.score : 0,
            severity: toAutomatedSeverity(rule.severity),
            description: typeof rule.description === 'string' ? rule.description : '',
            metadata:
              rule.metadata && typeof rule.metadata === 'object'
                ? (rule.metadata as Record<string, unknown>)
                : null,
          }
        })
        .filter(
          (rule): rule is AdminContentAutomatedSignals['triggeredRules'][number] => rule !== null,
        )
    : [],
  lastDetectedAt: toIsoDate(input?.lastDetectedAt) ?? null,
  lastEvaluatedAt: toIsoDate(input?.lastEvaluatedAt) ?? null,
  textSignals: {
    textLength:
      typeof input?.textSignals?.textLength === 'number' ? input.textSignals.textLength : 0,
    tokenCount:
      typeof input?.textSignals?.tokenCount === 'number' ? input.textSignals.tokenCount : 0,
    uniqueTokenRatio:
      typeof input?.textSignals?.uniqueTokenRatio === 'number'
        ? input.textSignals.uniqueTokenRatio
        : 0,
    urlCount: typeof input?.textSignals?.urlCount === 'number' ? input.textSignals.urlCount : 0,
    suspiciousUrlCount:
      typeof input?.textSignals?.suspiciousUrlCount === 'number'
        ? input.textSignals.suspiciousUrlCount
        : 0,
    duplicateUrlCount:
      typeof input?.textSignals?.duplicateUrlCount === 'number'
        ? input.textSignals.duplicateUrlCount
        : 0,
    repeatedTokenCount:
      typeof input?.textSignals?.repeatedTokenCount === 'number'
        ? input.textSignals.repeatedTokenCount
        : 0,
    duplicateLineCount:
      typeof input?.textSignals?.duplicateLineCount === 'number'
        ? input.textSignals.duplicateLineCount
        : 0,
  },
  activitySignals: {
    sameSurfaceLast10m:
      typeof input?.activitySignals?.sameSurfaceLast10m === 'number'
        ? input.activitySignals.sameSurfaceLast10m
        : 0,
    sameSurfaceLast60m:
      typeof input?.activitySignals?.sameSurfaceLast60m === 'number'
        ? input.activitySignals.sameSurfaceLast60m
        : 0,
    portfolioLast10m:
      typeof input?.activitySignals?.portfolioLast10m === 'number'
        ? input.activitySignals.portfolioLast10m
        : 0,
    portfolioLast60m:
      typeof input?.activitySignals?.portfolioLast60m === 'number'
        ? input.activitySignals.portfolioLast60m
        : 0,
  },
  automation: {
    enabled: Boolean(input?.automation?.enabled),
    eligible: Boolean(input?.automation?.eligible),
    blockedReason:
      typeof input?.automation?.blockedReason === 'string' ? input.automation.blockedReason : null,
    attempted: Boolean(input?.automation?.attempted),
    executed: Boolean(input?.automation?.executed),
    action:
      input?.automation?.action === 'hide' ||
      input?.automation?.action === 'unhide' ||
      input?.automation?.action === 'restrict'
        ? input.automation.action
        : null,
    lastOutcome:
      input?.automation?.lastOutcome === 'success' || input?.automation?.lastOutcome === 'error'
        ? input.automation.lastOutcome
        : null,
    lastError: typeof input?.automation?.lastError === 'string' ? input.automation.lastError : null,
    lastAttemptAt: toIsoDate(input?.automation?.lastAttemptAt) ?? null,
  },
})

const mapTrustSignals = (
  signals?: BackendContentQueueItem['creatorTrustSignals'],
): AdminCreatorTrustSignals | null => {
  if (!signals || typeof signals !== 'object') return null

  return {
    trustScore: typeof signals.trustScore === 'number' ? signals.trustScore : 100,
    riskLevel:
      signals.riskLevel === 'critical'
        ? 'critical'
        : signals.riskLevel === 'high'
          ? 'high'
          : signals.riskLevel === 'medium'
            ? 'medium'
            : 'low',
    recommendedAction:
      signals.recommendedAction === 'review' ||
      signals.recommendedAction === 'set_cooldown' ||
      signals.recommendedAction === 'block_publishing' ||
      signals.recommendedAction === 'suspend_creator_ops'
        ? signals.recommendedAction
        : 'none',
    generatedAt: toIsoDate(signals.generatedAt) ?? new Date(0).toISOString(),
    summary: {
      openReports:
        typeof signals.summary?.openReports === 'number' ? signals.summary.openReports : 0,
      highPriorityTargets:
        typeof signals.summary?.highPriorityTargets === 'number'
          ? signals.summary.highPriorityTargets
          : 0,
      criticalTargets:
        typeof signals.summary?.criticalTargets === 'number' ? signals.summary.criticalTargets : 0,
      hiddenItems:
        typeof signals.summary?.hiddenItems === 'number' ? signals.summary.hiddenItems : 0,
      restrictedItems:
        typeof signals.summary?.restrictedItems === 'number' ? signals.summary.restrictedItems : 0,
      recentModerationActions30d:
        typeof signals.summary?.recentModerationActions30d === 'number'
          ? signals.summary.recentModerationActions30d
          : 0,
      repeatModerationTargets30d:
        typeof signals.summary?.repeatModerationTargets30d === 'number'
          ? signals.summary.repeatModerationTargets30d
          : 0,
      recentCreatorControlActions30d:
        typeof signals.summary?.recentCreatorControlActions30d === 'number'
          ? signals.summary.recentCreatorControlActions30d
          : 0,
      falsePositiveEvents30d:
        typeof signals.summary?.falsePositiveEvents30d === 'number'
          ? signals.summary.falsePositiveEvents30d
          : 0,
      automatedFalsePositiveEvents30d:
        typeof signals.summary?.automatedFalsePositiveEvents30d === 'number'
          ? signals.summary.automatedFalsePositiveEvents30d
          : 0,
      falsePositiveRate30d:
        typeof signals.summary?.falsePositiveRate30d === 'number'
          ? signals.summary.falsePositiveRate30d
          : 0,
      falsePositiveCompensationScore30d:
        typeof signals.summary?.falsePositiveCompensationScore30d === 'number'
          ? signals.summary.falsePositiveCompensationScore30d
          : 0,
      dominantFalsePositiveCategory30d:
        signals.summary?.dominantFalsePositiveCategory30d === 'reports' ||
        signals.summary?.dominantFalsePositiveCategory30d === 'policy_auto_hide' ||
        signals.summary?.dominantFalsePositiveCategory30d === 'automated_detection' ||
        signals.summary?.dominantFalsePositiveCategory30d === 'manual_moderation'
          ? signals.summary.dominantFalsePositiveCategory30d
          : null,
      dominantAutomatedFalsePositiveRule30d:
        signals.summary?.dominantAutomatedFalsePositiveRule30d === 'spam' ||
        signals.summary?.dominantAutomatedFalsePositiveRule30d === 'suspicious_link' ||
        signals.summary?.dominantAutomatedFalsePositiveRule30d === 'flood' ||
        signals.summary?.dominantAutomatedFalsePositiveRule30d === 'mass_creation'
          ? signals.summary.dominantAutomatedFalsePositiveRule30d
          : null,
      falsePositiveCategoryBreakdown30d: {
        reports:
          typeof signals.summary?.falsePositiveCategoryBreakdown30d?.reports === 'number'
            ? signals.summary.falsePositiveCategoryBreakdown30d.reports
            : 0,
        policy_auto_hide:
          typeof signals.summary?.falsePositiveCategoryBreakdown30d?.policy_auto_hide === 'number'
            ? signals.summary.falsePositiveCategoryBreakdown30d.policy_auto_hide
            : 0,
        automated_detection:
          typeof signals.summary?.falsePositiveCategoryBreakdown30d?.automated_detection ===
          'number'
            ? signals.summary.falsePositiveCategoryBreakdown30d.automated_detection
            : 0,
        manual_moderation:
          typeof signals.summary?.falsePositiveCategoryBreakdown30d?.manual_moderation === 'number'
            ? signals.summary.falsePositiveCategoryBreakdown30d.manual_moderation
            : 0,
      },
      automatedFalsePositiveRuleBreakdown30d: {
        spam:
          typeof signals.summary?.automatedFalsePositiveRuleBreakdown30d?.spam === 'number'
            ? signals.summary.automatedFalsePositiveRuleBreakdown30d.spam
            : 0,
        suspicious_link:
          typeof signals.summary?.automatedFalsePositiveRuleBreakdown30d?.suspicious_link ===
          'number'
            ? signals.summary.automatedFalsePositiveRuleBreakdown30d.suspicious_link
            : 0,
        flood:
          typeof signals.summary?.automatedFalsePositiveRuleBreakdown30d?.flood === 'number'
            ? signals.summary.automatedFalsePositiveRuleBreakdown30d.flood
            : 0,
        mass_creation:
          typeof signals.summary?.automatedFalsePositiveRuleBreakdown30d?.mass_creation === 'number'
            ? signals.summary.automatedFalsePositiveRuleBreakdown30d.mass_creation
            : 0,
      },
      activeControlFlags: Array.isArray(signals.summary?.activeControlFlags)
        ? signals.summary.activeControlFlags.filter(
            (item): item is string => typeof item === 'string',
          )
        : [],
    },
    flags: Array.isArray(signals.flags)
      ? signals.flags.filter((item): item is string => typeof item === 'string')
      : [],
    reasons: Array.isArray(signals.reasons)
      ? signals.reasons.filter((item): item is string => typeof item === 'string')
      : [],
  }
}

const toAction = (value: string | undefined): 'hide' | 'unhide' | 'restrict' | null => {
  if (value === 'hide') return 'hide'
  if (value === 'unhide') return 'unhide'
  if (value === 'restrict') return 'restrict'
  return null
}

const mapActor = (actor?: BackendActorSummary | null): AdminActorSummary | null => {
  if (!actor) return null

  const id = resolveId(actor)
  if (!id) return null

  return {
    id,
    name: actor.name,
    username: actor.username,
    email: actor.email,
    role:
      actor.role === 'visitor' ||
      actor.role === 'free' ||
      actor.role === 'premium' ||
      actor.role === 'creator' ||
      actor.role === 'admin'
        ? actor.role
        : undefined,
  }
}

const mapReportSignals = (
  input?: BackendContentQueueItem['reportSignals'],
): AdminContentReportSignals => ({
  openReports: typeof input?.openReports === 'number' ? input.openReports : 0,
  uniqueReporters: typeof input?.uniqueReporters === 'number' ? input.uniqueReporters : 0,
  latestReportAt: toIsoDate(input?.latestReportAt) ?? null,
  topReasons: Array.isArray(input?.topReasons)
    ? input.topReasons
        .map((item) =>
          typeof item?.reason === 'string' && typeof item?.count === 'number'
            ? { reason: item.reason, count: item.count }
            : null,
        )
        .filter((item): item is { reason: string; count: number } => item !== null)
    : [],
  priorityScore: typeof input?.priorityScore === 'number' ? input.priorityScore : 0,
  priority: toReportPriority(input?.priority),
})

const mapPolicySignals = (
  input?: BackendContentQueueItem['policySignals'],
): AdminContentPolicySignals => ({
  recommendedAction:
    input?.recommendedAction === 'review' ||
    input?.recommendedAction === 'restrict' ||
    input?.recommendedAction === 'hide'
      ? input.recommendedAction
      : 'none',
  escalation:
    input?.escalation === 'critical'
      ? 'critical'
      : input?.escalation === 'high'
        ? 'high'
        : input?.escalation === 'medium'
          ? 'medium'
          : input?.escalation === 'low'
            ? 'low'
            : 'none',
  automationEligible: Boolean(input?.automationEligible),
  automationEnabled: Boolean(input?.automationEnabled),
  automationBlockedReason:
    typeof input?.automationBlockedReason === 'string' ? input.automationBlockedReason : null,
  matchedReasons: Array.isArray(input?.matchedReasons)
    ? input.matchedReasons.filter((item): item is string => typeof item === 'string')
    : [],
  profile: {
    key:
      input?.profile?.key === 'discussion_comments' || input?.profile?.key === 'discussion_reviews'
        ? input.profile.key
        : 'multi_surface_discovery',
    label: typeof input?.profile?.label === 'string' ? input.profile.label : 'Policy profile',
    primarySurface:
      typeof input?.profile?.primarySurface === 'string'
        ? input.profile.primarySurface
        : 'editorial_home',
    surfaces: Array.isArray(input?.profile?.surfaces)
      ? input.profile.surfaces.filter((item): item is string => typeof item === 'string')
      : [],
  },
  thresholds: {
    reviewMinPriority: toReportPriority(input?.thresholds?.reviewMinPriority),
    restrictMinPriority: toReportPriority(input?.thresholds?.restrictMinPriority),
    highPriorityHideMinUniqueReporters:
      typeof input?.thresholds?.highPriorityHideMinUniqueReporters === 'number'
        ? input.thresholds.highPriorityHideMinUniqueReporters
        : 0,
    highRiskHideMinUniqueReporters:
      typeof input?.thresholds?.highRiskHideMinUniqueReporters === 'number'
        ? input.thresholds.highRiskHideMinUniqueReporters
        : 0,
    autoHideMinPriority: toReportPriority(input?.thresholds?.autoHideMinPriority),
    autoHideMinUniqueReporters:
      typeof input?.thresholds?.autoHideMinUniqueReporters === 'number'
        ? input.thresholds.autoHideMinUniqueReporters
        : 0,
    autoHideAllowedReasons: Array.isArray(input?.thresholds?.autoHideAllowedReasons)
      ? input.thresholds.autoHideAllowedReasons.filter(
          (item): item is string => typeof item === 'string',
        )
      : [],
  },
})

const normalizePagination = (pagination?: Partial<AdminPagination>): AdminPagination => {
  return {
    page: pagination?.page && pagination.page > 0 ? pagination.page : DEFAULT_PAGE,
    limit: pagination?.limit && pagination.limit > 0 ? pagination.limit : DEFAULT_LIMIT,
    total: pagination?.total && pagination.total >= 0 ? pagination.total : 0,
    pages: pagination?.pages && pagination.pages > 0 ? pagination.pages : 1,
  }
}

const normalizeQueueCursor = (
  cursor?: BackendContentQueueResponse['cursor'],
): AdminContentQueueCursor => ({
  mode: cursor?.mode === 'cursor' ? 'cursor' : 'offset',
  current: typeof cursor?.current === 'string' ? cursor.current : null,
  next: typeof cursor?.next === 'string' ? cursor.next : null,
  hasMore: Boolean(cursor?.hasMore),
})

const toJobType = (value: unknown): AdminContentJob['type'] =>
  value === 'bulk_rollback' ? 'bulk_rollback' : 'bulk_moderate'

const toJobStatus = (value: unknown): AdminContentJob['status'] => {
  if (value === 'running') return 'running'
  if (value === 'completed') return 'completed'
  if (value === 'completed_with_errors') return 'completed_with_errors'
  if (value === 'failed') return 'failed'
  return 'queued'
}

const toJobApprovalStatus = (value: unknown): 'draft' | 'review' | 'approved' => {
  if (value === 'review') return 'review'
  if (value === 'approved') return 'approved'
  return 'draft'
}

const mapJob = (item: BackendJobRecord): AdminContentJob | null => {
  const id = resolveId(item)
  if (!id) return null

  return {
    id,
    type: toJobType(item.type),
    status: toJobStatus(item.status),
    action: toAction(item.action) ?? null,
    reason: typeof item.reason === 'string' ? item.reason : '',
    note: typeof item.note === 'string' ? item.note : null,
    confirm: Boolean(item.confirm),
    markFalsePositive: Boolean(item.markFalsePositive),
    attemptCount: typeof item.attemptCount === 'number' ? item.attemptCount : 0,
    maxAttempts: typeof item.maxAttempts === 'number' ? item.maxAttempts : 3,
    workerId: typeof item.workerId === 'string' ? item.workerId : null,
    leaseExpiresAt: toIsoDate(item.leaseExpiresAt) ?? null,
    lastHeartbeatAt: toIsoDate(item.lastHeartbeatAt) ?? null,
    actor: mapActor(item.actor),
    items: Array.isArray(item.items)
      ? item.items
          .map((jobItem) => {
            const contentType = toContentType(jobItem.contentType)
            if (!contentType || typeof jobItem.contentId !== 'string') return null

            return {
              contentType,
              contentId: jobItem.contentId,
              eventId: typeof jobItem.eventId === 'string' ? jobItem.eventId : null,
              status:
                jobItem.status === 'success' || jobItem.status === 'failed'
                  ? jobItem.status
                  : 'pending',
              changed: typeof jobItem.changed === 'boolean' ? jobItem.changed : undefined,
              fromStatus:
                typeof jobItem.fromStatus === 'string'
                  ? toModerationStatus(jobItem.fromStatus)
                  : undefined,
              toStatus:
                typeof jobItem.toStatus === 'string'
                  ? toModerationStatus(jobItem.toStatus)
                  : undefined,
              error: typeof jobItem.error === 'string' ? jobItem.error : null,
              statusCode: typeof jobItem.statusCode === 'number' ? jobItem.statusCode : null,
            }
          })
          .filter((jobItem): jobItem is AdminContentJob['items'][number] => jobItem !== null)
      : [],
    progress: {
      requested: typeof item.progress?.requested === 'number' ? item.progress.requested : 0,
      processed: typeof item.progress?.processed === 'number' ? item.progress.processed : 0,
      succeeded: typeof item.progress?.succeeded === 'number' ? item.progress.succeeded : 0,
      failed: typeof item.progress?.failed === 'number' ? item.progress.failed : 0,
      changed: typeof item.progress?.changed === 'number' ? item.progress.changed : 0,
    },
    guardrails: item.guardrails
      ? {
          maxItems:
            typeof item.guardrails.maxItems === 'number' ? item.guardrails.maxItems : DEFAULT_LIMIT,
          confirmThreshold:
            typeof item.guardrails.confirmThreshold === 'number'
              ? item.guardrails.confirmThreshold
              : 10,
          duplicatesSkipped:
            typeof item.guardrails.duplicatesSkipped === 'number'
              ? item.guardrails.duplicatesSkipped
              : 0,
        }
      : null,
    approval:
      item.approval && toJobType(item.type) === 'bulk_rollback'
        ? {
            required: Boolean(item.approval.required),
            reviewStatus: toJobApprovalStatus(item.approval.reviewStatus),
            reviewNote:
              typeof item.approval.reviewNote === 'string' ? item.approval.reviewNote : null,
            reviewRequestedAt: toIsoDate(item.approval.reviewRequestedAt) ?? null,
            reviewRequestedBy: mapActor(item.approval.reviewRequestedBy),
            approvalNote:
              typeof item.approval.approvalNote === 'string' ? item.approval.approvalNote : null,
            approvedAt: toIsoDate(item.approval.approvedAt) ?? null,
            approvedBy: mapActor(item.approval.approvedBy),
            sampleRequired: Boolean(item.approval.sampleRequired),
            recommendedSampleSize:
              typeof item.approval.recommendedSampleSize === 'number'
                ? item.approval.recommendedSampleSize
                : 0,
            reviewedSampleKeys: Array.isArray(item.approval.reviewedSampleKeys)
              ? item.approval.reviewedSampleKeys.filter(
                  (sampleKey): sampleKey is string => typeof sampleKey === 'string',
                )
              : [],
            sampleItems: Array.isArray(item.approval.sampleItems)
              ? item.approval.sampleItems
                  .map((sampleItem) => {
                    const contentType = toContentType(sampleItem.contentType)
                    if (
                      !contentType ||
                      typeof sampleItem.contentId !== 'string' ||
                      typeof sampleItem.eventId !== 'string'
                    ) {
                      return null
                    }

                    return {
                      contentType,
                      contentId: sampleItem.contentId,
                      eventId: sampleItem.eventId,
                      title:
                        typeof sampleItem.title === 'string'
                          ? sampleItem.title
                          : `${contentType}:${sampleItem.contentId}`,
                      targetStatus: toModerationStatus(sampleItem.targetStatus),
                      openReports:
                        typeof sampleItem.openReports === 'number' ? sampleItem.openReports : 0,
                      uniqueReporters:
                        typeof sampleItem.uniqueReporters === 'number'
                          ? sampleItem.uniqueReporters
                          : 0,
                      automatedSeverity: toAutomatedSeverity(sampleItem.automatedSeverity),
                      creatorRiskLevel:
                        sampleItem.creatorRiskLevel === 'critical'
                          ? 'critical'
                          : sampleItem.creatorRiskLevel === 'high'
                            ? 'high'
                            : sampleItem.creatorRiskLevel === 'medium'
                              ? 'medium'
                              : sampleItem.creatorRiskLevel === 'low'
                                ? 'low'
                                : null,
                      requiresConfirm: Boolean(sampleItem.requiresConfirm),
                      warnings: Array.isArray(sampleItem.warnings)
                        ? sampleItem.warnings.filter(
                            (warning): warning is string => typeof warning === 'string',
                          )
                        : [],
                    }
                  })
                  .filter(
                    (
                      sampleItem,
                    ): sampleItem is NonNullable<
                      AdminContentJob['approval']
                    >['sampleItems'][number] => sampleItem !== null,
                  )
              : [],
            riskSummary: {
              restoreVisibleCount:
                typeof item.approval.riskSummary?.restoreVisibleCount === 'number'
                  ? item.approval.riskSummary.restoreVisibleCount
                  : 0,
              activeRiskCount:
                typeof item.approval.riskSummary?.activeRiskCount === 'number'
                  ? item.approval.riskSummary.activeRiskCount
                  : 0,
              highRiskCount:
                typeof item.approval.riskSummary?.highRiskCount === 'number'
                  ? item.approval.riskSummary.highRiskCount
                  : 0,
              criticalRiskCount:
                typeof item.approval.riskSummary?.criticalRiskCount === 'number'
                  ? item.approval.riskSummary.criticalRiskCount
                  : 0,
              falsePositiveEligibleCount:
                typeof item.approval.riskSummary?.falsePositiveEligibleCount === 'number'
                  ? item.approval.riskSummary.falsePositiveEligibleCount
                  : 0,
            },
            falsePositiveValidationRequired: Boolean(item.approval.falsePositiveValidationRequired),
            falsePositiveValidated: Boolean(item.approval.falsePositiveValidated),
          }
        : null,
    error: typeof item.error === 'string' ? item.error : null,
    startedAt: toIsoDate(item.startedAt) ?? null,
    finishedAt: toIsoDate(item.finishedAt) ?? null,
    createdAt: toIsoDate(item.createdAt) ?? new Date(0).toISOString(),
    updatedAt: toIsoDate(item.updatedAt) ?? new Date(0).toISOString(),
  }
}

const mapJobWorkerStatus = (data: BackendJobWorkerStatusResponse): AdminContentJobWorkerStatus => ({
  generatedAt: toIsoDate(data.generatedAt) ?? new Date(0).toISOString(),
  worker: {
    key: data.worker?.key === 'admin_content_jobs' ? 'admin_content_jobs' : 'admin_content_jobs',
    status:
      data.worker?.status === 'starting' ||
      data.worker?.status === 'idle' ||
      data.worker?.status === 'processing' ||
      data.worker?.status === 'stopping' ||
      data.worker?.status === 'offline' ||
      data.worker?.status === 'stale'
        ? data.worker.status
        : 'offline',
    workerId: typeof data.worker?.workerId === 'string' ? data.worker.workerId : null,
    processId: typeof data.worker?.processId === 'number' ? data.worker.processId : null,
    host: typeof data.worker?.host === 'string' ? data.worker.host : null,
    startedAt: toIsoDate(data.worker?.startedAt) ?? null,
    stoppedAt: toIsoDate(data.worker?.stoppedAt) ?? null,
    lastHeartbeatAt: toIsoDate(data.worker?.lastHeartbeatAt) ?? null,
    currentJobId: typeof data.worker?.currentJobId === 'string' ? data.worker.currentJobId : null,
    currentJobType:
      data.worker?.currentJobType === 'bulk_rollback'
        ? 'bulk_rollback'
        : data.worker?.currentJobType === 'bulk_moderate'
          ? 'bulk_moderate'
          : null,
    currentJobStartedAt: toIsoDate(data.worker?.currentJobStartedAt) ?? null,
    lastJobFinishedAt: toIsoDate(data.worker?.lastJobFinishedAt) ?? null,
    stats: {
      claimedJobs:
        typeof data.worker?.stats?.claimedJobs === 'number' ? data.worker.stats.claimedJobs : 0,
      completedJobs:
        typeof data.worker?.stats?.completedJobs === 'number' ? data.worker.stats.completedJobs : 0,
      failedJobs:
        typeof data.worker?.stats?.failedJobs === 'number' ? data.worker.stats.failedJobs : 0,
      requeuedJobs:
        typeof data.worker?.stats?.requeuedJobs === 'number' ? data.worker.stats.requeuedJobs : 0,
    },
    lastError: typeof data.worker?.lastError === 'string' ? data.worker.lastError : null,
    lastErrorAt: toIsoDate(data.worker?.lastErrorAt) ?? null,
  },
  queue: {
    queued: typeof data.queue?.queued === 'number' ? data.queue.queued : 0,
    awaitingApproval:
      typeof data.queue?.awaitingApproval === 'number' ? data.queue.awaitingApproval : 0,
    running: typeof data.queue?.running === 'number' ? data.queue.running : 0,
    staleRunning: typeof data.queue?.staleRunning === 'number' ? data.queue.staleRunning : 0,
    retrying: typeof data.queue?.retrying === 'number' ? data.queue.retrying : 0,
    maxAttemptsReached:
      typeof data.queue?.maxAttemptsReached === 'number' ? data.queue.maxAttemptsReached : 0,
    failedLast24h: typeof data.queue?.failedLast24h === 'number' ? data.queue.failedLast24h : 0,
  },
  currentJob: data.currentJob ? mapJob(data.currentJob) : null,
  config: {
    leaseMs: typeof data.config?.leaseMs === 'number' ? data.config.leaseMs : 0,
    heartbeatMs: typeof data.config?.heartbeatMs === 'number' ? data.config.heartbeatMs : 0,
    staleAfterMs: typeof data.config?.staleAfterMs === 'number' ? data.config.staleAfterMs : 0,
    maxAttempts: typeof data.config?.maxAttempts === 'number' ? data.config.maxAttempts : 0,
  },
})

const mapQueueItem = (item: BackendContentQueueItem): AdminContentQueueItem | null => {
  const id = resolveId(item)
  const contentType = toContentType(item.contentType)

  if (!id || !contentType) return null

  return {
    id,
    contentType,
    title: item.title ?? '',
    slug: item.slug ?? '',
    description: item.description ?? '',
    category: item.category ?? '',
    status: toPublishStatus(item.status),
    moderationStatus: toModerationStatus(item.moderationStatus),
    moderationReason: item.moderationReason ?? null,
    moderationNote: item.moderationNote ?? null,
    moderatedAt: toIsoDate(item.moderatedAt) ?? null,
    moderatedBy: mapActor(item.moderatedBy),
    creator: mapActor(item.creator),
    createdAt: toIsoDate(item.createdAt) ?? null,
    updatedAt: toIsoDate(item.updatedAt) ?? null,
    reportSignals: mapReportSignals(item.reportSignals),
    automatedSignals: mapAutomatedSignals(item.automatedSignals),
    policySignals: mapPolicySignals(item.policySignals),
    creatorTrustSignals: mapTrustSignals(item.creatorTrustSignals),
  }
}

const mapEvent = (item: BackendModerationEvent): AdminContentModerationEvent | null => {
  const id = resolveId(item)
  const contentType = toContentType(item.contentType)
  const action = toAction(item.action)
  if (!id || !contentType || !action || !item.contentId || !item.reason || !item.createdAt) {
    return null
  }

  return {
    id,
    contentType,
    contentId: item.contentId,
    actor: mapActor(item.actor),
    action,
    fromStatus: toModerationStatus(item.fromStatus),
    toStatus: toModerationStatus(item.toStatus),
    reason: item.reason,
    note: item.note ?? null,
    metadata: item.metadata ?? null,
    createdAt: item.createdAt,
  }
}

const buildQueueParams = (query: AdminContentQueueQuery): Record<string, string | number> => {
  const params: Record<string, string | number> = {}

  if (query.contentType) params.contentType = query.contentType
  if (query.moderationStatus) params.moderationStatus = query.moderationStatus
  if (query.publishStatus) params.publishStatus = query.publishStatus
  if (query.search && query.search.trim().length > 0) params.search = query.search.trim()
  if (query.creatorId && query.creatorId.trim().length > 0)
    params.creatorId = query.creatorId.trim()
  if (query.flaggedOnly) params.flaggedOnly = 'true'
  if (query.minReportPriority) params.minReportPriority = query.minReportPriority
  if (query.cursor && query.cursor.trim().length > 0) params.cursor = query.cursor.trim()
  if (typeof query.page === 'number' && query.page > 0) params.page = query.page
  if (typeof query.limit === 'number' && query.limit > 0) params.limit = query.limit

  return params
}

const mapActionResponse = (
  data: BackendModerationActionResponse,
): AdminContentModerationActionResponse => {
  const content = data.content ? mapQueueItem(data.content) : null
  if (!content) {
    throw new Error('Resposta admin invalida: conteudo em falta.')
  }

  return {
    message: data.message ?? 'Acao executada com sucesso.',
    changed: Boolean(data.changed),
    fromStatus: toModerationStatus(data.fromStatus),
    toStatus: toModerationStatus(data.toStatus),
    content,
  }
}

const mapRollbackReviewResponse = (
  data: BackendRollbackReviewResponse,
): AdminContentRollbackReviewResponse => {
  const content = data.content ? mapQueueItem(data.content) : null
  const event = data.event ? mapEvent(data.event) : null

  if (!content || !event) {
    throw new Error('Resposta admin invalida: rollback review incompleto.')
  }

  return {
    content,
    event,
    rollback: {
      action: toAction(data.rollback?.action) ?? 'unhide',
      targetStatus: toModerationStatus(data.rollback?.targetStatus),
      currentStatus: toModerationStatus(data.rollback?.currentStatus),
      canRollback: Boolean(data.rollback?.canRollback),
      requiresConfirm: Boolean(data.rollback?.requiresConfirm),
      falsePositiveEligible: Boolean(data.rollback?.falsePositiveEligible),
      warnings: Array.isArray(data.rollback?.warnings)
        ? data.rollback.warnings.filter((item): item is string => typeof item === 'string')
        : [],
      blockers: Array.isArray(data.rollback?.blockers)
        ? data.rollback.blockers.filter((item): item is string => typeof item === 'string')
        : [],
      guidance: Array.isArray(data.rollback?.guidance)
        ? data.rollback.guidance.filter((item): item is string => typeof item === 'string')
        : [],
      checks: {
        isLatestEvent: Boolean(data.rollback?.checks?.isLatestEvent),
        newerEventsCount:
          typeof data.rollback?.checks?.newerEventsCount === 'number'
            ? data.rollback.checks.newerEventsCount
            : 0,
        currentMatchesEventToStatus: Boolean(data.rollback?.checks?.currentMatchesEventToStatus),
        openReports:
          typeof data.rollback?.checks?.openReports === 'number'
            ? data.rollback.checks.openReports
            : 0,
        uniqueReporters:
          typeof data.rollback?.checks?.uniqueReporters === 'number'
            ? data.rollback.checks.uniqueReporters
            : 0,
        automatedSignalActive: Boolean(data.rollback?.checks?.automatedSignalActive),
        automatedSeverity: toAutomatedSeverity(data.rollback?.checks?.automatedSeverity),
        creatorRiskLevel:
          data.rollback?.checks?.creatorRiskLevel === 'critical'
            ? 'critical'
            : data.rollback?.checks?.creatorRiskLevel === 'high'
              ? 'high'
              : data.rollback?.checks?.creatorRiskLevel === 'medium'
                ? 'medium'
                : data.rollback?.checks?.creatorRiskLevel === 'low'
                  ? 'low'
                  : null,
      },
    },
  }
}

const mapRollbackActionResponse = (
  data: BackendRollbackActionResponse,
): AdminContentRollbackResponse => ({
  ...mapActionResponse(data),
  rollback: {
    eventId: typeof data.rollback?.eventId === 'string' ? data.rollback.eventId : '',
    action: toAction(data.rollback?.action) ?? 'unhide',
    targetStatus: toModerationStatus(data.rollback?.targetStatus),
    requiresConfirm: Boolean(data.rollback?.requiresConfirm),
    warnings: Array.isArray(data.rollback?.warnings)
      ? data.rollback.warnings.filter((item): item is string => typeof item === 'string')
      : [],
    falsePositiveRecorded: Boolean(data.rollback?.falsePositiveRecorded),
  },
})

const postModerationAction = async (
  contentType: AdminContentType,
  contentId: string,
  action: 'hide' | 'unhide' | 'restrict',
  payload: AdminContentModerationActionPayload,
): Promise<AdminContentModerationActionResponse> => {
  const response = await apiClient.post<BackendModerationActionResponse>(
    `/admin/content/${contentType}/${contentId}/${action}`,
    payload,
  )
  return mapActionResponse(response.data)
}

export const adminContentService = {
  listQueue: async (query: AdminContentQueueQuery = {}): Promise<AdminContentQueueResponse> => {
    const response = await apiClient.get<BackendContentQueueResponse>('/admin/content/queue', {
      params: buildQueueParams(query),
    })

    const items = (response.data.items ?? [])
      .map(mapQueueItem)
      .filter((item): item is AdminContentQueueItem => item !== null)

    return {
      items,
      pagination: normalizePagination(response.data.pagination),
      cursor: normalizeQueueCursor(response.data.cursor),
    }
  },

  getContentModerationHistory: async (
    contentType: AdminContentType,
    contentId: string,
    page = 1,
    limit = 10,
  ): Promise<AdminContentModerationHistoryResponse> => {
    const response = await apiClient.get<BackendModerationHistoryResponse>(
      `/admin/content/${contentType}/${contentId}/history`,
      {
        params: { page, limit },
      },
    )

    const items = (response.data.items ?? [])
      .map(mapEvent)
      .filter((item): item is AdminContentModerationEvent => item !== null)

    return {
      items,
      pagination: normalizePagination(response.data.pagination),
    }
  },

  getContentRollbackReview: async (
    contentType: AdminContentType,
    contentId: string,
    eventId: string,
  ): Promise<AdminContentRollbackReviewResponse> => {
    const response = await apiClient.get<BackendRollbackReviewResponse>(
      `/admin/content/${contentType}/${contentId}/rollback-review`,
      {
        params: { eventId },
      },
    )

    return mapRollbackReviewResponse(response.data)
  },

  hideContent: async (
    contentType: AdminContentType,
    contentId: string,
    payload: AdminContentModerationActionPayload,
  ): Promise<AdminContentModerationActionResponse> =>
    postModerationAction(contentType, contentId, 'hide', payload),

  unhideContent: async (
    contentType: AdminContentType,
    contentId: string,
    payload: AdminContentModerationActionPayload,
  ): Promise<AdminContentModerationActionResponse> =>
    postModerationAction(contentType, contentId, 'unhide', payload),

  restrictContent: async (
    contentType: AdminContentType,
    contentId: string,
    payload: AdminContentModerationActionPayload,
  ): Promise<AdminContentModerationActionResponse> =>
    postModerationAction(contentType, contentId, 'restrict', payload),

  rollbackContent: async (
    contentType: AdminContentType,
    contentId: string,
    payload: AdminContentRollbackPayload,
  ): Promise<AdminContentRollbackResponse> => {
    const response = await apiClient.post<BackendRollbackActionResponse>(
      `/admin/content/${contentType}/${contentId}/rollback`,
      payload,
    )

    return mapRollbackActionResponse(response.data)
  },

  listJobs: async (
    query: {
      page?: number
      limit?: number
      type?: AdminContentJob['type']
      status?: AdminContentJob['status']
    } = {},
  ): Promise<AdminContentJobsResponse> => {
    const response = await apiClient.get<BackendJobsResponse>('/admin/content/jobs', {
      params: query,
    })

    return {
      items: (response.data.items ?? [])
        .map(mapJob)
        .filter((item): item is AdminContentJob => item !== null),
      pagination: normalizePagination(response.data.pagination),
    }
  },

  getWorkerStatus: async (): Promise<AdminContentJobWorkerStatus> => {
    const response = await apiClient.get<BackendJobWorkerStatusResponse>(
      '/admin/content/jobs/worker-status',
    )

    return mapJobWorkerStatus(response.data)
  },

  createBulkModerationJob: async (
    payload: AdminBulkModerationJobPayload,
  ): Promise<AdminBulkModerationJobResponse> => {
    const response = await apiClient.post<BackendJobMutationResponse>(
      '/admin/content/bulk-moderate/jobs',
      payload,
    )

    const job = response.data.job ? mapJob(response.data.job) : null
    if (!job) {
      throw new Error('Resposta admin invalida: job em falta.')
    }

    return {
      message: response.data.message ?? 'Job criado com sucesso.',
      job,
    }
  },

  requestBulkRollbackJobReview: async (
    jobId: string,
    payload: AdminContentJobReviewPayload,
  ): Promise<AdminContentJobMutationResponse> => {
    const response = await apiClient.post<BackendJobMutationResponse>(
      `/admin/content/jobs/${jobId}/request-review`,
      payload,
    )

    const job = response.data.job ? mapJob(response.data.job) : null
    if (!job) {
      throw new Error('Resposta admin invalida: job em falta.')
    }

    return {
      message: response.data.message ?? 'Job submetido para revisao.',
      job,
    }
  },

  approveBulkRollbackJob: async (
    jobId: string,
    payload: AdminContentJobApprovalPayload,
  ): Promise<AdminContentJobMutationResponse> => {
    const response = await apiClient.post<BackendJobMutationResponse>(
      `/admin/content/jobs/${jobId}/approve`,
      payload,
    )

    const job = response.data.job ? mapJob(response.data.job) : null
    if (!job) {
      throw new Error('Resposta admin invalida: job em falta.')
    }

    return {
      message: response.data.message ?? 'Job aprovado com sucesso.',
      job,
    }
  },
}
