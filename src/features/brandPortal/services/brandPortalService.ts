import { apiClient } from '@/lib/api/client'
import {
  ADMIN_AD_CAMPAIGN_STATUSES,
  ADMIN_AD_SURFACES,
  ADMIN_AD_TYPES,
  ADMIN_AD_VISIBILITY,
} from '@/features/admin/types/adminAdPartnership'
import type {
  AdminAdCampaignStatus,
  AdminAdSurface,
  AdminAdType,
  AdminAdVisibility,
} from '@/features/admin/types/adminAdPartnership'
import type {
  BrandIntegrationScope,
  BrandPortalAffiliateLinkClicksQuery,
  BrandPortalAffiliateLinkClicksResponse,
  BrandPortalAffiliateLinkCreatePayload,
  BrandPortalAffiliateLinkMutationResponse,
  BrandPortalAffiliateLinkUpdatePayload,
  BrandPortalAffiliateLinksQuery,
  BrandPortalAffiliateLinksResponse,
  BrandPortalCampaignActionPayload,
  BrandPortalCampaignCreatePayload,
  BrandPortalCampaignMetricsResponse,
  BrandPortalCampaignMutationResponse,
  BrandPortalCampaignUpdatePayload,
  BrandPortalCampaignsQuery,
  BrandPortalCampaignsResponse,
  BrandPortalDirectoriesResponse,
  BrandPortalDirectorySummary,
  BrandPortalIntegrationApiKeyCreatePayload,
  BrandPortalIntegrationApiKeyCreateResponse,
  BrandPortalIntegrationApiKeyUsageQuery,
  BrandPortalIntegrationApiKeyUsageResponse,
  BrandPortalIntegrationApiKeysQuery,
  BrandPortalIntegrationApiKeysResponse,
  BrandPortalOverviewResponse,
  BrandPortalPagination,
  BrandPortalWalletItem,
  BrandPortalWalletTopUpPayload,
  BrandPortalWalletTopUpResponse,
  BrandPortalWalletTransactionsQuery,
  BrandPortalWalletTransactionsResponse,
  BrandPortalWalletsResponse,
  BrandWalletTransactionStatus,
  BrandWalletTransactionType,
} from '../types/brandPortal'

type RecordLike = Record<string, unknown>

const AD_TYPE_SET = new Set<AdminAdType>(ADMIN_AD_TYPES)
const AD_SURFACE_SET = new Set<AdminAdSurface>(ADMIN_AD_SURFACES)
const AD_VISIBILITY_SET = new Set<AdminAdVisibility>(ADMIN_AD_VISIBILITY)
const AD_CAMPAIGN_STATUS_SET = new Set<AdminAdCampaignStatus>(ADMIN_AD_CAMPAIGN_STATUSES)

const TRANSACTION_TYPE_SET = new Set<BrandWalletTransactionType>([
  'top_up',
  'campaign_spend',
  'refund',
  'manual_adjustment',
])

const TRANSACTION_STATUS_SET = new Set<BrandWalletTransactionStatus>([
  'pending',
  'completed',
  'failed',
  'cancelled',
])

const INTEGRATION_SCOPE_SET = new Set<BrandIntegrationScope>(['brand.affiliate.read'])

const toRecord = (value: unknown): RecordLike =>
  value && typeof value === 'object' && !Array.isArray(value) ? (value as RecordLike) : {}

const toText = (value: unknown): string | null => {
  if (typeof value !== 'string') return null
  const normalized = value.trim()
  return normalized.length > 0 ? normalized : null
}

const toId = (value: unknown): string | null => {
  const record = toRecord(value)
  return toText(record.id) ?? toText(record._id) ?? toText(value)
}

const toNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return fallback
}

const toInt = (value: unknown, fallback = 0): number => {
  if (typeof value === 'number' && Number.isFinite(value)) return Math.round(value)
  if (typeof value === 'string') {
    const parsed = Number.parseInt(value, 10)
    if (Number.isFinite(parsed)) return parsed
  }
  return fallback
}

const toBoolean = (value: unknown): boolean => value === true

const toIsoDateOrNull = (value: unknown): string | null => {
  const text = toText(value)
  if (!text) return null
  const parsed = new Date(text)
  if (Number.isNaN(parsed.getTime())) return null
  return parsed.toISOString()
}

const toStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return []
  return value.map((entry) => toText(entry)).filter((entry): entry is string => Boolean(entry))
}

const toEnumArray = <T extends string>(value: unknown, set: Set<T>): T[] =>
  toStringArray(value).filter((entry): entry is T => set.has(entry as T))

const toNonNegativeInt = (value: unknown): number => Math.max(0, toInt(value, 0))

const toDirectorySummary = (value: unknown): BrandPortalDirectorySummary | null => {
  const record = toRecord(value)
  const id = toId(record)
  const name = toText(record.name)
  const slug = toText(record.slug)
  const verticalType = toText(record.verticalType)
  const status = toText(record.status)
  const verificationStatus = toText(record.verificationStatus)

  if (!id || !name || !slug || !verticalType || !status || !verificationStatus) return null

  return {
    id,
    name,
    slug,
    verticalType,
    status,
    verificationStatus,
    isActive: toBoolean(record.isActive),
    isFeatured: 'isFeatured' in record ? toBoolean(record.isFeatured) : undefined,
    showInDirectory: 'showInDirectory' in record ? toBoolean(record.showInDirectory) : undefined,
    showInHomeSection:
      'showInHomeSection' in record ? toBoolean(record.showInHomeSection) : undefined,
    updatedAt: toIsoDateOrNull(record.updatedAt),
  }
}

const toPagination = (value: unknown): BrandPortalPagination => {
  const record = toRecord(value)
  const page = Math.max(1, toInt(record.page, 1))
  const limit = Math.max(1, toInt(record.limit, 20))
  const total = Math.max(0, toInt(record.total, 0))
  const pages = Math.max(1, toInt(record.pages, Math.ceil(total / limit) || 1))
  return { page, limit, total, pages }
}

const toAdType = (value: unknown): AdminAdType =>
  AD_TYPE_SET.has(value as AdminAdType) ? (value as AdminAdType) : 'sponsored_ads'

const toCampaignStatus = (value: unknown): AdminAdCampaignStatus =>
  AD_CAMPAIGN_STATUS_SET.has(value as AdminAdCampaignStatus)
    ? (value as AdminAdCampaignStatus)
    : 'draft'

const toTransactionType = (value: unknown): BrandWalletTransactionType =>
  TRANSACTION_TYPE_SET.has(value as BrandWalletTransactionType)
    ? (value as BrandWalletTransactionType)
    : 'top_up'

const toTransactionStatus = (value: unknown): BrandWalletTransactionStatus =>
  TRANSACTION_STATUS_SET.has(value as BrandWalletTransactionStatus)
    ? (value as BrandWalletTransactionStatus)
    : 'pending'

const mapCampaignItem = (raw: unknown) => {
  const record = toRecord(raw)
  const id = toId(record)
  const title = toText(record.title)
  const code = toText(record.code)
  const headline = toText(record.headline)
  if (!id || !title || !code || !headline) return null

  const directoryEntry = toDirectorySummary(record.directoryEntry)

  return {
    id,
    code,
    title,
    description: toText(record.description),
    adType: toAdType(record.adType),
    status: toCampaignStatus(record.status),
    surfaces: toEnumArray(record.surfaces, AD_SURFACE_SET),
    slotIds: toStringArray(record.slotIds),
    visibleTo: toEnumArray(record.visibleTo, AD_VISIBILITY_SET),
    priority: toNonNegativeInt(record.priority),
    headline,
    ctaText: toText(record.ctaText),
    ctaUrl: toText(record.ctaUrl),
    imageUrl: toText(record.imageUrl),
    relevanceTags: toStringArray(record.relevanceTags),
    estimatedMonthlyBudget:
      record.estimatedMonthlyBudget === null ? null : toNumber(record.estimatedMonthlyBudget, 0),
    currency: toText(record.currency) ?? 'EUR',
    startAt: toIsoDateOrNull(record.startAt),
    endAt: toIsoDateOrNull(record.endAt),
    metrics: {
      impressions: toNonNegativeInt(toRecord(record.metrics).impressions),
      clicks: toNonNegativeInt(toRecord(record.metrics).clicks),
      conversions: toNonNegativeInt(toRecord(record.metrics).conversions),
    },
    directoryEntry: directoryEntry
      ? {
          id: directoryEntry.id,
          name: directoryEntry.name,
          slug: directoryEntry.slug,
          verticalType: directoryEntry.verticalType,
        }
      : null,
    updatedAt: toIsoDateOrNull(record.updatedAt),
  }
}

const mapWalletItem = (raw: unknown): BrandPortalWalletItem | null => {
  const record = toRecord(raw)
  const id = toId(record)
  const directoryEntry = toDirectorySummary(record.directoryEntry)
  if (!id || !directoryEntry) return null

  return {
    id,
    directoryEntry,
    currency: toText(record.currency) ?? 'EUR',
    balanceCents: toNonNegativeInt(record.balanceCents),
    balance: toNumber(record.balance, 0),
    reservedCents: toNonNegativeInt(record.reservedCents),
    reserved: toNumber(record.reserved, 0),
    availableCents: toNonNegativeInt(record.availableCents),
    available: toNumber(record.available, 0),
    lifetimeCreditsCents: toNonNegativeInt(record.lifetimeCreditsCents),
    lifetimeCredits: toNumber(record.lifetimeCredits, 0),
    lifetimeDebitsCents: toNonNegativeInt(record.lifetimeDebitsCents),
    lifetimeDebits: toNumber(record.lifetimeDebits, 0),
    lastTransactionAt: toIsoDateOrNull(record.lastTransactionAt),
    updatedAt: toIsoDateOrNull(record.updatedAt),
  }
}

const mapWalletTransactionItem = (raw: unknown) => {
  const record = toRecord(raw)
  const id = toId(record)
  const walletId = toText(record.walletId)
  const directoryEntryId = toText(record.directoryEntryId)
  if (!id || !walletId || !directoryEntryId) return null

  return {
    id,
    walletId,
    directoryEntryId,
    type: toTransactionType(record.type),
    direction: toText(record.direction) === 'debit' ? 'debit' : 'credit',
    status: toTransactionStatus(record.status),
    amountCents: toNonNegativeInt(record.amountCents),
    amount: toNumber(record.amount, 0),
    currency: toText(record.currency) ?? 'EUR',
    description: toText(record.description),
    reference: toText(record.reference),
    metadata: toRecord(record.metadata),
    settledAt: toIsoDateOrNull(record.settledAt),
    createdAt: toIsoDateOrNull(record.createdAt),
    updatedAt: toIsoDateOrNull(record.updatedAt),
  }
}

const mapAffiliateLinkItem = (raw: unknown) => {
  const record = toRecord(raw)
  const id = toId(record)
  const code = toText(record.code)
  const destinationUrl = toText(record.destinationUrl)
  const directoryEntry = toDirectorySummary(record.directoryEntry)
  if (!id || !code || !destinationUrl || !directoryEntry) return null

  const metrics = toRecord(record.metrics)
  return {
    id,
    code,
    destinationUrl,
    label: toText(record.label),
    isActive: toBoolean(record.isActive),
    commissionRateBps:
      record.commissionRateBps === null ? null : toInt(record.commissionRateBps, 0),
    directoryEntry: {
      id: directoryEntry.id,
      name: directoryEntry.name,
      slug: directoryEntry.slug,
      verticalType: directoryEntry.verticalType,
    },
    metrics: {
      clicks: toNonNegativeInt(metrics.clicks),
      conversions: toNonNegativeInt(metrics.conversions),
      conversionRate: toNumber(metrics.conversionRate, 0),
      revenueCents: toNonNegativeInt(metrics.revenueCents),
      lastClickedAt: toIsoDateOrNull(metrics.lastClickedAt),
    },
    createdAt: toIsoDateOrNull(record.createdAt),
    updatedAt: toIsoDateOrNull(record.updatedAt),
  }
}

const mapIntegrationApiKeyItem = (raw: unknown) => {
  const record = toRecord(raw)
  const id = toId(record)
  const keyPrefix = toText(record.keyPrefix)
  const ownerUserId = toText(record.ownerUserId)
  const directoryEntryId = toText(record.directoryEntryId)
  if (!id || !keyPrefix || !ownerUserId || !directoryEntryId) return null

  return {
    id,
    keyPrefix,
    label: toText(record.label),
    scopes: toEnumArray(record.scopes, INTEGRATION_SCOPE_SET),
    isActive: toBoolean(record.isActive),
    ownerUserId,
    directoryEntryId,
    lastUsedAt: toIsoDateOrNull(record.lastUsedAt),
    expiresAt: toIsoDateOrNull(record.expiresAt),
    revokedAt: toIsoDateOrNull(record.revokedAt),
    metadata: toRecord(record.metadata),
    createdAt: toIsoDateOrNull(record.createdAt),
    updatedAt: toIsoDateOrNull(record.updatedAt),
  }
}

const mapOverview = (raw: unknown): BrandPortalOverviewResponse => {
  const record = toRecord(raw)
  const ownership = toRecord(record.ownership)
  const campaigns = toRecord(record.campaigns)
  const delivery = toRecord(record.delivery)
  const byStatus = toRecord(campaigns.byStatus)

  return {
    ownerUserId: toText(record.ownerUserId) ?? '',
    windowDays: Math.max(1, toInt(record.windowDays, 30)),
    ownership: {
      totalEntries: Math.max(0, toInt(ownership.totalEntries, 0)),
      entries: Array.isArray(ownership.entries)
        ? ownership.entries
            .map((entry) => toDirectorySummary(entry))
            .filter((entry): entry is BrandPortalDirectorySummary => Boolean(entry))
        : [],
    },
    campaigns: {
      total: Math.max(0, toInt(campaigns.total, 0)),
      byStatus: {
        draft: toNonNegativeInt(byStatus.draft),
        pending_approval: toNonNegativeInt(byStatus.pending_approval),
        approved: toNonNegativeInt(byStatus.approved),
        active: toNonNegativeInt(byStatus.active),
        paused: toNonNegativeInt(byStatus.paused),
        completed: toNonNegativeInt(byStatus.completed),
        rejected: toNonNegativeInt(byStatus.rejected),
        archived: toNonNegativeInt(byStatus.archived),
      },
      liveNow: Array.isArray(campaigns.liveNow)
        ? campaigns.liveNow
            .map((item) => {
              const row = toRecord(item)
              const id = toId(row)
              const code = toText(row.code)
              const title = toText(row.title)
              if (!id || !code || !title) return null
              const metrics = toRecord(row.metrics)
              const directoryEntry = toDirectorySummary(row.directoryEntry)
              return {
                id,
                code,
                title,
                adType: toAdType(row.adType),
                priority: toNonNegativeInt(row.priority),
                startAt: toIsoDateOrNull(row.startAt),
                endAt: toIsoDateOrNull(row.endAt),
                metrics: {
                  impressions: toNonNegativeInt(metrics.impressions),
                  clicks: toNonNegativeInt(metrics.clicks),
                  conversions: toNonNegativeInt(metrics.conversions),
                  ctr: toNumber(metrics.ctr, 0),
                },
                directoryEntry: directoryEntry
                  ? {
                      id: directoryEntry.id,
                      name: directoryEntry.name,
                      slug: directoryEntry.slug,
                      verticalType: directoryEntry.verticalType,
                    }
                  : null,
              }
            })
            .filter((item): item is NonNullable<typeof item> => Boolean(item))
        : [],
      totals: {
        impressions: toNonNegativeInt(toRecord(campaigns.totals).impressions),
        clicks: toNonNegativeInt(toRecord(campaigns.totals).clicks),
        conversions: toNonNegativeInt(toRecord(campaigns.totals).conversions),
        ctr: toNumber(toRecord(campaigns.totals).ctr, 0),
      },
    },
    delivery: {
      from: toIsoDateOrNull(delivery.from),
      to: toIsoDateOrNull(delivery.to),
      totals: {
        serves: toNonNegativeInt(toRecord(delivery.totals).serves),
        impressions: toNonNegativeInt(toRecord(delivery.totals).impressions),
        clicks: toNonNegativeInt(toRecord(delivery.totals).clicks),
        ctr: toNumber(toRecord(delivery.totals).ctr, 0),
      },
      timeline: Array.isArray(delivery.timeline)
        ? delivery.timeline
            .map((item) => {
              const row = toRecord(item)
              const date = toText(row.date)
              if (!date) return null
              return {
                date,
                serves: toNonNegativeInt(row.serves),
                impressions: toNonNegativeInt(row.impressions),
                clicks: toNonNegativeInt(row.clicks),
                ctr: toNumber(row.ctr, 0),
              }
            })
            .filter((item): item is NonNullable<typeof item> => Boolean(item))
        : [],
    },
  }
}

const withQuery = (query: Record<string, unknown>): Record<string, string | number | boolean> => {
  const output: Record<string, string | number | boolean> = {}
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === '') continue
    output[key] = value as string | number | boolean
  }
  return output
}

export const brandPortalService = {
  getOverview: async (days?: number): Promise<BrandPortalOverviewResponse> => {
    const response = await apiClient.get('/brand-portal/overview', {
      params: withQuery({ days }),
    })
    return mapOverview(response.data)
  },

  listDirectories: async (): Promise<BrandPortalDirectoriesResponse> => {
    const response = await apiClient.get('/brand-portal/directories')
    const record = toRecord(response.data)
    const items = Array.isArray(record.items)
      ? record.items
          .map((item) => toDirectorySummary(item))
          .filter((item): item is BrandPortalDirectorySummary => Boolean(item))
      : []
    return {
      total: Math.max(0, toInt(record.total, items.length)),
      items,
    }
  },

  listWallets: async (): Promise<BrandPortalWalletsResponse> => {
    const response = await apiClient.get('/brand-portal/wallets')
    const record = toRecord(response.data)
    const summary = toRecord(record.summary)

    return {
      summary: {
        totalWallets: toNonNegativeInt(summary.totalWallets),
        totalBalanceCents: toNonNegativeInt(summary.totalBalanceCents),
        totalBalance: toNumber(summary.totalBalance, 0),
        totalReservedCents: toNonNegativeInt(summary.totalReservedCents),
        totalReserved: toNumber(summary.totalReserved, 0),
        totalAvailableCents: toNonNegativeInt(summary.totalAvailableCents),
        totalAvailable: toNumber(summary.totalAvailable, 0),
      },
      items: Array.isArray(record.items)
        ? record.items
            .map((item) => mapWalletItem(item))
            .filter((item): item is BrandPortalWalletItem => Boolean(item))
        : [],
    }
  },

  getWallet: async (directoryEntryId: string): Promise<BrandPortalWalletItem> => {
    const response = await apiClient.get(`/brand-portal/wallets/${encodeURIComponent(directoryEntryId)}`)
    const item = mapWalletItem(response.data)
    if (!item) throw new Error('Resposta invalida da wallet da marca.')
    return item
  },

  listWalletTransactions: async (
    directoryEntryId: string,
    query: BrandPortalWalletTransactionsQuery = {},
  ): Promise<BrandPortalWalletTransactionsResponse> => {
    const response = await apiClient.get(
      `/brand-portal/wallets/${encodeURIComponent(directoryEntryId)}/transactions`,
      { params: withQuery(query) },
    )
    const record = toRecord(response.data)
    const wallet = mapWalletItem(record.wallet)
    if (!wallet) throw new Error('Resposta invalida: wallet em falta.')

    const filters = toRecord(record.filters)
    return {
      wallet,
      items: Array.isArray(record.items)
        ? record.items
            .map((item) => mapWalletTransactionItem(item))
            .filter((item): item is NonNullable<typeof item> => Boolean(item))
        : [],
      pagination: toPagination(record.pagination),
      filters: {
        type: TRANSACTION_TYPE_SET.has(filters.type as BrandWalletTransactionType)
          ? (filters.type as BrandWalletTransactionType)
          : null,
        status: TRANSACTION_STATUS_SET.has(filters.status as BrandWalletTransactionStatus)
          ? (filters.status as BrandWalletTransactionStatus)
          : null,
        search: toText(filters.search),
      },
    }
  },

  requestWalletTopUp: async (
    directoryEntryId: string,
    payload: BrandPortalWalletTopUpPayload,
  ): Promise<BrandPortalWalletTopUpResponse> => {
    const response = await apiClient.post(
      `/brand-portal/wallets/${encodeURIComponent(directoryEntryId)}/top-up-requests`,
      payload,
    )

    const record = toRecord(response.data)
    const item = mapWalletTransactionItem(record.item)
    const wallet = mapWalletItem(record.wallet)
    if (!item || !wallet) {
      throw new Error('Resposta invalida do pedido de top-up.')
    }

    return {
      message: toText(record.message) ?? 'Pedido de top-up criado com sucesso.',
      item,
      wallet,
    }
  },

  listCampaigns: async (query: BrandPortalCampaignsQuery = {}): Promise<BrandPortalCampaignsResponse> => {
    const response = await apiClient.get('/brand-portal/campaigns', {
      params: withQuery(query),
    })
    const record = toRecord(response.data)
    const ownership = toRecord(record.ownership)

    return {
      items: Array.isArray(record.items)
        ? record.items
            .map((item) => mapCampaignItem(item))
            .filter((item): item is NonNullable<typeof item> => Boolean(item))
        : [],
      ownership: {
        totalEntries: Math.max(0, toInt(ownership.totalEntries, 0)),
        entries: Array.isArray(ownership.entries)
          ? ownership.entries
              .map((entry) => toDirectorySummary(entry))
              .filter((entry): entry is BrandPortalDirectorySummary => Boolean(entry))
          : [],
      },
      pagination: toPagination(record.pagination),
    }
  },

  createCampaign: async (
    payload: BrandPortalCampaignCreatePayload,
  ): Promise<BrandPortalCampaignMutationResponse> => {
    const response = await apiClient.post('/brand-portal/campaigns', payload)
    const record = toRecord(response.data)
    const item = mapCampaignItem(record.item)
    if (!item) throw new Error('Resposta invalida da criacao de campanha.')
    return {
      message: toText(record.message) ?? 'Campanha criada com sucesso.',
      item,
    }
  },

  updateCampaign: async (
    campaignId: string,
    payload: BrandPortalCampaignUpdatePayload,
  ): Promise<BrandPortalCampaignMutationResponse> => {
    const response = await apiClient.patch(
      `/brand-portal/campaigns/${encodeURIComponent(campaignId)}`,
      payload,
    )
    const record = toRecord(response.data)
    const item = mapCampaignItem(record.item)
    if (!item) throw new Error('Resposta invalida da atualizacao de campanha.')
    return {
      message: toText(record.message) ?? 'Campanha atualizada com sucesso.',
      item,
    }
  },

  submitCampaignForApproval: async (
    campaignId: string,
    payload: BrandPortalCampaignActionPayload = {},
  ): Promise<BrandPortalCampaignMutationResponse> => {
    const response = await apiClient.post(
      `/brand-portal/campaigns/${encodeURIComponent(campaignId)}/submit-approval`,
      payload,
    )
    const record = toRecord(response.data)
    const item = mapCampaignItem(record.item)
    if (!item) throw new Error('Resposta invalida no submit da campanha.')
    return {
      message: toText(record.message) ?? 'Campanha submetida para aprovacao com sucesso.',
      item,
    }
  },

  getCampaignMetrics: async (
    campaignId: string,
    days?: number,
  ): Promise<BrandPortalCampaignMetricsResponse> => {
    const response = await apiClient.get(
      `/brand-portal/campaigns/${encodeURIComponent(campaignId)}/metrics`,
      { params: withQuery({ days }) },
    )
    const record = toRecord(response.data)
    const campaign = toRecord(record.campaign)
    const campaignIdValue = toId(campaign)
    const code = toText(campaign.code)
    const title = toText(campaign.title)
    if (!campaignIdValue || !code || !title) {
      throw new Error('Resposta invalida: metrica de campanha incompleta.')
    }

    const mapBreakdown = (value: unknown) =>
      Array.isArray(value)
        ? value.map((item) => {
            const row = toRecord(item)
            return {
              key: toText(row.key) ?? '-',
              served: toNonNegativeInt(row.served),
              impressions: toNonNegativeInt(row.impressions),
              clicks: toNonNegativeInt(row.clicks),
              ctrPercent: toNumber(row.ctrPercent, 0),
              fillRatePercent: toNumber(row.fillRatePercent, 0),
            }
          })
        : []

    const directoryEntry = toDirectorySummary(campaign.directoryEntry)

    return {
      campaign: {
        id: campaignIdValue,
        code,
        title,
        status: toCampaignStatus(campaign.status),
        adType: toAdType(campaign.adType),
        directoryEntry: directoryEntry
          ? {
              id: directoryEntry.id,
              name: directoryEntry.name,
              slug: directoryEntry.slug,
              verticalType: directoryEntry.verticalType,
            }
          : null,
        createdAt: toIsoDateOrNull(campaign.createdAt),
        updatedAt: toIsoDateOrNull(campaign.updatedAt),
      },
      lifetime: {
        impressions: toNonNegativeInt(toRecord(record.lifetime).impressions),
        clicks: toNonNegativeInt(toRecord(record.lifetime).clicks),
        conversions: toNonNegativeInt(toRecord(record.lifetime).conversions),
        ctrPercent: toNumber(toRecord(record.lifetime).ctrPercent, 0),
      },
      window: {
        days: Math.max(1, toInt(toRecord(record.window).days, 30)),
        from: toIsoDateOrNull(toRecord(record.window).from),
        to: toIsoDateOrNull(toRecord(record.window).to),
        served: toNonNegativeInt(toRecord(record.window).served),
        impressions: toNonNegativeInt(toRecord(record.window).impressions),
        clicks: toNonNegativeInt(toRecord(record.window).clicks),
        ctrPercent: toNumber(toRecord(record.window).ctrPercent, 0),
        fillRatePercent: toNumber(toRecord(record.window).fillRatePercent, 0),
      },
      timeline: Array.isArray(record.timeline)
        ? record.timeline.map((item) => {
            const row = toRecord(item)
            return {
              date: toText(row.date) ?? '',
              served: toNonNegativeInt(row.served),
              impressions: toNonNegativeInt(row.impressions),
              clicks: toNonNegativeInt(row.clicks),
              ctrPercent: toNumber(row.ctrPercent, 0),
              fillRatePercent: toNumber(row.fillRatePercent, 0),
            }
          })
        : [],
      breakdown: {
        bySlot: mapBreakdown(toRecord(record.breakdown).bySlot),
        byAudience: mapBreakdown(toRecord(record.breakdown).byAudience),
        byDevice: mapBreakdown(toRecord(record.breakdown).byDevice),
      },
      generatedAt: toIsoDateOrNull(record.generatedAt),
    }
  },

  listAffiliateLinks: async (
    query: BrandPortalAffiliateLinksQuery = {},
  ): Promise<BrandPortalAffiliateLinksResponse> => {
    const response = await apiClient.get('/brand-portal/affiliate-links', {
      params: withQuery(query),
    })
    const record = toRecord(response.data)
    const summary = toRecord(record.summary)

    return {
      items: Array.isArray(record.items)
        ? record.items
            .map((item) => mapAffiliateLinkItem(item))
            .filter((item): item is NonNullable<typeof item> => Boolean(item))
        : [],
      pagination: toPagination(record.pagination),
      summary: {
        total: toNonNegativeInt(summary.total),
        active: toNonNegativeInt(summary.active),
        clicksOnPage: toNonNegativeInt(summary.clicksOnPage),
        conversionsOnPage: toNonNegativeInt(summary.conversionsOnPage),
        revenueCentsOnPage: toNonNegativeInt(summary.revenueCentsOnPage),
      },
    }
  },

  createAffiliateLink: async (
    payload: BrandPortalAffiliateLinkCreatePayload,
  ): Promise<BrandPortalAffiliateLinkMutationResponse> => {
    const response = await apiClient.post('/brand-portal/affiliate-links', payload)
    const record = toRecord(response.data)
    const item = mapAffiliateLinkItem(record.item)
    if (!item) throw new Error('Resposta invalida na criacao de link de afiliacao.')
    return {
      message: toText(record.message) ?? 'Link de afiliacao criado com sucesso.',
      item,
    }
  },

  updateAffiliateLink: async (
    linkId: string,
    patch: BrandPortalAffiliateLinkUpdatePayload,
  ): Promise<BrandPortalAffiliateLinkMutationResponse> => {
    const response = await apiClient.patch(
      `/brand-portal/affiliate-links/${encodeURIComponent(linkId)}`,
      patch,
    )
    const record = toRecord(response.data)
    const item = mapAffiliateLinkItem(record.item)
    if (!item) throw new Error('Resposta invalida na atualizacao de link de afiliacao.')
    return {
      message: toText(record.message) ?? 'Link de afiliacao atualizado com sucesso.',
      item,
    }
  },

  listAffiliateLinkClicks: async (
    linkId: string,
    query: BrandPortalAffiliateLinkClicksQuery = {},
  ): Promise<BrandPortalAffiliateLinkClicksResponse> => {
    const response = await apiClient.get(
      `/brand-portal/affiliate-links/${encodeURIComponent(linkId)}/clicks`,
      { params: withQuery(query) },
    )
    const record = toRecord(response.data)
    const link = toRecord(record.link)
    const linkIdValue = toId(link)
    const code = toText(link.code)
    const destinationUrl = toText(link.destinationUrl)
    const directoryEntryId = toText(link.directoryEntryId)
    if (!linkIdValue || !code || !destinationUrl || !directoryEntryId) {
      throw new Error('Resposta invalida: detalhe do link de afiliacao incompleto.')
    }

    const summary = toRecord(record.summary)
    return {
      link: {
        id: linkIdValue,
        code,
        label: toText(link.label),
        destinationUrl,
        directoryEntryId,
      },
      items: Array.isArray(record.items)
        ? record.items.map((item) => {
            const row = toRecord(item)
            return {
              id: toId(row) ?? '',
              clickedAt: toIsoDateOrNull(row.clickedAt),
              converted: toBoolean(row.converted),
              convertedAt: toIsoDateOrNull(row.convertedAt),
              conversionValueCents:
                row.conversionValueCents === null ? null : toInt(row.conversionValueCents, 0),
              conversionCurrency: toText(row.conversionCurrency),
              conversionReference: toText(row.conversionReference),
              visitorUserId: toText(row.visitorUserId),
              userAgent: toText(row.userAgent),
              referrer: toText(row.referrer),
              utm: {
                source: toText(toRecord(row.utm).source),
                medium: toText(toRecord(row.utm).medium),
                campaign: toText(toRecord(row.utm).campaign),
                term: toText(toRecord(row.utm).term),
                content: toText(toRecord(row.utm).content),
              },
            }
          })
        : [],
      pagination: toPagination(record.pagination),
      summary: {
        clicks: toNonNegativeInt(summary.clicks),
        conversions: toNonNegativeInt(summary.conversions),
        conversionRate: toNumber(summary.conversionRate, 0),
        revenueCents: toNonNegativeInt(summary.revenueCents),
      },
    }
  },

  listIntegrationApiKeys: async (
    query: BrandPortalIntegrationApiKeysQuery = {},
  ): Promise<BrandPortalIntegrationApiKeysResponse> => {
    const response = await apiClient.get('/brand-portal/integrations/api-keys', {
      params: withQuery(query),
    })
    const record = toRecord(response.data)
    const summary = toRecord(record.summary)

    return {
      items: Array.isArray(record.items)
        ? record.items
            .map((item) => mapIntegrationApiKeyItem(item))
            .filter((item): item is NonNullable<typeof item> => Boolean(item))
        : [],
      pagination: toPagination(record.pagination),
      summary: {
        total: toNonNegativeInt(summary.total),
        active: toNonNegativeInt(summary.active),
        revoked: toNonNegativeInt(summary.revoked),
      },
    }
  },

  createIntegrationApiKey: async (
    payload: BrandPortalIntegrationApiKeyCreatePayload,
  ): Promise<BrandPortalIntegrationApiKeyCreateResponse> => {
    const response = await apiClient.post('/brand-portal/integrations/api-keys', payload)
    const record = toRecord(response.data)
    const item = mapIntegrationApiKeyItem(record.item)
    const apiKey = toText(record.apiKey)
    if (!item || !apiKey) {
      throw new Error('Resposta invalida na criacao de API key.')
    }

    return {
      message: toText(record.message) ?? 'API key de integracao criada com sucesso.',
      item,
      apiKey,
      warning: toText(record.warning),
    }
  },

  revokeIntegrationApiKey: async (
    keyId: string,
  ): Promise<Pick<BrandPortalIntegrationApiKeyCreateResponse, 'message' | 'item'>> => {
    const response = await apiClient.post(
      `/brand-portal/integrations/api-keys/${encodeURIComponent(keyId)}/revoke`,
      {},
    )
    const record = toRecord(response.data)
    const item = mapIntegrationApiKeyItem(record.item)
    if (!item) throw new Error('Resposta invalida na revogacao de API key.')
    return {
      message: toText(record.message) ?? 'API key de integracao revogada com sucesso.',
      item,
    }
  },

  listIntegrationApiKeyUsage: async (
    keyId: string,
    query: BrandPortalIntegrationApiKeyUsageQuery = {},
  ): Promise<BrandPortalIntegrationApiKeyUsageResponse> => {
    const response = await apiClient.get(
      `/brand-portal/integrations/api-keys/${encodeURIComponent(keyId)}/usage`,
      {
        params: withQuery(query),
      },
    )
    const record = toRecord(response.data)
    const apiKey = mapIntegrationApiKeyItem(record.apiKey)
    if (!apiKey) throw new Error('Resposta invalida: API key em falta no usage.')

    const summary = toRecord(record.summary)
    return {
      apiKey,
      items: Array.isArray(record.items)
        ? record.items.map((item) => {
            const row = toRecord(item)
            return {
              id: toId(row) ?? '',
              apiKeyId: toText(row.apiKeyId) ?? '',
              keyPrefix: toText(row.keyPrefix) ?? '',
              directoryEntryId: toText(row.directoryEntryId) ?? '',
              scope: INTEGRATION_SCOPE_SET.has(row.scope as BrandIntegrationScope)
                ? (row.scope as BrandIntegrationScope)
                : 'brand.affiliate.read',
              method: toText(row.method) ?? 'GET',
              path: toText(row.path) ?? '/',
              statusCode: Math.max(0, toInt(row.statusCode, 0)),
              durationMs: Math.max(0, toInt(row.durationMs, 0)),
              requestId: toText(row.requestId),
              userAgent: toText(row.userAgent),
              metadata: toRecord(row.metadata),
              createdAt: toIsoDateOrNull(row.createdAt),
            }
          })
        : [],
      pagination: toPagination(record.pagination),
      summary: {
        totalCalls: toNonNegativeInt(summary.totalCalls),
        avgDurationMs: Math.max(0, toInt(summary.avgDurationMs, 0)),
        status2xx: toNonNegativeInt(summary.status2xx),
        status4xx: toNonNegativeInt(summary.status4xx),
        status5xx: toNonNegativeInt(summary.status5xx),
      },
      topEndpoints: Array.isArray(record.topEndpoints)
        ? record.topEndpoints.map((item) => {
            const row = toRecord(item)
            return {
              method: toText(row.method) ?? 'GET',
              path: toText(row.path) ?? '/',
              calls: toNonNegativeInt(row.calls),
            }
          })
        : [],
    }
  },
}
