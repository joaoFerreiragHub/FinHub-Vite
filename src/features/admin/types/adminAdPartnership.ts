import type { AdminActorSummary } from './adminUsers'

export type AdminAdType = 'external_ads' | 'sponsored_ads' | 'house_ads' | 'value_ads'
export type AdminAdVisibility = 'free' | 'premium' | 'all'
export type AdminAdSurface =
  | 'home_feed'
  | 'tools'
  | 'directory'
  | 'content'
  | 'learning'
  | 'community'
  | 'dashboard'
  | 'profile'
export type AdminAdPosition =
  | 'sidebar'
  | 'inline'
  | 'footer'
  | 'header'
  | 'banner'
  | 'card'
  | 'comparison_strip'
export type AdminAdDevice = 'all' | 'desktop' | 'mobile'
export type AdminAdCampaignStatus =
  | 'draft'
  | 'pending_approval'
  | 'approved'
  | 'active'
  | 'paused'
  | 'completed'
  | 'rejected'
  | 'archived'
export type AdminAdSponsorType = 'brand' | 'creator' | 'platform'

export const ADMIN_AD_TYPES: AdminAdType[] = [
  'external_ads',
  'sponsored_ads',
  'house_ads',
  'value_ads',
]
export const ADMIN_AD_VISIBILITY: AdminAdVisibility[] = ['free', 'premium', 'all']
export const ADMIN_AD_SURFACES: AdminAdSurface[] = [
  'home_feed',
  'tools',
  'directory',
  'content',
  'learning',
  'community',
  'dashboard',
  'profile',
]
export const ADMIN_AD_POSITIONS: AdminAdPosition[] = [
  'sidebar',
  'inline',
  'footer',
  'header',
  'banner',
  'card',
  'comparison_strip',
]
export const ADMIN_AD_DEVICES: AdminAdDevice[] = ['all', 'desktop', 'mobile']
export const ADMIN_AD_CAMPAIGN_STATUSES: AdminAdCampaignStatus[] = [
  'draft',
  'pending_approval',
  'approved',
  'active',
  'paused',
  'completed',
  'rejected',
  'archived',
]
export const ADMIN_AD_SPONSOR_TYPES: AdminAdSponsorType[] = ['brand', 'creator', 'platform']

export interface AdminAdPagination {
  page: number
  limit: number
  total: number
  pages: number
}

export interface AdminDirectoryEntrySummary {
  id: string
  name: string
  slug: string | null
  verticalType: string | null
  status: string | null
  isActive: boolean
}

export interface AdminAdSlotItem {
  id: string
  slotId: string
  label: string
  surface: AdminAdSurface
  position: AdminAdPosition
  device: AdminAdDevice
  allowedTypes: AdminAdType[]
  visibleTo: AdminAdVisibility[]
  maxPerSession: number
  minSecondsBetweenImpressions: number
  minContentBefore: number
  isActive: boolean
  priority: number
  fallbackType: AdminAdType | null
  notes: string | null
  version: number
  createdBy: AdminActorSummary | null
  updatedBy: AdminActorSummary | null
  createdAt: string | null
  updatedAt: string | null
}

export interface AdminAdCampaignHistoryItem {
  changedBy: AdminActorSummary | null
  reason: string
  note: string | null
  changedAt: string | null
  snapshot: {
    status: AdminAdCampaignStatus
    startAt: string | null
    endAt: string | null
    priority: number
    visibleTo: AdminAdVisibility[]
    slotIds: string[]
  }
}

export interface AdminAdCampaignItem {
  id: string
  code: string
  title: string
  description: string | null
  adType: AdminAdType
  sponsorType: AdminAdSponsorType
  status: AdminAdCampaignStatus
  directoryEntry: AdminDirectoryEntrySummary | null
  surfaces: AdminAdSurface[]
  slotIds: string[]
  visibleTo: AdminAdVisibility[]
  priority: number
  startAt: string | null
  endAt: string | null
  headline: string
  disclosureLabel: string | null
  body: string | null
  ctaText: string | null
  ctaUrl: string | null
  imageUrl: string | null
  relevanceTags: string[]
  estimatedMonthlyBudget: number | null
  currency: string
  approvedAt: string | null
  approvedBy: AdminActorSummary | null
  createdBy: AdminActorSummary | null
  updatedBy: AdminActorSummary | null
  metrics: {
    impressions: number
    clicks: number
    conversions: number
  }
  version: number
  history: AdminAdCampaignHistoryItem[]
  historyCount: number
  createdAt: string | null
  updatedAt: string | null
}

export interface AdminAdSlotsListQuery {
  surface?: AdminAdSurface
  position?: AdminAdPosition
  device?: AdminAdDevice
  adType?: AdminAdType
  isActive?: boolean
  page?: number
  limit?: number
}

export interface AdminAdCampaignsListQuery {
  status?: AdminAdCampaignStatus
  adType?: AdminAdType
  sponsorType?: AdminAdSponsorType
  surface?: AdminAdSurface
  search?: string
  page?: number
  limit?: number
}

export interface AdminAdSlotsListResponse {
  items: AdminAdSlotItem[]
  pagination: AdminAdPagination
}

export interface AdminAdCampaignsListResponse {
  items: AdminAdCampaignItem[]
  pagination: AdminAdPagination
}

export interface AdminAdsInventoryRow {
  key: string
  total: number
  active?: number
  paused?: number
  count?: number
}

export interface AdminAdsInventoryOverview {
  slotsBySurface: AdminAdsInventoryRow[]
  campaignsByType: AdminAdsInventoryRow[]
  activeCampaignsBySurface: AdminAdsInventoryRow[]
  generatedAt: string | null
}

export interface AdminAdCampaignMetricsBreakdownRow {
  key: string
  served: number
  impressions: number
  clicks: number
  ctrPercent: number
  fillRatePercent: number
}

export interface AdminAdCampaignMetrics {
  campaign: {
    id: string
    code: string
    title: string
    status: AdminAdCampaignStatus
    adType: AdminAdType
    sponsorType: AdminAdSponsorType
    directoryEntry: AdminDirectoryEntrySummary | null
    createdAt: string | null
    updatedAt: string | null
  }
  lifetime: {
    impressions: number
    clicks: number
    conversions: number
    ctrPercent: number
  }
  window: {
    days: number
    from: string | null
    to: string | null
    served: number
    impressions: number
    clicks: number
    ctrPercent: number
    fillRatePercent: number
  }
  timeline: Array<{
    date: string
    served: number
    impressions: number
    clicks: number
    ctrPercent: number
    fillRatePercent: number
  }>
  breakdown: {
    bySlot: AdminAdCampaignMetricsBreakdownRow[]
    byAudience: AdminAdCampaignMetricsBreakdownRow[]
    byDevice: AdminAdCampaignMetricsBreakdownRow[]
  }
  generatedAt: string | null
}

export interface AdminAdSlotMutationPayload {
  slotId?: string
  label?: string
  surface?: AdminAdSurface
  position?: AdminAdPosition
  device?: AdminAdDevice
  allowedTypes?: AdminAdType[]
  visibleTo?: AdminAdVisibility[]
  maxPerSession?: number
  minSecondsBetweenImpressions?: number
  minContentBefore?: number
  isActive?: boolean
  priority?: number
  fallbackType?: AdminAdType | null
  notes?: string | null
  reason: string
  note?: string
}

export interface AdminAdCampaignMutationPayload {
  code?: string
  title?: string
  description?: string | null
  adType?: AdminAdType
  sponsorType?: AdminAdSponsorType
  brandId?: string
  directoryEntryId?: string
  surfaces?: AdminAdSurface[]
  slotIds?: string[]
  visibleTo?: AdminAdVisibility[]
  priority?: number
  startAt?: string | null
  endAt?: string | null
  headline?: string
  disclosureLabel?: string | null
  body?: string | null
  ctaText?: string | null
  ctaUrl?: string | null
  imageUrl?: string | null
  relevanceTags?: string[]
  estimatedMonthlyBudget?: number | null
  currency?: string
  status?: AdminAdCampaignStatus
  reason: string
  note?: string
}

export interface AdminAdStatusActionPayload {
  reason: string
  note?: string
}

export interface AdminAdSlotMutationResponse {
  message: string
  item: AdminAdSlotItem
}

export interface AdminAdCampaignMutationResponse {
  message: string
  item: AdminAdCampaignItem
}
