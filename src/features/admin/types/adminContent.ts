import type { AdminActorSummary, AdminCreatorTrustSignals, AdminPagination } from './adminUsers'

export type AdminContentType =
  | 'article'
  | 'video'
  | 'course'
  | 'live'
  | 'podcast'
  | 'book'
  | 'comment'
  | 'review'
export type AdminContentModerationStatus = 'visible' | 'hidden' | 'restricted'
export type AdminContentPublishStatus = 'draft' | 'published' | 'archived'
export type AdminContentModerationAction = 'hide' | 'unhide' | 'restrict'
export type AdminContentReportPriority = 'none' | 'low' | 'medium' | 'high' | 'critical'
export type AdminContentPolicyAction = 'review' | 'restrict' | 'hide' | 'none'
export type AdminContentAutomatedSeverity = 'none' | 'low' | 'medium' | 'high' | 'critical'
export type AdminContentAutomatedAction = 'review' | 'restrict' | 'hide' | 'none'
export type AdminContentAutomatedRule = 'spam' | 'suspicious_link' | 'flood' | 'mass_creation'
export type AdminContentPolicyProfileKey =
  | 'multi_surface_discovery'
  | 'discussion_comments'
  | 'discussion_reviews'
export type AdminContentJobType = 'bulk_moderate' | 'bulk_rollback'
export type AdminContentJobStatus =
  | 'queued'
  | 'running'
  | 'completed'
  | 'completed_with_errors'
  | 'failed'
export type AdminContentJobApprovalStatus = 'draft' | 'review' | 'approved'

export interface AdminContentReportSignals {
  openReports: number
  uniqueReporters: number
  latestReportAt: string | null
  topReasons: Array<{ reason: string; count: number }>
  priorityScore: number
  priority: AdminContentReportPriority
}

export interface AdminContentPolicySignals {
  recommendedAction: AdminContentPolicyAction
  escalation: 'none' | 'low' | 'medium' | 'high' | 'critical'
  automationEligible: boolean
  automationEnabled: boolean
  automationBlockedReason: string | null
  matchedReasons: string[]
  profile: {
    key: AdminContentPolicyProfileKey
    label: string
    primarySurface: string
    surfaces: string[]
  }
  thresholds: {
    reviewMinPriority: AdminContentReportPriority
    restrictMinPriority: AdminContentReportPriority
    highPriorityHideMinUniqueReporters: number
    highRiskHideMinUniqueReporters: number
    autoHideMinPriority: AdminContentReportPriority
    autoHideMinUniqueReporters: number
    autoHideAllowedReasons: string[]
  }
}

export interface AdminContentAutomatedRuleSignal {
  rule: AdminContentAutomatedRule
  score: number
  severity: AdminContentAutomatedSeverity
  description: string
  metadata?: Record<string, unknown> | null
}

export interface AdminContentAutomatedSignals {
  active: boolean
  status: 'none' | 'active' | 'reviewed' | 'cleared'
  score: number
  severity: AdminContentAutomatedSeverity
  recommendedAction: AdminContentAutomatedAction
  triggerSource: 'create' | 'update' | 'publish' | null
  triggeredRules: AdminContentAutomatedRuleSignal[]
  lastDetectedAt: string | null
  lastEvaluatedAt: string | null
  textSignals: {
    textLength: number
    tokenCount: number
    uniqueTokenRatio: number
    urlCount: number
    suspiciousUrlCount: number
    duplicateUrlCount: number
    repeatedTokenCount: number
    duplicateLineCount: number
  }
  activitySignals: {
    sameSurfaceLast10m: number
    sameSurfaceLast60m: number
    portfolioLast10m: number
    portfolioLast60m: number
  }
  automation: {
    enabled: boolean
    eligible: boolean
    blockedReason: string | null
    attempted: boolean
    executed: boolean
    action: AdminContentModerationAction | null
    lastOutcome: 'success' | 'error' | null
    lastError: string | null
    lastAttemptAt: string | null
  }
}

export interface AdminContentQueueItem {
  id: string
  contentType: AdminContentType
  title: string
  slug: string
  description: string
  category: string
  status: AdminContentPublishStatus
  moderationStatus: AdminContentModerationStatus
  moderationReason: string | null
  moderationNote: string | null
  moderatedAt: string | null
  moderatedBy: AdminActorSummary | null
  creator: AdminActorSummary | null
  createdAt: string | null
  updatedAt: string | null
  reportSignals: AdminContentReportSignals
  automatedSignals: AdminContentAutomatedSignals
  policySignals: AdminContentPolicySignals
  creatorTrustSignals: AdminCreatorTrustSignals | null
}

export interface AdminContentQueueQuery {
  contentType?: AdminContentType
  moderationStatus?: AdminContentModerationStatus
  publishStatus?: AdminContentPublishStatus
  search?: string
  creatorId?: string
  flaggedOnly?: boolean
  minReportPriority?: Exclude<AdminContentReportPriority, 'none'>
  cursor?: string
  page?: number
  limit?: number
}

export interface AdminContentQueueCursor {
  mode: 'offset' | 'cursor'
  current: string | null
  next: string | null
  hasMore: boolean
}

export interface AdminContentQueueResponse {
  items: AdminContentQueueItem[]
  pagination: AdminPagination
  cursor: AdminContentQueueCursor
}

export interface AdminContentModerationActionPayload {
  reason: string
  note?: string
  markFalsePositive?: boolean
}

export interface AdminContentRollbackPayload extends AdminContentModerationActionPayload {
  eventId: string
  confirm?: boolean
}

export interface AdminContentModerationActionResponse {
  message: string
  changed: boolean
  fromStatus: AdminContentModerationStatus
  toStatus: AdminContentModerationStatus
  content: AdminContentQueueItem
}

export interface AdminContentModerationEvent {
  id: string
  contentType: AdminContentType
  contentId: string
  actor: AdminActorSummary | null
  action: AdminContentModerationAction
  fromStatus: AdminContentModerationStatus
  toStatus: AdminContentModerationStatus
  reason: string
  note: string | null
  metadata: Record<string, unknown> | null
  createdAt: string
}

export interface AdminContentModerationHistoryResponse {
  items: AdminContentModerationEvent[]
  pagination: AdminPagination
}

export interface AdminContentRollbackReview {
  action: AdminContentModerationAction
  targetStatus: AdminContentModerationStatus
  currentStatus: AdminContentModerationStatus
  canRollback: boolean
  requiresConfirm: boolean
  falsePositiveEligible: boolean
  warnings: string[]
  blockers: string[]
  guidance: string[]
  checks: {
    isLatestEvent: boolean
    newerEventsCount: number
    currentMatchesEventToStatus: boolean
    openReports: number
    uniqueReporters: number
    automatedSignalActive: boolean
    automatedSeverity: AdminContentAutomatedSeverity
    creatorRiskLevel: 'low' | 'medium' | 'high' | 'critical' | null
  }
}

export interface AdminContentRollbackReviewResponse {
  content: AdminContentQueueItem
  event: AdminContentModerationEvent
  rollback: AdminContentRollbackReview
}

export interface AdminContentRollbackResponse extends AdminContentModerationActionResponse {
  rollback: {
    eventId: string
    action: AdminContentModerationAction
    targetStatus: AdminContentModerationStatus
    requiresConfirm: boolean
    warnings: string[]
    falsePositiveRecorded?: boolean
  }
}

export interface AdminContentJobItem {
  contentType: AdminContentType
  contentId: string
  eventId: string | null
  status: 'pending' | 'success' | 'failed'
  changed?: boolean
  fromStatus?: AdminContentModerationStatus
  toStatus?: AdminContentModerationStatus
  error: string | null
  statusCode: number | null
}

export interface AdminContentJobApprovalSampleItem {
  contentType: AdminContentType
  contentId: string
  eventId: string
  title: string
  targetStatus: AdminContentModerationStatus
  openReports: number
  uniqueReporters: number
  automatedSeverity: AdminContentAutomatedSeverity
  creatorRiskLevel: 'low' | 'medium' | 'high' | 'critical' | null
  requiresConfirm: boolean
  warnings: string[]
}

export interface AdminContentJobApproval {
  required: boolean
  reviewStatus: AdminContentJobApprovalStatus
  reviewNote: string | null
  reviewRequestedAt: string | null
  reviewRequestedBy: AdminActorSummary | null
  approvalNote: string | null
  approvedAt: string | null
  approvedBy: AdminActorSummary | null
  sampleRequired: boolean
  recommendedSampleSize: number
  reviewedSampleKeys: string[]
  sampleItems: AdminContentJobApprovalSampleItem[]
  riskSummary: {
    restoreVisibleCount: number
    activeRiskCount: number
    highRiskCount: number
    criticalRiskCount: number
    falsePositiveEligibleCount: number
  }
  falsePositiveValidationRequired: boolean
  falsePositiveValidated: boolean
}

export interface AdminContentJob {
  id: string
  type: AdminContentJobType
  status: AdminContentJobStatus
  action: AdminContentModerationAction | null
  reason: string
  note: string | null
  confirm: boolean
  markFalsePositive: boolean
  attemptCount: number
  maxAttempts: number
  workerId: string | null
  leaseExpiresAt: string | null
  lastHeartbeatAt: string | null
  scheduledFor: string | null
  actor: AdminActorSummary | null
  items: AdminContentJobItem[]
  progress: {
    requested: number
    processed: number
    succeeded: number
    failed: number
    changed: number
  }
  guardrails: {
    maxItems: number
    confirmThreshold: number
    duplicatesSkipped: number
  } | null
  approval: AdminContentJobApproval | null
  error: string | null
  startedAt: string | null
  finishedAt: string | null
  expiresAt: string | null
  createdAt: string
  updatedAt: string
}

export interface AdminContentJobsResponse {
  items: AdminContentJob[]
  pagination: AdminPagination
}

export interface AdminContentJobWorkerStatus {
  generatedAt: string
  worker: {
    key: 'admin_content_jobs'
    status: 'offline' | 'starting' | 'idle' | 'processing' | 'stopping' | 'stale'
    workerId: string | null
    processId: number | null
    host: string | null
    startedAt: string | null
    stoppedAt: string | null
    lastHeartbeatAt: string | null
    currentJobId: string | null
    currentJobType: AdminContentJobType | null
    currentJobStartedAt: string | null
    lastJobFinishedAt: string | null
    stats: {
      claimedJobs: number
      completedJobs: number
      failedJobs: number
      requeuedJobs: number
    }
    lastError: string | null
    lastErrorAt: string | null
  }
  queue: {
    queued: number
    scheduled: number
    nextScheduledAt: string | null
    awaitingApproval: number
    running: number
    staleRunning: number
    retrying: number
    maxAttemptsReached: number
    failedLast24h: number
  }
  currentJob: AdminContentJob | null
  config: {
    leaseMs: number
    heartbeatMs: number
    staleAfterMs: number
    maxAttempts: number
  }
}

export interface AdminBulkModerationJobPayload extends AdminContentModerationActionPayload {
  action: AdminContentModerationAction
  confirm?: boolean
  scheduledFor?: string
  items: Array<{
    contentType: AdminContentType
    contentId: string
  }>
}

export interface AdminScheduleContentUnhidePayload extends AdminContentModerationActionPayload {
  scheduledFor: string
}

export interface AdminContentJobReviewPayload {
  note?: string
}

export interface AdminContentJobApprovalPayload {
  note?: string
  confirm?: boolean
  falsePositiveValidated?: boolean
  reviewedSampleItems?: Array<{
    contentType: AdminContentType
    contentId: string
    eventId: string
  }>
}

export interface AdminContentJobMutationResponse {
  message: string
  job: AdminContentJob
}

export type AdminBulkModerationJobResponse = AdminContentJobMutationResponse
