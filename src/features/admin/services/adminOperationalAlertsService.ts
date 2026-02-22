import { apiClient } from '@/lib/api/client'
import type {
  AdminOperationalAlert,
  AdminOperationalAlertSeverity,
  AdminOperationalAlertType,
  AdminOperationalAlertsResponse,
} from '../types/adminOperationalAlerts'
import type { AdminActorSummary } from '../types/adminUsers'

interface BackendActorSummary {
  id?: string
  _id?: string
  name?: string
  username?: string
  email?: string
  role?: string
}

interface BackendOperationalAlert {
  id?: string
  type?: string
  severity?: string
  title?: string
  description?: string
  action?: string
  resourceType?: string
  resourceId?: string
  detectedAt?: string
  actor?: BackendActorSummary | null
  metadata?: Record<string, unknown>
}

interface BackendOperationalAlertsResponse {
  generatedAt?: string
  windowHours?: number
  thresholds?: {
    hideSpikeCount?: number
    hideSpikeWindowMinutes?: number
  }
  summary?: {
    critical?: number
    high?: number
    medium?: number
    total?: number
  }
  items?: BackendOperationalAlert[]
}

interface GetOperationalAlertsParams {
  windowHours?: number
  limit?: number
}

const toNumber = (value: unknown, fallback = 0): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback

const toIsoDate = (value: unknown): string => {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return new Date(0).toISOString()
  }
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? new Date(0).toISOString() : parsed.toISOString()
}

const toString = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback

const resolveId = (value: unknown): string | null => {
  if (!value || typeof value !== 'object') return null
  const record = value as { id?: unknown; _id?: unknown }
  if (typeof record.id === 'string' && record.id.length > 0) return record.id
  if (typeof record._id === 'string' && record._id.length > 0) return record._id
  return null
}

const toRole = (value: unknown): AdminActorSummary['role'] => {
  if (
    value === 'visitor' ||
    value === 'free' ||
    value === 'premium' ||
    value === 'creator' ||
    value === 'admin'
  ) {
    return value
  }
  return undefined
}

const toAlertType = (value: unknown): AdminOperationalAlertType | null => {
  if (value === 'ban_applied') return 'ban_applied'
  if (value === 'content_hide_spike') return 'content_hide_spike'
  if (value === 'delegated_access_started') return 'delegated_access_started'
  return null
}

const toSeverity = (value: unknown): AdminOperationalAlertSeverity => {
  if (value === 'critical') return 'critical'
  if (value === 'high') return 'high'
  return 'medium'
}

const mapActor = (actor?: BackendActorSummary | null): AdminActorSummary | null => {
  if (!actor) return null
  const id = resolveId(actor)
  if (!id) return null

  return {
    id,
    name: typeof actor.name === 'string' ? actor.name : undefined,
    username: typeof actor.username === 'string' ? actor.username : undefined,
    email: typeof actor.email === 'string' ? actor.email : undefined,
    role: toRole(actor.role),
  }
}

const mapAlert = (item: BackendOperationalAlert): AdminOperationalAlert | null => {
  const id = toString(item.id)
  const type = toAlertType(item.type)
  if (!id || !type) return null

  return {
    id,
    type,
    severity: toSeverity(item.severity),
    title: toString(item.title, 'Alerta operacional'),
    description: toString(item.description),
    action: toString(item.action),
    resourceType: toString(item.resourceType),
    resourceId: typeof item.resourceId === 'string' ? item.resourceId : undefined,
    detectedAt: toIsoDate(item.detectedAt),
    actor: mapActor(item.actor),
    metadata:
      item.metadata && typeof item.metadata === 'object'
        ? (item.metadata as Record<string, unknown>)
        : undefined,
  }
}

export const adminOperationalAlertsService = {
  getInternalAlerts: async (
    params: GetOperationalAlertsParams = {},
  ): Promise<AdminOperationalAlertsResponse> => {
    const response = await apiClient.get<BackendOperationalAlertsResponse>(
      '/admin/alerts/internal',
      {
        params,
      },
    )
    const data = response.data ?? {}

    return {
      generatedAt: toIsoDate(data.generatedAt),
      windowHours: toNumber(data.windowHours, 24),
      thresholds: {
        hideSpikeCount: toNumber(data.thresholds?.hideSpikeCount, 5),
        hideSpikeWindowMinutes: toNumber(data.thresholds?.hideSpikeWindowMinutes, 30),
      },
      summary: {
        critical: toNumber(data.summary?.critical, 0),
        high: toNumber(data.summary?.high, 0),
        medium: toNumber(data.summary?.medium, 0),
        total: toNumber(data.summary?.total, 0),
      },
      items: (data.items ?? [])
        .map(mapAlert)
        .filter((item): item is AdminOperationalAlert => item !== null),
    }
  },
}
