import type { AdminActorSummary } from './adminUsers'

export type AdminSurfaceControlKey =
  | 'editorial_home'
  | 'editorial_verticals'
  | 'comments_read'
  | 'comments_write'
  | 'reviews_read'
  | 'reviews_write'

export interface AdminSurfaceControlItem {
  key: AdminSurfaceControlKey
  label: string
  description: string
  impact: 'read' | 'write'
  enabled: boolean
  reason: string | null
  note: string | null
  publicMessage: string | null
  updatedAt: string | null
  updatedBy: AdminActorSummary | null
}

export interface AdminSurfaceControlsResponse {
  generatedAt: string
  items: AdminSurfaceControlItem[]
}

export interface AdminSurfaceControlUpdatePayload {
  enabled: boolean
  reason: string
  note?: string
  publicMessage?: string
}

export interface AdminSurfaceControlUpdateResponse {
  message: string
  item: AdminSurfaceControlItem
}
