import { apiClient } from '@/lib/api/client'
import type {
  AdminPlatformIntegrationCategory,
  AdminPlatformIntegrationHealth,
  AdminPlatformIntegrationItem,
  AdminPlatformIntegrationsResponse,
  AdminPlatformIntegrationRollbackPayload,
  AdminPlatformIntegrationRollbackResponse,
  AdminPlatformIntegrationUpdatePayload,
  AdminPlatformIntegrationUpdateResponse,
} from '../types/adminPlatformIntegrations'
import type { AdminActorSummary } from '../types/adminUsers'

interface BackendActorSummary {
  id?: string
  _id?: string
  name?: string
  username?: string
  email?: string
  role?: string
}

interface BackendPlatformIntegrationItem {
  key?: unknown
  label?: unknown
  description?: unknown
  category?: unknown
  enabled?: unknown
  config?: unknown
  historyCount?: unknown
  health?: {
    status?: unknown
    summary?: unknown
    issues?: unknown
    checkedAt?: unknown
  }
  reason?: unknown
  note?: unknown
  updatedAt?: unknown
  updatedBy?: BackendActorSummary | null
}

interface BackendPlatformIntegrationsResponse {
  generatedAt?: unknown
  items?: BackendPlatformIntegrationItem[]
}

interface BackendPlatformIntegrationUpdateResponse {
  message?: unknown
  item?: BackendPlatformIntegrationItem
}

interface BackendPlatformIntegrationRollbackResponse {
  message?: unknown
  item?: BackendPlatformIntegrationItem
}

const isKnownIntegrationKey = (value: unknown): value is AdminPlatformIntegrationItem['key'] =>
  value === 'analytics_posthog' ||
  value === 'analytics_google_analytics' ||
  value === 'analytics_google_tag_manager' ||
  value === 'analytics_meta_pixel' ||
  value === 'captcha_client' ||
  value === 'seo_defaults'

const isKnownCategory = (value: unknown): value is AdminPlatformIntegrationCategory =>
  value === 'analytics' || value === 'security' || value === 'seo'

const toIsoDate = (value: unknown): string | null => {
  if (typeof value !== 'string' || value.trim().length === 0) return null
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString()
}

const toRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : {}

const toHealthStatus = (value: unknown): AdminPlatformIntegrationHealth['status'] =>
  value === 'ok' || value === 'warning' || value === 'error' ? value : 'warning'

const toHealth = (value: BackendPlatformIntegrationItem['health']): AdminPlatformIntegrationHealth => ({
  status: toHealthStatus(value?.status),
  summary:
    typeof value?.summary === 'string' && value.summary.trim().length > 0
      ? value.summary
      : 'Health check indisponivel.',
  issues: Array.isArray(value?.issues)
    ? value.issues
        .map((item) => (typeof item === 'string' ? item.trim() : ''))
        .filter((item): item is string => item.length > 0)
    : [],
  checkedAt: toIsoDate(value?.checkedAt),
})

const mapActor = (actor?: BackendActorSummary | null): AdminActorSummary | null => {
  if (!actor) return null

  const id = actor.id || actor._id
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
      actor.role === 'brand_manager' ||
      actor.role === 'admin'
        ? actor.role
        : undefined,
  }
}

const mapItem = (item: BackendPlatformIntegrationItem): AdminPlatformIntegrationItem | null => {
  if (!isKnownIntegrationKey(item.key)) return null

  return {
    key: item.key,
    label: typeof item.label === 'string' && item.label.trim().length > 0 ? item.label : item.key,
    description: typeof item.description === 'string' ? item.description : '',
    category: isKnownCategory(item.category) ? item.category : 'analytics',
    enabled: item.enabled !== false,
    config: toRecord(item.config),
    historyCount:
      typeof item.historyCount === 'number' && Number.isFinite(item.historyCount)
        ? Math.max(0, Math.round(item.historyCount))
        : 0,
    health: toHealth(item.health),
    reason: typeof item.reason === 'string' ? item.reason : null,
    note: typeof item.note === 'string' ? item.note : null,
    updatedAt: toIsoDate(item.updatedAt),
    updatedBy: mapActor(item.updatedBy),
  }
}

export const adminPlatformIntegrationsService = {
  list: async (): Promise<AdminPlatformIntegrationsResponse> => {
    const response = await apiClient.get<BackendPlatformIntegrationsResponse>('/admin/platform/integrations')
    const items = (response.data.items ?? [])
      .map(mapItem)
      .filter((item): item is AdminPlatformIntegrationItem => item !== null)

    return {
      generatedAt: toIsoDate(response.data.generatedAt) ?? new Date(0).toISOString(),
      items,
    }
  },

  update: async (
    key: AdminPlatformIntegrationItem['key'],
    payload: AdminPlatformIntegrationUpdatePayload,
  ): Promise<AdminPlatformIntegrationUpdateResponse> => {
    const response = await apiClient.patch<BackendPlatformIntegrationUpdateResponse>(
      `/admin/platform/integrations/${key}`,
      payload,
    )

    const item = response.data.item ? mapItem(response.data.item) : null
    if (!item) {
      throw new Error('Resposta admin invalida: integracao em falta.')
    }

    return {
      message:
        typeof response.data.message === 'string' && response.data.message.trim().length > 0
          ? response.data.message
          : 'Integracao atualizada com sucesso.',
      item,
    }
  },

  rollback: async (
    key: AdminPlatformIntegrationItem['key'],
    payload: AdminPlatformIntegrationRollbackPayload,
  ): Promise<AdminPlatformIntegrationRollbackResponse> => {
    const response = await apiClient.post<BackendPlatformIntegrationRollbackResponse>(
      `/admin/platform/integrations/${key}/rollback`,
      payload,
    )

    const item = response.data.item ? mapItem(response.data.item) : null
    if (!item) {
      throw new Error('Resposta admin invalida: rollback sem integracao.')
    }

    return {
      message:
        typeof response.data.message === 'string' && response.data.message.trim().length > 0
          ? response.data.message
          : 'Rollback executado com sucesso.',
      item,
    }
  },
}
