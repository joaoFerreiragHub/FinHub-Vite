import type { PostHog } from 'posthog-js'
import type { AnalyticsProps } from './types/analytics'

let posthogInstance: PostHog | null = null
let posthogInitPromise: Promise<PostHog | null> | null = null
let posthogConsentGranted = false

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com'

const ensurePostHogInstance = async (): Promise<PostHog | null> => {
  if (!POSTHOG_KEY) return null
  if (posthogInstance) return posthogInstance
  if (posthogInitPromise) return posthogInitPromise

  posthogInitPromise = import('posthog-js')
    .then((module) => {
      const instance = module.default as PostHog

      instance.init(POSTHOG_KEY, {
        api_host: POSTHOG_HOST,
        autocapture: true,
        capture_pageview: false,
        disable_session_recording: false,
      })

      posthogInstance = instance
      return instance
    })
    .catch((error) => {
      console.error('[analytics] PostHog init failed:', error)
      return null
    })

  return posthogInitPromise
}

export function isAnalyticsEnabled(): boolean {
  return posthogConsentGranted && Boolean(posthogInstance)
}

export function setAnalyticsConsent(enabled: boolean) {
  posthogConsentGranted = enabled

  if (!POSTHOG_KEY) return

  if (!enabled) {
    if (posthogInstance) {
      posthogInstance.opt_out_capturing?.()
    }
    return
  }

  void ensurePostHogInstance().then((instance) => {
    if (!instance) return
    instance.opt_in_capturing?.()
  })
}

export function resetAnalyticsIdentity() {
  posthogInstance?.reset?.()
}

export function captureEvent(name: string, properties?: AnalyticsProps) {
  if (!isAnalyticsEnabled()) return
  posthogInstance?.capture(name, properties)
}

export function identifyUser(userId: string, props?: AnalyticsProps) {
  if (!isAnalyticsEnabled()) return
  posthogInstance?.identify?.(userId, props)
}

export function initAnalytics() {
  // Consent-gated bootstrap. Real init is driven by setAnalyticsConsent().
  if (!POSTHOG_KEY) {
    console.info('[analytics] PostHog disabled: missing VITE_POSTHOG_KEY')
  }
}
