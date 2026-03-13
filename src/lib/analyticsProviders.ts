import type { PostHog } from 'posthog-js'
import type { AnalyticsProps } from './types/analytics'

interface AnalyticsRuntimeConfigInput {
  enabled?: boolean
  posthogKey?: string | null
  posthogHost?: string | null
}

let posthogInstance: PostHog | null = null
let posthogInitPromise: Promise<PostHog | null> | null = null
let posthogConsentGranted = false
let posthogConsentResolved = false
let pendingIdentify: { userId: string; props?: AnalyticsProps } | null = null
const pendingEvents: Array<{ name: string; properties?: AnalyticsProps }> = []
const MAX_PENDING_EVENTS = 100

const ENV_POSTHOG_KEY =
  typeof import.meta.env.VITE_POSTHOG_KEY === 'string' ? import.meta.env.VITE_POSTHOG_KEY.trim() : ''
const ENV_POSTHOG_HOST =
  typeof import.meta.env.VITE_POSTHOG_HOST === 'string' && import.meta.env.VITE_POSTHOG_HOST.trim().length > 0
    ? import.meta.env.VITE_POSTHOG_HOST.trim()
    : 'https://app.posthog.com'

let runtimeAnalyticsEnabled = true
let runtimePosthogKey = ENV_POSTHOG_KEY
let runtimePosthogHost = ENV_POSTHOG_HOST

const resolvePosthogKey = (): string => (runtimeAnalyticsEnabled ? runtimePosthogKey : '')
const resolvePosthogHost = (): string => runtimePosthogHost || ENV_POSTHOG_HOST

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

const dropPendingQueue = () => {
  pendingEvents.length = 0
  pendingIdentify = null
}

const ensurePostHogInstance = async (): Promise<PostHog | null> => {
  const posthogKey = resolvePosthogKey()
  if (!posthogKey) return null
  if (posthogInstance) return posthogInstance
  if (posthogInitPromise) return posthogInitPromise

  posthogInitPromise = import('posthog-js')
    .then((module) => {
      const instance = module.default as PostHog

      instance.init(posthogKey, {
        api_host: resolvePosthogHost(),
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

export function configureAnalyticsRuntime(input: AnalyticsRuntimeConfigInput) {
  const nextEnabled = input.enabled !== false
  const nextKey =
    typeof input.posthogKey === 'string'
      ? input.posthogKey.trim()
      : input.posthogKey === null
        ? ''
        : ENV_POSTHOG_KEY
  const nextHost =
    typeof input.posthogHost === 'string' && input.posthogHost.trim().length > 0
      ? input.posthogHost.trim()
      : ENV_POSTHOG_HOST

  const changed =
    runtimeAnalyticsEnabled !== nextEnabled ||
    runtimePosthogKey !== nextKey ||
    runtimePosthogHost !== nextHost

  runtimeAnalyticsEnabled = nextEnabled
  runtimePosthogKey = nextKey
  runtimePosthogHost = nextHost

  if (!changed) return

  posthogInitPromise = null
  if (posthogInstance) {
    posthogInstance.reset?.()
    posthogInstance.opt_out_capturing?.()
    posthogInstance = null
  }

  if (!runtimeAnalyticsEnabled) {
    dropPendingQueue()
    return
  }

  if (posthogConsentGranted && resolvePosthogKey()) {
    void ensurePostHogInstance().then((instance) => {
      if (!instance || !posthogConsentGranted) return
      instance.opt_in_capturing?.()
      flushPendingQueue(instance)
    })
  }
}

export function isAnalyticsEnabled(): boolean {
  return (
    runtimeAnalyticsEnabled && posthogConsentResolved && posthogConsentGranted && Boolean(posthogInstance)
  )
}

export function setAnalyticsConsent(enabled: boolean) {
  posthogConsentResolved = true
  posthogConsentGranted = enabled && runtimeAnalyticsEnabled

  if (!posthogConsentGranted) {
    dropPendingQueue()

    if (posthogInstance) {
      posthogInstance.opt_out_capturing?.()
    }

    return
  }

  if (!resolvePosthogKey()) return

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
  if (!runtimeAnalyticsEnabled) return

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
  if (!runtimeAnalyticsEnabled) return

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
  if (!runtimeAnalyticsEnabled) {
    console.info('[analytics] PostHog disabled by runtime config')
    return
  }

  if (!resolvePosthogKey()) {
    console.info('[analytics] PostHog disabled: missing VITE_POSTHOG_KEY')
  }
}
