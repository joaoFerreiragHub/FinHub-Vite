import { useUserStore } from '../stores/useUserStore'

export type EventName =
  | 'page_view'
  | 'click_button'
  | 'login_success'
  | 'feature_used'
  | 'error_occurred'
  | 'user_role_assigned'
  | 'content_viewed'
  | 'upgrade_to_premium'
  | `custom_${string}`

export interface TrackEventProps {
  name: EventName
  properties?: Record<string, unknown>
}

export function trackEvent({ name, properties }: TrackEventProps) {
  const { user } = useUserStore.getState()
  const baseProps = {
    userId: user?.id || 'anonymous',
    userRole: user?.role || 'visitor',
  }
  console.log(`[Analytics] ${name}`, { ...baseProps, ...properties })
}

export function trackPageView(pathname: string) {
  trackEvent({ name: 'page_view', properties: { pathname } })
}

export function trackClick(label: string) {
  trackEvent({ name: 'click_button', properties: { label } })
}

export function trackFeature(name: string, meta?: Record<string, unknown>) {
  trackEvent({ name: 'feature_used', properties: { feature: name, ...meta } })
}
