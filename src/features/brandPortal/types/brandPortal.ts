import type {
  AdminAdCampaignStatus,
  AdminAdSurface,
  AdminAdType,
  AdminAdVisibility,
} from '@/features/admin/types/adminAdPartnership'

export interface BrandPortalPagination {
  page: number
  limit: number
  total: number
  pages: number
}

export interface BrandPortalDirectorySummary {
  id: string
  name: string
  slug: string
  verticalType: string
  status: string
  verificationStatus: string
  isActive: boolean
  isFeatured?: boolean
  showInDirectory?: boolean
  showInHomeSection?: boolean
  updatedAt?: string | null
}

export interface BrandPortalCampaignStatusSummary {
  draft: number
  pending_approval: number
  approved: number
  active: number
  paused: number
  completed: number
  rejected: number
  archived: number
}

export interface BrandPortalOverviewCampaignLiveItem {
  id: string
  code: string
  title: string
  adType: AdminAdType
  priority: number
  startAt: string | null
  endAt: string | null
  metrics: {
    impressions: number
    clicks: number
    conversions: number
    ctr: number
  }
  directoryEntry: Pick<BrandPortalDirectorySummary, 'id' | 'name' | 'slug' | 'verticalType'> | null
}

export interface BrandPortalOverviewResponse {
  ownerUserId: string
  windowDays: number
  ownership: {
    totalEntries: number
    entries: BrandPortalDirectorySummary[]
  }
  campaigns: {
    total: number
    byStatus: BrandPortalCampaignStatusSummary
    liveNow: BrandPortalOverviewCampaignLiveItem[]
    totals: {
      impressions: number
      clicks: number
      conversions: number
      ctr: number
    }
  }
  delivery: {
    from: string | null
    to: string | null
    totals: {
      serves: number
      impressions: number
      clicks: number
      ctr: number
    }
    timeline: Array<{
      date: string
      serves: number
      impressions: number
      clicks: number
      ctr: number
    }>
  }
}

export interface BrandPortalDirectoriesResponse {
  total: number
  items: BrandPortalDirectorySummary[]
}

export type BrandWalletTransactionType = 'top_up' | 'campaign_spend' | 'refund' | 'manual_adjustment'
export type BrandWalletTransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled'

export interface BrandPortalWalletItem {
  id: string
  directoryEntry: BrandPortalDirectorySummary
  currency: string
  balanceCents: number
  balance: number
  reservedCents: number
  reserved: number
  availableCents: number
  available: number
  lifetimeCreditsCents: number
  lifetimeCredits: number
  lifetimeDebitsCents: number
  lifetimeDebits: number
  lastTransactionAt: string | null
  updatedAt: string | null
}

export interface BrandPortalWalletsResponse {
  summary: {
    totalWallets: number
    totalBalanceCents: number
    totalBalance: number
    totalReservedCents: number
    totalReserved: number
    totalAvailableCents: number
    totalAvailable: number
  }
  items: BrandPortalWalletItem[]
}

export interface BrandPortalWalletTransactionItem {
  id: string
  walletId: string
  directoryEntryId: string
  type: BrandWalletTransactionType
  direction: 'credit' | 'debit'
  status: BrandWalletTransactionStatus
  amountCents: number
  amount: number
  currency: string
  description: string | null
  reference: string | null
  metadata: Record<string, unknown> | null
  settledAt: string | null
  createdAt: string | null
  updatedAt: string | null
}

export interface BrandPortalWalletTransactionsQuery {
  type?: BrandWalletTransactionType
  status?: BrandWalletTransactionStatus
  search?: string
  page?: number
  limit?: number
}

export interface BrandPortalWalletTransactionsResponse {
  wallet: BrandPortalWalletItem
  items: BrandPortalWalletTransactionItem[]
  pagination: BrandPortalPagination
  filters: {
    type: BrandWalletTransactionType | null
    status: BrandWalletTransactionStatus | null
    search: string | null
  }
}

export interface BrandPortalWalletTopUpPayload {
  amountCents?: number
  amount?: number
  description?: string | null
  reference?: string | null
  metadata?: Record<string, unknown> | null
}

export interface BrandPortalWalletTopUpResponse {
  message: string
  item: BrandPortalWalletTransactionItem
  wallet: BrandPortalWalletItem
}

export interface BrandPortalCampaignItem {
  id: string
  code: string
  title: string
  description: string | null
  adType: AdminAdType
  status: AdminAdCampaignStatus
  surfaces: AdminAdSurface[]
  slotIds: string[]
  visibleTo: AdminAdVisibility[]
  priority: number
  headline: string
  ctaText: string | null
  ctaUrl: string | null
  imageUrl: string | null
  relevanceTags: string[]
  estimatedMonthlyBudget: number | null
  currency: string
  startAt: string | null
  endAt: string | null
  metrics: {
    impressions: number
    clicks: number
    conversions: number
  }
  directoryEntry: Pick<BrandPortalDirectorySummary, 'id' | 'name' | 'slug' | 'verticalType'> | null
  updatedAt: string | null
}

export interface BrandPortalCampaignsQuery {
  status?: AdminAdCampaignStatus
  adType?: AdminAdType
  surface?: AdminAdSurface
  search?: string
  page?: number
  limit?: number
}

export interface BrandPortalCampaignsResponse {
  items: BrandPortalCampaignItem[]
  ownership: {
    totalEntries: number
    entries: BrandPortalDirectorySummary[]
  }
  pagination: BrandPortalPagination
}

export interface BrandPortalCampaignCreatePayload {
  code?: string
  title: string
  description?: string | null
  adType: AdminAdType
  directoryEntryId: string
  surfaces: AdminAdSurface[]
  slotIds: string[]
  visibleTo: AdminAdVisibility[]
  priority?: number
  startAt?: string | null
  endAt?: string | null
  headline: string
  disclosureLabel?: string | null
  body?: string | null
  ctaText?: string | null
  ctaUrl?: string | null
  imageUrl?: string | null
  relevanceTags?: string[]
  estimatedMonthlyBudget?: number | null
  currency?: string
  reason?: string
  note?: string | null
}

export interface BrandPortalCampaignUpdatePayload {
  patch: Partial<Omit<BrandPortalCampaignCreatePayload, 'reason' | 'note'>>
  reason?: string
  note?: string | null
}

export interface BrandPortalCampaignActionPayload {
  reason?: string
  note?: string | null
}

export interface BrandPortalCampaignMutationResponse {
  message: string
  item: BrandPortalCampaignItem
}

export interface BrandPortalCampaignMetricsResponse {
  campaign: {
    id: string
    code: string
    title: string
    status: AdminAdCampaignStatus
    adType: AdminAdType
    directoryEntry: Pick<BrandPortalDirectorySummary, 'id' | 'name' | 'slug' | 'verticalType'> | null
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
    bySlot: Array<{
      key: string
      served: number
      impressions: number
      clicks: number
      ctrPercent: number
      fillRatePercent: number
    }>
    byAudience: Array<{
      key: string
      served: number
      impressions: number
      clicks: number
      ctrPercent: number
      fillRatePercent: number
    }>
    byDevice: Array<{
      key: string
      served: number
      impressions: number
      clicks: number
      ctrPercent: number
      fillRatePercent: number
    }>
  }
  generatedAt: string | null
}

export interface BrandPortalAffiliateLinkItem {
  id: string
  code: string
  destinationUrl: string
  label: string | null
  isActive: boolean
  commissionRateBps: number | null
  directoryEntry: Pick<BrandPortalDirectorySummary, 'id' | 'name' | 'slug' | 'verticalType'>
  metrics: {
    clicks: number
    conversions: number
    conversionRate: number
    revenueCents: number
    lastClickedAt: string | null
  }
  createdAt: string | null
  updatedAt: string | null
}

export interface BrandPortalAffiliateLinksQuery {
  directoryEntryId?: string
  isActive?: boolean
  search?: string
  page?: number
  limit?: number
}

export interface BrandPortalAffiliateLinksResponse {
  items: BrandPortalAffiliateLinkItem[]
  pagination: BrandPortalPagination
  summary: {
    total: number
    active: number
    clicksOnPage: number
    conversionsOnPage: number
    revenueCentsOnPage: number
  }
}

export interface BrandPortalAffiliateLinkCreatePayload {
  directoryEntryId: string
  destinationUrl: string
  label?: string | null
  isActive?: boolean
  commissionRateBps?: number | null
  code?: string
  metadata?: Record<string, unknown> | null
}

export interface BrandPortalAffiliateLinkUpdatePayload {
  directoryEntryId?: string
  destinationUrl?: string
  label?: string | null
  isActive?: boolean
  commissionRateBps?: number | null
  code?: string
  metadata?: Record<string, unknown> | null
}

export interface BrandPortalAffiliateLinkMutationResponse {
  message: string
  item: BrandPortalAffiliateLinkItem
}

export interface BrandPortalAffiliateLinkClicksQuery {
  converted?: boolean
  days?: number
  from?: string
  to?: string
  page?: number
  limit?: number
}

export interface BrandPortalAffiliateLinkClicksResponse {
  link: {
    id: string
    code: string
    label: string | null
    destinationUrl: string
    directoryEntryId: string
  }
  items: Array<{
    id: string
    clickedAt: string | null
    converted: boolean
    convertedAt: string | null
    conversionValueCents: number | null
    conversionCurrency: string | null
    conversionReference: string | null
    visitorUserId: string | null
    userAgent: string | null
    referrer: string | null
    utm: {
      source: string | null
      medium: string | null
      campaign: string | null
      term: string | null
      content: string | null
    }
  }>
  pagination: BrandPortalPagination
  summary: {
    clicks: number
    conversions: number
    conversionRate: number
    revenueCents: number
  }
}

export type BrandIntegrationScope = 'brand.affiliate.read'

export interface BrandPortalIntegrationApiKeyItem {
  id: string
  keyPrefix: string
  label: string | null
  scopes: BrandIntegrationScope[]
  isActive: boolean
  ownerUserId: string
  directoryEntryId: string
  lastUsedAt: string | null
  expiresAt: string | null
  revokedAt: string | null
  metadata: Record<string, unknown> | null
  createdAt: string | null
  updatedAt: string | null
}

export interface BrandPortalIntegrationApiKeysQuery {
  directoryEntryId?: string
  isActive?: boolean
  page?: number
  limit?: number
}

export interface BrandPortalIntegrationApiKeysResponse {
  items: BrandPortalIntegrationApiKeyItem[]
  pagination: BrandPortalPagination
  summary: {
    total: number
    active: number
    revoked: number
  }
}

export interface BrandPortalIntegrationApiKeyCreatePayload {
  directoryEntryId: string
  label?: string | null
  scopes?: BrandIntegrationScope[]
  expiresAt?: string | null
  metadata?: Record<string, unknown> | null
}

export interface BrandPortalIntegrationApiKeyCreateResponse {
  message: string
  item: BrandPortalIntegrationApiKeyItem
  apiKey: string
  warning: string | null
}

export interface BrandPortalIntegrationApiKeyUsageQuery {
  days?: number
  method?: string
  statusCodeFrom?: number
  statusCodeTo?: number
  page?: number
  limit?: number
}

export interface BrandPortalIntegrationApiKeyUsageResponse {
  apiKey: BrandPortalIntegrationApiKeyItem
  items: Array<{
    id: string
    apiKeyId: string
    keyPrefix: string
    directoryEntryId: string
    scope: BrandIntegrationScope
    method: string
    path: string
    statusCode: number
    durationMs: number
    requestId: string | null
    userAgent: string | null
    metadata: Record<string, unknown> | null
    createdAt: string | null
  }>
  pagination: BrandPortalPagination
  summary: {
    totalCalls: number
    avgDurationMs: number
    status2xx: number
    status4xx: number
    status5xx: number
  }
  topEndpoints: Array<{
    method: string
    path: string
    calls: number
  }>
}
