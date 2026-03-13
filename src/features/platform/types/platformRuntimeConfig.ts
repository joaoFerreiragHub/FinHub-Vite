export type RuntimeCaptchaProvider = 'disabled' | 'turnstile' | 'hcaptcha'

export interface PlatformRuntimeConfig {
  generatedAt: string
  analytics: {
    posthog: {
      enabled: boolean
      key: string | null
      host: string
    }
    googleAnalytics: {
      enabled: boolean
      measurementId: string | null
    }
    googleTagManager: {
      enabled: boolean
      containerId: string | null
    }
    metaPixel: {
      enabled: boolean
      pixelId: string | null
    }
  }
  captcha: {
    enabled: boolean
    provider: RuntimeCaptchaProvider
    siteKey: string | null
  }
  seo: {
    siteName: string
    siteUrl: string
    defaultDescription: string
    defaultImage: string
    noIndexExactPaths: string[]
    noIndexPrefixes: string[]
  }
}
