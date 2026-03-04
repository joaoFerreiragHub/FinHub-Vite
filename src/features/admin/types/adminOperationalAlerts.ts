import type { AdminActorSummary } from './adminUsers'

export type AdminOperationalAlertType =
  | 'ban_applied'
  | 'surface_disabled'
  | 'content_hide_spike'
  | 'delegated_access_started'
  | 'critical_report_target'
  | 'policy_auto_hide_triggered'
  | 'policy_auto_hide_failed'
  | 'automated_detection_high_risk'
  | 'automated_detection_auto_hide_triggered'
  | 'automated_detection_auto_hide_failed'
  | 'creator_control_applied'

export type AdminOperationalAlertSeverity = 'critical' | 'high' | 'medium'
export type AdminOperationalAlertState = 'open' | 'acknowledged' | 'dismissed'

export interface AdminOperationalAlert {
  id: string
  type: AdminOperationalAlertType
  severity: AdminOperationalAlertSeverity
  state: AdminOperationalAlertState
  title: string
  description: string
  action: string
  resourceType: string
  resourceId?: string
  detectedAt: string
  actor: AdminActorSummary | null
  stateChangedAt?: string
  stateReason?: string
  stateChangedBy?: AdminActorSummary | null
  metadata?: Record<string, unknown>
}

export interface AdminOperationalAlertsSummary {
  critical: number
  high: number
  medium: number
  total: number
}

export interface AdminOperationalAlertsResponse {
  generatedAt: string
  windowHours: number
  thresholds: {
    hideSpikeCount: number
    hideSpikeWindowMinutes: number
    reportPriorityMin: 'high'
    reportMinOpenReports: number
    automatedDetectionSeverityMin: 'high'
    creatorControlRestrictiveActions: string[]
  }
  summary: AdminOperationalAlertsSummary
  stateSummary: {
    open: number
    acknowledged: number
    dismissed: number
    total: number
  }
  items: AdminOperationalAlert[]
}
