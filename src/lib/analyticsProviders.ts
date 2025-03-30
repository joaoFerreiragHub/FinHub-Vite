import type { PostHog } from 'posthog-js'
import { AnalyticsProps } from '../types/analytics'

let posthogInstance: PostHog | null = null

export function initGA() {
  const GA_ID = import.meta.env.VITE_GA_ID
  if (!GA_ID || typeof window.gtag !== 'function') return

  window.gtag('js', new Date().toISOString())
  window.gtag('config', GA_ID)
}

export function initMetaPixel() {
  const FB_PIXEL_ID = import.meta.env.VITE_FB_PIXEL_ID
  if (!FB_PIXEL_ID || typeof window.fbq !== 'function') return

  window.fbq('init', FB_PIXEL_ID)
  window.fbq('track', 'PageView')
}

export function initPostHog() {
  const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY
  const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com'

  if (!POSTHOG_KEY) return

  import('posthog-js').then((ph) => {
    const instance = ph.default as PostHog

    instance.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      autocapture: true,
      capture_pageview: true,
      disable_session_recording: false,
    })

    posthogInstance = instance
  })
}

export function captureEvent(name: string, properties?: AnalyticsProps) {
  posthogInstance?.capture(name, properties)
}

export function identifyUser(userId: string, props?: AnalyticsProps) {
  posthogInstance?.identify?.(userId, props)
}

export function initAnalytics() {
  if (import.meta.env.PROD) {
    initGA()
    initMetaPixel()
    initPostHog()
  }
}
