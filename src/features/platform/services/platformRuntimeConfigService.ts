import { apiClient } from '@/lib/api/client'
import type {
  PlatformRuntimeConfig,
  RuntimeCaptchaProvider,
} from '@/features/platform/types/platformRuntimeConfig'

interface BackendPlatformRuntimeConfigResponse {
  generatedAt?: unknown
  analytics?: {
    posthog?: {
      enabled?: unknown
      key?: unknown
      host?: unknown
    }
    googleAnalytics?: {
      enabled?: unknown
      measurementId?: unknown
    }
    googleTagManager?: {
      enabled?: unknown
      containerId?: unknown
    }
    metaPixel?: {
      enabled?: unknown
      pixelId?: unknown
    }
  }
  captcha?: {
    enabled?: unknown
    provider?: unknown
    siteKey?: unknown
  }
  seo?: {
    siteName?: unknown
    siteUrl?: unknown
    defaultDescription?: unknown
    defaultImage?: unknown
    noIndexExactPaths?: unknown
    noIndexPrefixes?: unknown
  }
}

const DEFAULT_SEO_NOINDEX_EXACT_PATHS = [
  '/login',
  '/registar',
  '/esqueci-password',
  '/reset-password',
  '/verificar-email',
  '/conta',
  '/meus-favoritos',
  '/a-seguir',
  '/notificacoes',
]
const DEFAULT_SEO_NOINDEX_PREFIXES = ['/admin', '/dashboard', '/oauth']

const toIsoDate = (value: unknown, fallback: string): string => {
  if (typeof value !== 'string' || value.trim().length === 0) return fallback
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? fallback : parsed.toISOString()
}

const toOptionalString = (value: unknown): string | null => {
  if (typeof value !== 'string') return null
  const normalized = value.trim()
  return normalized.length > 0 ? normalized : null
}

const toNonEmptyString = (value: unknown, fallback: string): string => {
  if (typeof value !== 'string') return fallback
  const normalized = value.trim()
  return normalized.length > 0 ? normalized : fallback
}

const toStringArray = (value: unknown, fallback: string[]): string[] => {
  if (!Array.isArray(value)) return [...fallback]
  const normalized = value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter((item) => item.length > 0)
  return Array.from(new Set(normalized))
}

const normalizeSiteUrl = (value: unknown, fallback: string): string => {
  const candidate = toNonEmptyString(value, fallback)
  try {
    return new URL(candidate).toString().replace(/\/$/, '')
  } catch {
    return fallback
  }
}

const parseCaptchaProvider = (
  value: unknown,
  fallback: RuntimeCaptchaProvider,
): RuntimeCaptchaProvider => {
  if (typeof value !== 'string') return fallback
  const normalized = value.trim().toLowerCase()
  if (normalized === 'turnstile' || normalized === 'hcaptcha' || normalized === 'disabled') {
    return normalized
  }
  return fallback
}

const runtimeEnv = (
  import.meta as unknown as {
    env?: Record<string, string | undefined> | null
  }
).env

const readEnv = (key: string): string | undefined => {
  if (!runtimeEnv || typeof runtimeEnv !== 'object') return undefined
  return runtimeEnv[key]
}

const fallbackGeneratedAt = new Date(0).toISOString()
const fallbackSiteUrl = normalizeSiteUrl(readEnv('VITE_SITE_URL'), 'https://finhub.pt')

const FALLBACK_RUNTIME_CONFIG: PlatformRuntimeConfig = {
  generatedAt: fallbackGeneratedAt,
  analytics: {
    posthog: {
      enabled: toOptionalString(readEnv('VITE_POSTHOG_KEY')) !== null,
      key: toOptionalString(readEnv('VITE_POSTHOG_KEY')),
      host: toNonEmptyString(readEnv('VITE_POSTHOG_HOST'), 'https://app.posthog.com'),
    },
    googleAnalytics: {
      enabled: toOptionalString(readEnv('VITE_GA_ID')) !== null,
      measurementId: toOptionalString(readEnv('VITE_GA_ID')),
    },
    googleTagManager: {
      enabled: toOptionalString(readEnv('VITE_GTM_ID')) !== null,
      containerId: toOptionalString(readEnv('VITE_GTM_ID')),
    },
    metaPixel: {
      enabled: toOptionalString(readEnv('VITE_FB_PIXEL_ID')) !== null,
      pixelId: toOptionalString(readEnv('VITE_FB_PIXEL_ID')),
    },
  },
  captcha: {
    enabled: parseCaptchaProvider(readEnv('VITE_CAPTCHA_PROVIDER'), 'disabled') !== 'disabled',
    provider: parseCaptchaProvider(readEnv('VITE_CAPTCHA_PROVIDER'), 'disabled'),
    siteKey: toOptionalString(readEnv('VITE_CAPTCHA_SITE_KEY')),
  },
  seo: {
    siteName: 'FinHub',
    siteUrl: fallbackSiteUrl,
    defaultDescription:
      'Plataforma de literacia financeira com conteudo, criadores e ferramentas para melhorar decisoes de investimento.',
    defaultImage: `${fallbackSiteUrl}/vite.svg`,
    noIndexExactPaths: DEFAULT_SEO_NOINDEX_EXACT_PATHS,
    noIndexPrefixes: DEFAULT_SEO_NOINDEX_PREFIXES,
  },
}

const cloneRuntimeConfig = (config: PlatformRuntimeConfig): PlatformRuntimeConfig => ({
  generatedAt: config.generatedAt,
  analytics: {
    posthog: { ...config.analytics.posthog },
    googleAnalytics: { ...config.analytics.googleAnalytics },
    googleTagManager: { ...config.analytics.googleTagManager },
    metaPixel: { ...config.analytics.metaPixel },
  },
  captcha: { ...config.captcha },
  seo: {
    ...config.seo,
    noIndexExactPaths: [...config.seo.noIndexExactPaths],
    noIndexPrefixes: [...config.seo.noIndexPrefixes],
  },
})

const mapRuntimeConfig = (raw: BackendPlatformRuntimeConfigResponse): PlatformRuntimeConfig => {
  const fallback = FALLBACK_RUNTIME_CONFIG

  const posthogEnabled =
    typeof raw.analytics?.posthog?.enabled === 'boolean'
      ? raw.analytics.posthog.enabled
      : fallback.analytics.posthog.enabled
  const posthogKey = toOptionalString(raw.analytics?.posthog?.key) ?? fallback.analytics.posthog.key
  const posthogHost = toNonEmptyString(
    raw.analytics?.posthog?.host,
    fallback.analytics.posthog.host,
  )

  const gaEnabled =
    typeof raw.analytics?.googleAnalytics?.enabled === 'boolean'
      ? raw.analytics.googleAnalytics.enabled
      : fallback.analytics.googleAnalytics.enabled
  const gaMeasurementId =
    toOptionalString(raw.analytics?.googleAnalytics?.measurementId) ??
    fallback.analytics.googleAnalytics.measurementId

  const gtmEnabled =
    typeof raw.analytics?.googleTagManager?.enabled === 'boolean'
      ? raw.analytics.googleTagManager.enabled
      : fallback.analytics.googleTagManager.enabled
  const gtmContainerId =
    toOptionalString(raw.analytics?.googleTagManager?.containerId) ??
    fallback.analytics.googleTagManager.containerId

  const metaPixelEnabled =
    typeof raw.analytics?.metaPixel?.enabled === 'boolean'
      ? raw.analytics.metaPixel.enabled
      : fallback.analytics.metaPixel.enabled
  const metaPixelId =
    toOptionalString(raw.analytics?.metaPixel?.pixelId) ?? fallback.analytics.metaPixel.pixelId

  const captchaEnabled =
    typeof raw.captcha?.enabled === 'boolean' ? raw.captcha.enabled : fallback.captcha.enabled
  const captchaProvider = parseCaptchaProvider(raw.captcha?.provider, fallback.captcha.provider)
  const captchaSiteKey = toOptionalString(raw.captcha?.siteKey) ?? fallback.captcha.siteKey

  const seoSiteName = toNonEmptyString(raw.seo?.siteName, fallback.seo.siteName)
  const seoSiteUrl = normalizeSiteUrl(raw.seo?.siteUrl, fallback.seo.siteUrl)
  const seoDescription = toNonEmptyString(
    raw.seo?.defaultDescription,
    fallback.seo.defaultDescription,
  )
  const seoImage = toNonEmptyString(raw.seo?.defaultImage, fallback.seo.defaultImage)
  const seoNoIndexExactPaths = toStringArray(
    raw.seo?.noIndexExactPaths,
    fallback.seo.noIndexExactPaths,
  )
  const seoNoIndexPrefixes = toStringArray(raw.seo?.noIndexPrefixes, fallback.seo.noIndexPrefixes)

  return {
    generatedAt: toIsoDate(raw.generatedAt, fallback.generatedAt),
    analytics: {
      posthog: {
        enabled: posthogEnabled,
        key: posthogKey,
        host: posthogHost,
      },
      googleAnalytics: {
        enabled: gaEnabled,
        measurementId: gaMeasurementId,
      },
      googleTagManager: {
        enabled: gtmEnabled,
        containerId: gtmContainerId,
      },
      metaPixel: {
        enabled: metaPixelEnabled,
        pixelId: metaPixelId,
      },
    },
    captcha: {
      enabled: captchaEnabled,
      provider: captchaProvider,
      siteKey: captchaSiteKey,
    },
    seo: {
      siteName: seoSiteName,
      siteUrl: seoSiteUrl,
      defaultDescription: seoDescription,
      defaultImage: seoImage,
      noIndexExactPaths: seoNoIndexExactPaths,
      noIndexPrefixes: seoNoIndexPrefixes,
    },
  }
}

export const getFallbackPlatformRuntimeConfig = (): PlatformRuntimeConfig =>
  cloneRuntimeConfig(FALLBACK_RUNTIME_CONFIG)

export const platformRuntimeConfigService = {
  get: async (): Promise<PlatformRuntimeConfig> => {
    const response = await apiClient.get<BackendPlatformRuntimeConfigResponse>(
      '/platform/runtime-config',
    )
    return mapRuntimeConfig(response.data)
  },
  getFallback: getFallbackPlatformRuntimeConfig,
}
