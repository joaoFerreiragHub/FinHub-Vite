import { apiClient } from '@/lib/api/client'
import type {
  PublicSurfaceControlItem,
  PublicSurfaceControlsResponse,
} from '../types/publicSurfaceControls'

interface BackendPublicSurfaceControlItem {
  key?: string
  enabled?: boolean
  publicMessage?: string | null
  reason?: string | null
  updatedAt?: string | null
}

interface BackendPublicSurfaceControlsResponse {
  generatedAt?: string
  items?: BackendPublicSurfaceControlItem[]
}

const isKnownSurfaceKey = (value: unknown): value is PublicSurfaceControlItem['key'] =>
  value === 'editorial_home' ||
  value === 'editorial_verticals' ||
  value === 'creator_page' ||
  value === 'search' ||
  value === 'derived_feeds' ||
  value === 'comments_read' ||
  value === 'comments_write' ||
  value === 'reviews_read' ||
  value === 'reviews_write'

const toIsoDate = (value: unknown): string | null => {
  if (typeof value !== 'string' || value.trim().length === 0) return null
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString()
}

const mapItem = (item: BackendPublicSurfaceControlItem): PublicSurfaceControlItem | null => {
  if (!isKnownSurfaceKey(item.key)) return null

  return {
    key: item.key,
    enabled: item.enabled !== false,
    publicMessage: item.publicMessage ?? null,
    reason: item.reason ?? null,
    updatedAt: toIsoDate(item.updatedAt),
  }
}

export const publicSurfaceControlsService = {
  list: async (): Promise<PublicSurfaceControlsResponse> => {
    const response = await apiClient.get<BackendPublicSurfaceControlsResponse>('/platform/surfaces')
    const items = (response.data.items ?? [])
      .map(mapItem)
      .filter((item): item is PublicSurfaceControlItem => item !== null)

    return {
      generatedAt: toIsoDate(response.data.generatedAt) ?? new Date(0).toISOString(),
      items,
    }
  },
}
