import type { AdminActorSummary } from './adminUsers'

export type AdminOperationalAlertType =
  | 'ban_applied'
  | 'content_hide_spike'
  | 'delegated_access_started'

export type AdminOperationalAlertSeverity = 'critical' | 'high' | 'medium'

export interface AdminOperationalAlert {
  id: string
  type: AdminOperationalAlertType
  severity: AdminOperationalAlertSeverity
  title: string
  description: string
  action: string
  resourceType: string
  resourceId?: string
  detectedAt: string
  actor: AdminActorSummary | null
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
  }
  summary: AdminOperationalAlertsSummary
  items: AdminOperationalAlert[]
}
