import { apiClient } from '@/lib/api/client'
import type {
  AdminSurfaceControlItem,
  AdminSurfaceControlsResponse,
  AdminSurfaceControlUpdatePayload,
  AdminSurfaceControlUpdateResponse,
} from '../types/adminSurfaceControls'
import type { AdminActorSummary } from '../types/adminUsers'

interface BackendActorSummary {
  id?: string
  _id?: string
  name?: string
  username?: string
  email?: string
  role?: string
}

interface BackendSurfaceControlItem {
  key?: string
  label?: string
  description?: string
  impact?: string
  enabled?: boolean
  reason?: string | null
  note?: string | null
  publicMessage?: string | null
  updatedAt?: string | null
  updatedBy?: BackendActorSummary | null
}

interface BackendSurfaceControlsResponse {
  generatedAt?: string
  items?: BackendSurfaceControlItem[]
}

interface BackendSurfaceControlUpdateResponse {
  message?: string
  item?: BackendSurfaceControlItem
}

const toIsoDate = (value: unknown): string | null => {
  if (typeof value !== 'string' || value.trim().length === 0) return null
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString()
}

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
      actor.role === 'admin'
        ? actor.role
        : undefined,
  }
}

const mapItem = (item: BackendSurfaceControlItem): AdminSurfaceControlItem | null => {
  if (
    item.key !== 'editorial_home' &&
    item.key !== 'editorial_verticals' &&
    item.key !== 'comments_read' &&
    item.key !== 'comments_write' &&
    item.key !== 'reviews_read' &&
    item.key !== 'reviews_write'
  ) {
    return null
  }

  return {
    key: item.key,
    label: item.label ?? item.key,
    description: item.description ?? '',
    impact: item.impact === 'write' ? 'write' : 'read',
    enabled: item.enabled !== false,
    reason: item.reason ?? null,
    note: item.note ?? null,
    publicMessage: item.publicMessage ?? null,
    updatedAt: toIsoDate(item.updatedAt) ?? null,
    updatedBy: mapActor(item.updatedBy),
  }
}

export const adminSurfaceControlsService = {
  list: async (): Promise<AdminSurfaceControlsResponse> => {
    const response = await apiClient.get<BackendSurfaceControlsResponse>('/admin/platform/surfaces')
    const items = (response.data.items ?? [])
      .map(mapItem)
      .filter((item): item is AdminSurfaceControlItem => item !== null)

    return {
      generatedAt: toIsoDate(response.data.generatedAt) ?? new Date(0).toISOString(),
      items,
    }
  },

  update: async (
    key: AdminSurfaceControlItem['key'],
    payload: AdminSurfaceControlUpdatePayload,
  ): Promise<AdminSurfaceControlUpdateResponse> => {
    const response = await apiClient.post<BackendSurfaceControlUpdateResponse>(
      `/admin/platform/surfaces/${key}`,
      payload,
    )

    const item = response.data.item ? mapItem(response.data.item) : null
    if (!item) {
      throw new Error('Resposta admin invalida: kill switch em falta.')
    }

    return {
      message: response.data.message ?? 'Kill switch atualizado com sucesso.',
      item,
    }
  },
}
