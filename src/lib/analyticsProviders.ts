import type { PostHog } from 'posthog-js'
import type { AnalyticsProps } from './types/analytics'

let posthogInstance: PostHog | null = null
let posthogInitPromise: Promise<PostHog | null> | null = null
let posthogConsentGranted = false
let posthogConsentResolved = false
let pendingIdentify: { userId: string; props?: AnalyticsProps } | null = null
const pendingEvents: Array<{ name: string; properties?: AnalyticsProps }> = []
const MAX_PENDING_EVENTS = 100

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com'

const queueEvent = (name: string, properties?: AnalyticsProps) => {
  if (pendingEvents.length >= MAX_PENDING_EVENTS) {
    pendingEvents.shift()
  }
  pendingEvents.push({ name, properties })
}

const flushPendingQueue = (instance: PostHog) => {
  if (!posthogConsentGranted) return

  if (pendingIdentify) {
    instance.identify?.(pendingIdentify.userId, pendingIdentify.props)
    pendingIdentify = null
  }

  if (pendingEvents.length === 0) return

  const queueSnapshot = [...pendingEvents]
  pendingEvents.length = 0

  for (const event of queueSnapshot) {
    instance.capture(event.name, event.properties)
  }
}

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
      if (posthogConsentGranted) {
        flushPendingQueue(instance)
      }
      return instance
    })
    .catch((error) => {
      console.error('[analytics] PostHog init failed:', error)
      return null
    })

  return posthogInitPromise
}

export function isAnalyticsEnabled(): boolean {
  return posthogConsentResolved && posthogConsentGranted && Boolean(posthogInstance)
}

export function setAnalyticsConsent(enabled: boolean) {
  posthogConsentResolved = true
  posthogConsentGranted = enabled

  if (!enabled) {
    pendingEvents.length = 0
    pendingIdentify = null

    if (posthogInstance) {
      posthogInstance.opt_out_capturing?.()
    }

    return
  }

  if (!POSTHOG_KEY) return

  void ensurePostHogInstance().then((instance) => {
    if (!instance) return
    instance.opt_in_capturing?.()
    flushPendingQueue(instance)
  })
}

export function resetAnalyticsIdentity() {
  pendingIdentify = null
  posthogInstance?.reset?.()
}

export function captureEvent(name: string, properties?: AnalyticsProps) {
  if (!posthogConsentResolved) {
    queueEvent(name, properties)
    return
  }

  if (!posthogConsentGranted) return

  if (posthogInstance) {
    posthogInstance.capture(name, properties)
    return
  }

  queueEvent(name, properties)
  void ensurePostHogInstance().then((instance) => {
    if (!instance || !posthogConsentGranted) return
    flushPendingQueue(instance)
  })
}

export function identifyUser(userId: string, props?: AnalyticsProps) {
  if (!posthogConsentResolved) {
    pendingIdentify = { userId, props }
    return
  }

  if (!posthogConsentGranted) return

  if (posthogInstance) {
    posthogInstance.identify?.(userId, props)
    return
  }

  pendingIdentify = { userId, props }
  void ensurePostHogInstance().then((instance) => {
    if (!instance || !posthogConsentGranted) return
    flushPendingQueue(instance)
  })
}

export function initAnalytics() {
  // Consent-gated bootstrap. Real init is driven by setAnalyticsConsent().
  if (!POSTHOG_KEY) {
    console.info('[analytics] PostHog disabled: missing VITE_POSTHOG_KEY')
  }
}
