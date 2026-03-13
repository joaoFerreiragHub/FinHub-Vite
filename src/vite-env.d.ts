/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string
  readonly VITE_ADMIN_SCOPES_FAIL_CLOSED?: string
  readonly VITE_GA_ID?: string
  readonly VITE_FB_PIXEL_ID?: string
  readonly VITE_POSTHOG_KEY?: string
  readonly VITE_POSTHOG_HOST?: string
  readonly VITE_SENTRY_DSN?: string
  readonly VITE_SENTRY_ENVIRONMENT?: string
  readonly VITE_SENTRY_RELEASE?: string
  readonly VITE_SENTRY_TRACES_SAMPLE_RATE?: string
  readonly VITE_CAPTCHA_PROVIDER?: 'disabled' | 'turnstile' | 'hcaptcha'
  readonly VITE_CAPTCHA_SITE_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    fbq?: (...args: unknown[]) => void
    turnstile?: {
      render: (container: string | HTMLElement, options: Record<string, unknown>) => string
      remove?: (widgetId: string) => void
      reset?: (widgetId?: string) => void
    }
    hcaptcha?: {
      render: (container: string | HTMLElement, options: Record<string, unknown>) => string
      remove?: (widgetId: string) => void
      reset?: (widgetId?: string) => void
    }
  }
}

export {}
