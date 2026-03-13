import { apiClient } from '@/lib/api/client'
import type { AdminActorSummary } from '../types/adminUsers'
import {
  ADMIN_AD_CAMPAIGN_STATUSES,
  ADMIN_AD_DEVICES,
  ADMIN_AD_POSITIONS,
  ADMIN_AD_SPONSOR_TYPES,
  ADMIN_AD_SURFACES,
  ADMIN_AD_TYPES,
  ADMIN_AD_VISIBILITY,
} from '../types/adminAdPartnership'
import type {
  AdminAdCampaignItem,
  AdminAdCampaignMetrics,
  AdminAdCampaignMutationPayload,
  AdminAdCampaignMutationResponse,
  AdminAdCampaignStatus,
  AdminAdCampaignsListQuery,
  AdminAdCampaignsListResponse,
  AdminAdDevice,
  AdminAdPagination,
  AdminAdSlotItem,
  AdminAdSlotMutationPayload,
  AdminAdSlotMutationResponse,
  AdminAdSlotsListQuery,
  AdminAdSlotsListResponse,
  AdminAdSponsorType,
  AdminAdStatusActionPayload,
  AdminAdSurface,
  AdminAdType,
  AdminAdVisibility,
  AdminAdsInventoryOverview,
  AdminAdsInventoryRow,
  AdminDirectoryEntrySummary,
} from '../types/adminAdPartnership'

interface BackendActorSummary {
  id?: unknown
  _id?: unknown
  name?: unknown
  username?: unknown
  email?: unknown
  role?: unknown
}

interface BackendDirectoryEntrySummary {
  id?: unknown
  _id?: unknown
  name?: unknown
  slug?: unknown
  verticalType?: unknown
  status?: unknown
  isActive?: unknown
}

interface BackendPagination {
  page?: unknown
  limit?: unknown
  total?: unknown
  pages?: unknown
}

interface BackendSlotItem {
  id?: unknown
  _id?: unknown
  slotId?: unknown
  label?: unknown
  surface?: unknown
  position?: unknown
  device?: unknown
  allowedTypes?: unknown
  visibleTo?: unknown
  maxPerSession?: unknown
  minSecondsBetweenImpressions?: unknown
  minContentBefore?: unknown
  isActive?: unknown
  priority?: unknown
  fallbackType?: unknown
  notes?: unknown
  version?: unknown
  createdBy?: BackendActorSummary | null
  updatedBy?: BackendActorSummary | null
  createdAt?: unknown
  updatedAt?: unknown
}

interface BackendSlotListResponse {
  items?: BackendSlotItem[]
  pagination?: BackendPagination
}

interface BackendCampaignHistoryItem {
  changedBy?: BackendActorSummary | null
  reason?: unknown
  note?: unknown
  changedAt?: unknown
  snapshot?: {
    status?: unknown
    startAt?: unknown
    endAt?: unknown
    priority?: unknown
    visibleTo?: unknown
    slotIds?: unknown
  }
}

interface BackendCampaignItem {
  id?: unknown
  _id?: unknown
  code?: unknown
  title?: unknown
  description?: unknown
  adType?: unknown
  sponsorType?: unknown
  status?: unknown
  directoryEntry?: BackendDirectoryEntrySummary | null
  surfaces?: unknown
  slotIds?: unknown
  visibleTo?: unknown
  priority?: unknown
  startAt?: unknown
  endAt?: unknown
  headline?: unknown
  disclosureLabel?: unknown
  body?: unknown
  ctaText?: unknown
  ctaUrl?: unknown
  imageUrl?: unknown
  relevanceTags?: unknown
  estimatedMonthlyBudget?: unknown
  currency?: unknown
  approvedAt?: unknown
  approvedBy?: BackendActorSummary | null
  createdBy?: BackendActorSummary | null
  updatedBy?: BackendActorSummary | null
  metrics?: {
    impressions?: unknown
    clicks?: unknown
    conversions?: unknown
  }
  version?: unknown
  history?: BackendCampaignHistoryItem[]
  createdAt?: unknown
  updatedAt?: unknown
}

interface BackendCampaignListResponse {
  items?: BackendCampaignItem[]
  pagination?: BackendPagination
}

interface BackendSlotMutationResponse {
  message?: unknown
  item?: BackendSlotItem
}

interface BackendCampaignMutationResponse {
  message?: unknown
  item?: BackendCampaignItem
}

interface BackendInventoryRow {
  _id?: unknown
  total?: unknown
  active?: unknown
  paused?: unknown
  count?: unknown
}

interface BackendInventoryOverview {
  slotsBySurface?: BackendInventoryRow[]
  campaignsByType?: BackendInventoryRow[]
  activeCampaignsBySurface?: BackendInventoryRow[]
  generatedAt?: unknown
}

interface BackendCampaignMetricsResponse {
  campaign?: {
    id?: unknown
    code?: unknown
    title?: unknown
    status?: unknown
    adType?: unknown
    sponsorType?: unknown
    directoryEntry?: BackendDirectoryEntrySummary | null
    createdAt?: unknown
    updatedAt?: unknown
  }
  lifetime?: {
    impressions?: unknown
    clicks?: unknown
    conversions?: unknown
    ctrPercent?: unknown
  }
  window?: {
    days?: unknown
    from?: unknown
    to?: unknown
    served?: unknown
    impressions?: unknown
    clicks?: unknown
    ctrPercent?: unknown
    fillRatePercent?: unknown
  }
  timeline?: Array<{
    date?: unknown
    served?: unknown
    impressions?: unknown
    clicks?: unknown
    ctrPercent?: unknown
    fillRatePercent?: unknown
  }>
  breakdown?: {
    bySlot?: Array<{
      key?: unknown
      served?: unknown
      impressions?: unknown
      clicks?: unknown
      ctrPercent?: unknown
      fillRatePercent?: unknown
    }>
    byAudience?: Array<{
      key?: unknown
      served?: unknown
      impressions?: unknown
      clicks?: unknown
      ctrPercent?: unknown
      fillRatePercent?: unknown
    }>
    byDevice?: Array<{
      key?: unknown
      served?: unknown
      impressions?: unknown
      clicks?: unknown
      ctrPercent?: unknown
      fillRatePercent?: unknown
    }>
  }
  generatedAt?: unknown
}

const AD_TYPE_SET = new Set<AdminAdType>(ADMIN_AD_TYPES)
const AD_VISIBILITY_SET = new Set<AdminAdVisibility>(ADMIN_AD_VISIBILITY)
const AD_SURFACE_SET = new Set<AdminAdSurface>(ADMIN_AD_SURFACES)
const AD_POSITION_SET = new Set<string>(ADMIN_AD_POSITIONS)
const AD_DEVICE_SET = new Set<AdminAdDevice>(ADMIN_AD_DEVICES)
const AD_STATUS_SET = new Set<AdminAdCampaignStatus>(ADMIN_AD_CAMPAIGN_STATUSES)
const AD_SPONSOR_SET = new Set<AdminAdSponsorType>(ADMIN_AD_SPONSOR_TYPES)

const toString = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback

const toNullableString = (value: unknown): string | null =>
  typeof value === 'string' && value.trim().length > 0 ? value.trim() : null

const toOptionalString = (value: unknown): string | undefined =>
  typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined

const toInteger = (value: unknown, fallback = 0): number => {
  const parsed =
    typeof value === 'number'
      ? value
      : typeof value === 'string'
        ? Number.parseInt(value, 10)
        : Number.NaN
  if (!Number.isFinite(parsed)) return fallback
  return Math.trunc(parsed)
}

const toNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return fallback
}

const toNonNegativeInteger = (value: unknown, fallback = 0): number =>
  Math.max(0, toInteger(value, fallback))

const toIsoDateOrNull = (value: unknown): string | null => {
  if (typeof value !== 'string' || value.trim().length === 0) return null
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return null
  return parsed.toISOString()
}

const mapActor = (raw?: BackendActorSummary | null): AdminActorSummary | null => {
  if (!raw || typeof raw !== 'object') return null
  const id = toOptionalString(raw.id) ?? toOptionalString(raw._id)
  if (!id) return null
  return {
    id,
    name: toOptionalString(raw.name),
    username: toOptionalString(raw.username),
    email: toOptionalString(raw.email),
    role:
      raw.role === 'visitor' ||
      raw.role === 'free' ||
      raw.role === 'premium' ||
      raw.role === 'creator' ||
      raw.role === 'admin'
        ? raw.role
        : undefined,
  }
}

const mapDirectoryEntry = (
  raw?: BackendDirectoryEntrySummary | null,
): AdminDirectoryEntrySummary | null => {
  if (!raw || typeof raw !== 'object') return null
  const id = toOptionalString(raw.id) ?? toOptionalString(raw._id)
  if (!id) return null
  return {
    id,
    name: toString(raw.name),
    slug: toNullableString(raw.slug),
    verticalType: toNullableString(raw.verticalType),
    status: toNullableString(raw.status),
    isActive: raw.isActive === true,
  }
}

const mapPagination = (raw?: BackendPagination): AdminAdPagination => ({
  page: Math.max(1, toInteger(raw?.page, 1)),
  limit: Math.max(1, toInteger(raw?.limit, 25)),
  total: Math.max(0, toInteger(raw?.total, 0)),
  pages: Math.max(1, toInteger(raw?.pages, 1)),
})

const mapAdType = (value: unknown): AdminAdType =>
  typeof value === 'string' && AD_TYPE_SET.has(value as AdminAdType)
    ? (value as AdminAdType)
    : 'sponsored_ads'

const mapAdSurface = (value: unknown): AdminAdSurface =>
  typeof value === 'string' && AD_SURFACE_SET.has(value as AdminAdSurface)
    ? (value as AdminAdSurface)
    : 'home_feed'

const mapAdDevice = (value: unknown): AdminAdDevice =>
  typeof value === 'string' && AD_DEVICE_SET.has(value as AdminAdDevice)
    ? (value as AdminAdDevice)
    : 'all'

const mapAdCampaignStatus = (value: unknown): AdminAdCampaignStatus =>
  typeof value === 'string' && AD_STATUS_SET.has(value as AdminAdCampaignStatus)
    ? (value as AdminAdCampaignStatus)
    : 'draft'

const mapAdSponsorType = (value: unknown): AdminAdSponsorType =>
  typeof value === 'string' && AD_SPONSOR_SET.has(value as AdminAdSponsorType)
    ? (value as AdminAdSponsorType)
    : 'brand'

const parseAdTypeArray = (value: unknown): AdminAdType[] =>
  Array.isArray(value)
    ? value.filter((item): item is AdminAdType => typeof item === 'string' && AD_TYPE_SET.has(item as AdminAdType))
    : []

const parseAdVisibilityArray = (value: unknown): AdminAdVisibility[] =>
  Array.isArray(value)
    ? value.filter(
        (item): item is AdminAdVisibility =>
          typeof item === 'string' && AD_VISIBILITY_SET.has(item as AdminAdVisibility),
      )
    : []

const parseAdSurfaceArray = (value: unknown): AdminAdSurface[] =>
  Array.isArray(value)
    ? value.filter(
        (item): item is AdminAdSurface =>
          typeof item === 'string' && AD_SURFACE_SET.has(item as AdminAdSurface),
      )
    : []

const parseStringArray = (value: unknown): string[] =>
  Array.isArray(value)
    ? value
        .map((item) => (typeof item === 'string' ? item.trim() : ''))
        .filter((item) => item.length > 0)
    : []

const mapSlotItem = (raw: BackendSlotItem): AdminAdSlotItem | null => {
  const id = toOptionalString(raw.id) ?? toOptionalString(raw._id)
  if (!id) return null
  const positionCandidate = toString(raw.position)
  const position = AD_POSITION_SET.has(positionCandidate)
    ? (positionCandidate as AdminAdSlotItem['position'])
    : 'inline'

  return {
    id,
    slotId: toString(raw.slotId).toUpperCase(),
    label: toString(raw.label),
    surface: mapAdSurface(raw.surface),
    position,
    device: mapAdDevice(raw.device),
    allowedTypes: parseAdTypeArray(raw.allowedTypes),
    visibleTo: parseAdVisibilityArray(raw.visibleTo),
    maxPerSession: toNonNegativeInteger(raw.maxPerSession, 1),
    minSecondsBetweenImpressions: toNonNegativeInteger(raw.minSecondsBetweenImpressions, 120),
    minContentBefore: toNonNegativeInteger(raw.minContentBefore, 0),
    isActive: raw.isActive === true,
    priority: toNonNegativeInteger(raw.priority, 100),
    fallbackType:
      raw.fallbackType === null
        ? null
        : typeof raw.fallbackType === 'string' && AD_TYPE_SET.has(raw.fallbackType as AdminAdType)
          ? (raw.fallbackType as AdminAdType)
          : null,
    notes: toNullableString(raw.notes),
    version: Math.max(1, toInteger(raw.version, 1)),
    createdBy: mapActor(raw.createdBy),
    updatedBy: mapActor(raw.updatedBy),
    createdAt: toIsoDateOrNull(raw.createdAt),
    updatedAt: toIsoDateOrNull(raw.updatedAt),
  }
}

const mapCampaignItem = (raw: BackendCampaignItem): AdminAdCampaignItem | null => {
  const id = toOptionalString(raw.id) ?? toOptionalString(raw._id)
  if (!id) return null

  const history = Array.isArray(raw.history)
    ? raw.history.map((item) => ({
        changedBy: mapActor(item.changedBy),
        reason: toString(item.reason),
        note: toNullableString(item.note),
        changedAt: toIsoDateOrNull(item.changedAt),
        snapshot: {
          status: mapAdCampaignStatus(item.snapshot?.status),
          startAt: toIsoDateOrNull(item.snapshot?.startAt),
          endAt: toIsoDateOrNull(item.snapshot?.endAt),
          priority: toNonNegativeInteger(item.snapshot?.priority, 100),
          visibleTo: parseAdVisibilityArray(item.snapshot?.visibleTo),
          slotIds: parseStringArray(item.snapshot?.slotIds),
        },
      }))
    : []

  return {
    id,
    code: toString(raw.code),
    title: toString(raw.title),
    description: toNullableString(raw.description),
    adType: mapAdType(raw.adType),
    sponsorType: mapAdSponsorType(raw.sponsorType),
    status: mapAdCampaignStatus(raw.status),
    directoryEntry: mapDirectoryEntry(raw.directoryEntry),
    surfaces: parseAdSurfaceArray(raw.surfaces),
    slotIds: parseStringArray(raw.slotIds),
    visibleTo: parseAdVisibilityArray(raw.visibleTo),
    priority: toNonNegativeInteger(raw.priority, 100),
    startAt: toIsoDateOrNull(raw.startAt),
    endAt: toIsoDateOrNull(raw.endAt),
    headline: toString(raw.headline),
    disclosureLabel: toNullableString(raw.disclosureLabel),
    body: toNullableString(raw.body),
    ctaText: toNullableString(raw.ctaText),
    ctaUrl: toNullableString(raw.ctaUrl),
    imageUrl: toNullableString(raw.imageUrl),
    relevanceTags: parseStringArray(raw.relevanceTags),
    estimatedMonthlyBudget:
      raw.estimatedMonthlyBudget === null ? null : toNonNegativeInteger(raw.estimatedMonthlyBudget, 0),
    currency: toString(raw.currency, 'EUR').toUpperCase(),
    approvedAt: toIsoDateOrNull(raw.approvedAt),
    approvedBy: mapActor(raw.approvedBy),
    createdBy: mapActor(raw.createdBy),
    updatedBy: mapActor(raw.updatedBy),
    metrics: {
      impressions: toNonNegativeInteger(raw.metrics?.impressions, 0),
      clicks: toNonNegativeInteger(raw.metrics?.clicks, 0),
      conversions: toNonNegativeInteger(raw.metrics?.conversions, 0),
    },
    version: Math.max(1, toInteger(raw.version, 1)),
    history,
    historyCount: history.length,
    createdAt: toIsoDateOrNull(raw.createdAt),
    updatedAt: toIsoDateOrNull(raw.updatedAt),
  }
}

const mapInventoryRows = (rows: unknown): AdminAdsInventoryRow[] =>
  Array.isArray(rows)
    ? rows.map((raw) => {
        const row = (raw ?? {}) as BackendInventoryRow
        return {
          key: toString(row._id, 'unknown'),
          total: toNonNegativeInteger(row.total, 0),
          active: row.active === undefined ? undefined : toNonNegativeInteger(row.active, 0),
          paused: row.paused === undefined ? undefined : toNonNegativeInteger(row.paused, 0),
          count: row.count === undefined ? undefined : toNonNegativeInteger(row.count, 0),
        }
      })
    : []

const toSlotListParams = (query: AdminAdSlotsListQuery): Record<string, string | number | boolean> => {
  const params: Record<string, string | number | boolean> = {}
  if (query.surface) params.surface = query.surface
  if (query.position) params.position = query.position
  if (query.device) params.device = query.device
  if (query.adType) params.adType = query.adType
  if (typeof query.isActive === 'boolean') params.isActive = query.isActive
  if (typeof query.page === 'number' && query.page > 0) params.page = Math.trunc(query.page)
  if (typeof query.limit === 'number' && query.limit > 0) params.limit = Math.trunc(query.limit)
  return params
}

const toCampaignListParams = (
  query: AdminAdCampaignsListQuery,
): Record<string, string | number | boolean> => {
  const params: Record<string, string | number | boolean> = {}
  if (query.status) params.status = query.status
  if (query.adType) params.adType = query.adType
  if (query.sponsorType) params.sponsorType = query.sponsorType
  if (query.surface) params.surface = query.surface
  if (query.search?.trim()) params.search = query.search.trim()
  if (typeof query.page === 'number' && query.page > 0) params.page = Math.trunc(query.page)
  if (typeof query.limit === 'number' && query.limit > 0) params.limit = Math.trunc(query.limit)
  return params
}

const toSlotMutationPayload = (payload: AdminAdSlotMutationPayload): Record<string, unknown> => {
  const body: Record<string, unknown> = {
    reason: payload.reason.trim(),
  }
  if (payload.note?.trim()) body.note = payload.note.trim()
  if (payload.slotId !== undefined) body.slotId = payload.slotId.trim().toUpperCase()
  if (payload.label !== undefined) body.label = payload.label.trim()
  if (payload.surface !== undefined) body.surface = payload.surface
  if (payload.position !== undefined) body.position = payload.position
  if (payload.device !== undefined) body.device = payload.device
  if (payload.allowedTypes !== undefined) body.allowedTypes = payload.allowedTypes
  if (payload.visibleTo !== undefined) body.visibleTo = payload.visibleTo
  if (payload.maxPerSession !== undefined) body.maxPerSession = payload.maxPerSession
  if (payload.minSecondsBetweenImpressions !== undefined) {
    body.minSecondsBetweenImpressions = payload.minSecondsBetweenImpressions
  }
  if (payload.minContentBefore !== undefined) body.minContentBefore = payload.minContentBefore
  if (payload.isActive !== undefined) body.isActive = payload.isActive
  if (payload.priority !== undefined) body.priority = payload.priority
  if (payload.fallbackType !== undefined) body.fallbackType = payload.fallbackType
  if (payload.notes !== undefined) body.notes = payload.notes?.trim() || null
  return body
}

const toCampaignMutationPayload = (
  payload: AdminAdCampaignMutationPayload,
): Record<string, unknown> => {
  const body: Record<string, unknown> = {
    reason: payload.reason.trim(),
  }
  if (payload.note?.trim()) body.note = payload.note.trim()
  if (payload.code !== undefined) body.code = payload.code.trim().toUpperCase()
  if (payload.title !== undefined) body.title = payload.title.trim()
  if (payload.description !== undefined) body.description = payload.description?.trim() || null
  if (payload.adType !== undefined) body.adType = payload.adType
  if (payload.sponsorType !== undefined) body.sponsorType = payload.sponsorType
  if (payload.brandId !== undefined) body.brandId = payload.brandId.trim()
  if (payload.directoryEntryId !== undefined) body.directoryEntryId = payload.directoryEntryId.trim()
  if (payload.surfaces !== undefined) body.surfaces = payload.surfaces
  if (payload.slotIds !== undefined) body.slotIds = payload.slotIds
  if (payload.visibleTo !== undefined) body.visibleTo = payload.visibleTo
  if (payload.priority !== undefined) body.priority = payload.priority
  if (payload.startAt !== undefined) body.startAt = payload.startAt || null
  if (payload.endAt !== undefined) body.endAt = payload.endAt || null
  if (payload.headline !== undefined) body.headline = payload.headline.trim()
  if (payload.disclosureLabel !== undefined) body.disclosureLabel = payload.disclosureLabel?.trim() || null
  if (payload.body !== undefined) body.body = payload.body?.trim() || null
  if (payload.ctaText !== undefined) body.ctaText = payload.ctaText?.trim() || null
  if (payload.ctaUrl !== undefined) body.ctaUrl = payload.ctaUrl?.trim() || null
  if (payload.imageUrl !== undefined) body.imageUrl = payload.imageUrl?.trim() || null
  if (payload.relevanceTags !== undefined) body.relevanceTags = payload.relevanceTags
  if (payload.estimatedMonthlyBudget !== undefined) {
    body.estimatedMonthlyBudget = payload.estimatedMonthlyBudget
  }
  if (payload.currency !== undefined) body.currency = payload.currency.trim().toUpperCase()
  if (payload.status !== undefined) body.status = payload.status
  return body
}

const toStatusPayload = (payload: AdminAdStatusActionPayload): Record<string, unknown> => ({
  reason: payload.reason.trim(),
  ...(payload.note?.trim() ? { note: payload.note.trim() } : {}),
})

const mapSlotMutation = (response: BackendSlotMutationResponse): AdminAdSlotMutationResponse => {
  const item = response.item ? mapSlotItem(response.item) : null
  if (!item) throw new Error('Resposta admin invalida: slot em falta.')
  return {
    message: toString(response.message, 'Slot atualizado com sucesso.'),
    item,
  }
}

const mapCampaignMutation = (
  response: BackendCampaignMutationResponse,
): AdminAdCampaignMutationResponse => {
  const item = response.item ? mapCampaignItem(response.item) : null
  if (!item) throw new Error('Resposta admin invalida: campanha em falta.')
  return {
    message: toString(response.message, 'Campanha atualizada com sucesso.'),
    item,
  }
}

const mapMetricsBreakdownRows = (rows: unknown) =>
  Array.isArray(rows)
    ? rows.map((row) => {
        const item = (row ?? {}) as {
          key?: unknown
          served?: unknown
          impressions?: unknown
          clicks?: unknown
          ctrPercent?: unknown
          fillRatePercent?: unknown
        }
        return {
          key: toString(item.key, 'unknown'),
          served: toNonNegativeInteger(item.served, 0),
          impressions: toNonNegativeInteger(item.impressions, 0),
          clicks: toNonNegativeInteger(item.clicks, 0),
          ctrPercent: Math.max(0, toNumber(item.ctrPercent, 0)),
          fillRatePercent: Math.max(0, toNumber(item.fillRatePercent, 0)),
        }
      })
    : []

export const adminAdPartnershipService = {
  inventoryOverview: async (): Promise<AdminAdsInventoryOverview> => {
    const response = await apiClient.get<BackendInventoryOverview>('/admin/ads/inventory/overview')
    return {
      slotsBySurface: mapInventoryRows(response.data.slotsBySurface),
      campaignsByType: mapInventoryRows(response.data.campaignsByType),
      activeCampaignsBySurface: mapInventoryRows(response.data.activeCampaignsBySurface),
      generatedAt: toIsoDateOrNull(response.data.generatedAt),
    }
  },

  listSlots: async (query: AdminAdSlotsListQuery = {}): Promise<AdminAdSlotsListResponse> => {
    const response = await apiClient.get<BackendSlotListResponse>('/admin/ads/slots', {
      params: toSlotListParams(query),
    })
    return {
      items: Array.isArray(response.data.items)
        ? response.data.items.map(mapSlotItem).filter((item): item is AdminAdSlotItem => item !== null)
        : [],
      pagination: mapPagination(response.data.pagination),
    }
  },

  createSlot: async (payload: AdminAdSlotMutationPayload): Promise<AdminAdSlotMutationResponse> => {
    const response = await apiClient.post<BackendSlotMutationResponse>(
      '/admin/ads/slots',
      toSlotMutationPayload(payload),
    )
    return mapSlotMutation(response.data)
  },

  updateSlot: async (
    slotId: string,
    payload: AdminAdSlotMutationPayload,
  ): Promise<AdminAdSlotMutationResponse> => {
    const response = await apiClient.patch<BackendSlotMutationResponse>(
      `/admin/ads/slots/${encodeURIComponent(slotId)}`,
      toSlotMutationPayload(payload),
    )
    return mapSlotMutation(response.data)
  },

  listCampaigns: async (
    query: AdminAdCampaignsListQuery = {},
  ): Promise<AdminAdCampaignsListResponse> => {
    const response = await apiClient.get<BackendCampaignListResponse>('/admin/ads/campaigns', {
      params: toCampaignListParams(query),
    })
    return {
      items: Array.isArray(response.data.items)
        ? response.data.items
            .map(mapCampaignItem)
            .filter((item): item is AdminAdCampaignItem => item !== null)
        : [],
      pagination: mapPagination(response.data.pagination),
    }
  },

  getCampaign: async (campaignId: string): Promise<AdminAdCampaignItem> => {
    const response = await apiClient.get<BackendCampaignItem>(
      `/admin/ads/campaigns/${encodeURIComponent(campaignId)}`,
    )
    const item = mapCampaignItem(response.data)
    if (!item) throw new Error('Resposta admin invalida: campanha em falta.')
    return item
  },

  getCampaignMetrics: async (campaignId: string, days?: number): Promise<AdminAdCampaignMetrics> => {
    const params: Record<string, number> = {}
    if (typeof days === 'number' && Number.isFinite(days) && days > 0) {
      params.days = Math.trunc(days)
    }

    const response = await apiClient.get<BackendCampaignMetricsResponse>(
      `/admin/ads/campaigns/${encodeURIComponent(campaignId)}/metrics`,
      { params },
    )
    const data = response.data ?? {}
    return {
      campaign: {
        id: toString(data.campaign?.id),
        code: toString(data.campaign?.code),
        title: toString(data.campaign?.title),
        status: mapAdCampaignStatus(data.campaign?.status),
        adType: mapAdType(data.campaign?.adType),
        sponsorType: mapAdSponsorType(data.campaign?.sponsorType),
        directoryEntry: mapDirectoryEntry(data.campaign?.directoryEntry),
        createdAt: toIsoDateOrNull(data.campaign?.createdAt),
        updatedAt: toIsoDateOrNull(data.campaign?.updatedAt),
      },
      lifetime: {
        impressions: toNonNegativeInteger(data.lifetime?.impressions, 0),
        clicks: toNonNegativeInteger(data.lifetime?.clicks, 0),
        conversions: toNonNegativeInteger(data.lifetime?.conversions, 0),
        ctrPercent: Math.max(0, toNumber(data.lifetime?.ctrPercent, 0)),
      },
      window: {
        days: Math.max(1, toInteger(data.window?.days, 30)),
        from: toIsoDateOrNull(data.window?.from),
        to: toIsoDateOrNull(data.window?.to),
        served: toNonNegativeInteger(data.window?.served, 0),
        impressions: toNonNegativeInteger(data.window?.impressions, 0),
        clicks: toNonNegativeInteger(data.window?.clicks, 0),
        ctrPercent: Math.max(0, toNumber(data.window?.ctrPercent, 0)),
        fillRatePercent: Math.max(0, toNumber(data.window?.fillRatePercent, 0)),
      },
      timeline: Array.isArray(data.timeline)
        ? data.timeline.map((row) => ({
            date: toString(row.date),
            served: toNonNegativeInteger(row.served, 0),
            impressions: toNonNegativeInteger(row.impressions, 0),
            clicks: toNonNegativeInteger(row.clicks, 0),
            ctrPercent: Math.max(0, toNumber(row.ctrPercent, 0)),
            fillRatePercent: Math.max(0, toNumber(row.fillRatePercent, 0)),
          }))
        : [],
      breakdown: {
        bySlot: mapMetricsBreakdownRows(data.breakdown?.bySlot),
        byAudience: mapMetricsBreakdownRows(data.breakdown?.byAudience),
        byDevice: mapMetricsBreakdownRows(data.breakdown?.byDevice),
      },
      generatedAt: toIsoDateOrNull(data.generatedAt),
    }
  },

  createCampaign: async (
    payload: AdminAdCampaignMutationPayload,
  ): Promise<AdminAdCampaignMutationResponse> => {
    const response = await apiClient.post<BackendCampaignMutationResponse>(
      '/admin/ads/campaigns',
      toCampaignMutationPayload(payload),
    )
    return mapCampaignMutation(response.data)
  },

  updateCampaign: async (
    campaignId: string,
    payload: AdminAdCampaignMutationPayload,
  ): Promise<AdminAdCampaignMutationResponse> => {
    const response = await apiClient.patch<BackendCampaignMutationResponse>(
      `/admin/ads/campaigns/${encodeURIComponent(campaignId)}`,
      toCampaignMutationPayload(payload),
    )
    return mapCampaignMutation(response.data)
  },

  submitCampaignForApproval: async (
    campaignId: string,
    payload: AdminAdStatusActionPayload,
  ): Promise<AdminAdCampaignMutationResponse> => {
    const response = await apiClient.post<BackendCampaignMutationResponse>(
      `/admin/ads/campaigns/${encodeURIComponent(campaignId)}/submit-approval`,
      toStatusPayload(payload),
    )
    return mapCampaignMutation(response.data)
  },

  approveCampaign: async (
    campaignId: string,
    payload: AdminAdStatusActionPayload,
  ): Promise<AdminAdCampaignMutationResponse> => {
    const response = await apiClient.post<BackendCampaignMutationResponse>(
      `/admin/ads/campaigns/${encodeURIComponent(campaignId)}/approve`,
      toStatusPayload(payload),
    )
    return mapCampaignMutation(response.data)
  },

  rejectCampaign: async (
    campaignId: string,
    payload: AdminAdStatusActionPayload,
  ): Promise<AdminAdCampaignMutationResponse> => {
    const response = await apiClient.post<BackendCampaignMutationResponse>(
      `/admin/ads/campaigns/${encodeURIComponent(campaignId)}/reject`,
      toStatusPayload(payload),
    )
    return mapCampaignMutation(response.data)
  },

  activateCampaign: async (
    campaignId: string,
    payload: AdminAdStatusActionPayload,
  ): Promise<AdminAdCampaignMutationResponse> => {
    const response = await apiClient.post<BackendCampaignMutationResponse>(
      `/admin/ads/campaigns/${encodeURIComponent(campaignId)}/activate`,
      toStatusPayload(payload),
    )
    return mapCampaignMutation(response.data)
  },

  pauseCampaign: async (
    campaignId: string,
    payload: AdminAdStatusActionPayload,
  ): Promise<AdminAdCampaignMutationResponse> => {
    const response = await apiClient.post<BackendCampaignMutationResponse>(
      `/admin/ads/campaigns/${encodeURIComponent(campaignId)}/pause`,
      toStatusPayload(payload),
    )
    return mapCampaignMutation(response.data)
  },
}

