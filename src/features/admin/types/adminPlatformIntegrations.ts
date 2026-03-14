import type { AdminActorSummary } from './adminUsers'

export type AdminPlatformIntegrationKey =
  | 'analytics_posthog'
  | 'analytics_google_analytics'
  | 'analytics_google_tag_manager'
  | 'analytics_meta_pixel'
  | 'captcha_client'
  | 'seo_defaults'

export type AdminPlatformIntegrationCategory = 'analytics' | 'security' | 'seo'
export type AdminPlatformIntegrationHealthStatus = 'ok' | 'warning' | 'error'

export interface AdminPlatformIntegrationHealth {
  status: AdminPlatformIntegrationHealthStatus
  summary: string
  issues: string[]
  checkedAt: string | null
}

export interface AdminPlatformIntegrationItem {
  key: AdminPlatformIntegrationKey
  label: string
  description: string
  category: AdminPlatformIntegrationCategory
  enabled: boolean
  config: Record<string, unknown>
  historyCount: number
  health: AdminPlatformIntegrationHealth
  reason: string | null
  note: string | null
  updatedAt: string | null
  updatedBy: AdminActorSummary | null
}

export interface AdminPlatformIntegrationsResponse {
  generatedAt: string
  items: AdminPlatformIntegrationItem[]
}

export interface AdminPlatformIntegrationUpdatePayload {
  enabled?: boolean
  config?: Record<string, unknown>
  reason: string
  note?: string
}

export interface AdminPlatformIntegrationUpdateResponse {
  message: string
  item: AdminPlatformIntegrationItem
}

export interface AdminPlatformIntegrationRollbackPayload {
  reason: string
  note?: string
}

export interface AdminPlatformIntegrationRollbackResponse {
  message: string
  item: AdminPlatformIntegrationItem
}
