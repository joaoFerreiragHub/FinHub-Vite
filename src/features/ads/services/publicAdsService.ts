import axios from 'axios'
import { apiClient } from '@/lib/api/client'

export type PublicAdAudience = 'free' | 'premium'
export type PublicAdDevice = 'desktop' | 'mobile' | 'all'
export type PublicAdType = 'external_ads' | 'sponsored_ads' | 'house_ads' | 'value_ads'

export interface PublicAdSlotRef {
  slotId: string
  surface: string
  position: string
}

export interface PublicAdBrandRef {
  id: string
  name: string
  slug: string
  logo: string | null
  verticalType: string
}

export interface PublicAdItem {
  campaignId: string
  code: string | null
  adType: PublicAdType
  disclosureLabel: string | null
  headline: string
  body: string | null
  ctaText: string | null
  ctaUrl: string | null
  imageUrl: string | null
  slot: PublicAdSlotRef
  brand: PublicAdBrandRef | null
  impressionToken: string
}

export interface PublicAdServeResponse {
  item: PublicAdItem | null
  reason: string | null
}

export interface PublicAdServeQuery {
  slotId: string
  audience: PublicAdAudience
  device?: PublicAdDevice
  country?: string | null
  vertical?: string | null
  sessionKey?: string | null
}

export interface PublicAdTrackingResponse {
  recorded: boolean
  duplicate: boolean
  campaignId: string
  inferredImpression: boolean
}

interface BackendAdBrandRef {
  id?: string
  _id?: string
  name?: string
  slug?: string
  logo?: string | null
  verticalType?: string
}

interface BackendAdSlotRef {
  slotId?: string
  surface?: string
  position?: string
}

interface BackendAdItem {
  campaignId?: string
  code?: string | null
  adType?: string
  disclosureLabel?: string | null
  headline?: string
  body?: string | null
  ctaText?: string | null
  ctaUrl?: string | null
  imageUrl?: string | null
  slot?: BackendAdSlotRef
  brand?: BackendAdBrandRef | null
  impressionToken?: string
}

interface BackendServeResponse {
  item?: BackendAdItem | null
  reason?: string | null
}

interface BackendTrackingResponse {
  recorded?: boolean
  duplicate?: boolean
  campaignId?: string
  inferredImpression?: boolean
}

const PUBLIC_ADS_SESSION_STORAGE_KEY = 'finhub-public-ads-session'

const toText = (value: unknown): string | null => {
  if (typeof value !== 'string') return null
  const normalized = value.trim()
  return normalized.length > 0 ? normalized : null
}

const resolveId = (value: { id?: string; _id?: string }): string | null => {
  const id = toText(value.id)
  if (id) return id
  return toText(value._id)
}

const normalizeAdType = (value: unknown): PublicAdType => {
  if (value === 'external_ads') return 'external_ads'
  if (value === 'house_ads') return 'house_ads'
  if (value === 'value_ads') return 'value_ads'
  return 'sponsored_ads'
}

const normalizeDevice = (value: unknown): PublicAdDevice | null => {
  if (value === 'desktop') return 'desktop'
  if (value === 'mobile') return 'mobile'
  if (value === 'all') return 'all'
  return null
}

const normalizeAudience = (value: unknown): PublicAdAudience =>
  value === 'premium' ? 'premium' : 'free'

const generateSessionKey = (): string => {
  if (typeof window === 'undefined') return 'ssr'

  try {
    if (typeof window.crypto?.randomUUID === 'function') {
      return window.crypto.randomUUID()
    }
  } catch {
    // ignore
  }

  return `fhads-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`
}

export const getPublicAdsSessionKey = (): string => {
  if (typeof window === 'undefined') return 'ssr'

  try {
    const stored = toText(window.localStorage.getItem(PUBLIC_ADS_SESSION_STORAGE_KEY))
    if (stored) return stored

    const generated = generateSessionKey()
    window.localStorage.setItem(PUBLIC_ADS_SESSION_STORAGE_KEY, generated)
    return generated
  } catch {
    return generateSessionKey()
  }
}

const mapAdItem = (raw: BackendAdItem | null | undefined): PublicAdItem | null => {
  if (!raw) return null

  const campaignId = toText(raw.campaignId)
  const headline = toText(raw.headline)
  const slotId = toText(raw.slot?.slotId)
  const slotSurface = toText(raw.slot?.surface)
  const slotPosition = toText(raw.slot?.position)
  const impressionToken = toText(raw.impressionToken)

  if (!campaignId || !headline || !slotId || !slotSurface || !slotPosition || !impressionToken) {
    return null
  }

  const brandId = raw.brand ? resolveId(raw.brand) : null
  const brandName = raw.brand ? toText(raw.brand.name) : null
  const brandSlug = raw.brand ? toText(raw.brand.slug) : null

  return {
    campaignId,
    code: toText(raw.code),
    adType: normalizeAdType(raw.adType),
    disclosureLabel: toText(raw.disclosureLabel),
    headline,
    body: toText(raw.body),
    ctaText: toText(raw.ctaText),
    ctaUrl: toText(raw.ctaUrl),
    imageUrl: toText(raw.imageUrl),
    slot: {
      slotId,
      surface: slotSurface,
      position: slotPosition,
    },
    brand:
      brandId && brandName && brandSlug
        ? {
            id: brandId,
            name: brandName,
            slug: brandSlug,
            logo: toText(raw.brand?.logo),
            verticalType: toText(raw.brand?.verticalType) ?? 'other',
          }
        : null,
    impressionToken,
  }
}

const mapTrackingResponse = (raw: BackendTrackingResponse | undefined): PublicAdTrackingResponse => ({
  recorded: raw?.recorded === true,
  duplicate: raw?.duplicate === true,
  campaignId: toText(raw?.campaignId) ?? '',
  inferredImpression: raw?.inferredImpression === true,
})

export const publicAdsService = {
  serve: async (query: PublicAdServeQuery): Promise<PublicAdServeResponse> => {
    const slotId = toText(query.slotId)?.toUpperCase()
    if (!slotId) {
      throw new Error('slotId e obrigatorio para selecionar anuncio.')
    }

    const sessionKey = toText(query.sessionKey) ?? getPublicAdsSessionKey()

    const params: Record<string, string> = {
      slot: slotId,
      audience: normalizeAudience(query.audience),
      session: sessionKey,
    }

    const device = normalizeDevice(query.device)
    if (device) params.device = device

    const country = toText(query.country)
    if (country) params.country = country

    const vertical = toText(query.vertical)
    if (vertical) params.vertical = vertical

    try {
      const response = await apiClient.get<BackendServeResponse>('/ads/serve', { params })
      return {
        item: mapAdItem(response.data?.item),
        reason: toText(response.data?.reason),
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status
        if (status === 404 || status === 400) {
          return {
            item: null,
            reason: toText((error.response?.data as { error?: string } | undefined)?.error),
          }
        }
      }

      throw error
    }
  },

  trackImpression: async (token: string): Promise<PublicAdTrackingResponse> => {
    const normalizedToken = toText(token)
    if (!normalizedToken) {
      throw new Error('token de impressao invalido.')
    }

    const response = await apiClient.post<BackendTrackingResponse>('/ads/impression', {
      token: normalizedToken,
    })

    return mapTrackingResponse(response.data)
  },

  trackClick: async (token: string): Promise<PublicAdTrackingResponse> => {
    const normalizedToken = toText(token)
    if (!normalizedToken) {
      throw new Error('token de clique invalido.')
    }

    const response = await apiClient.post<BackendTrackingResponse>('/ads/click', {
      token: normalizedToken,
    })

    return mapTrackingResponse(response.data)
  },
}
