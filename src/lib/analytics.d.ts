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
export declare function trackEvent({ name, properties }: TrackEventProps): void
export declare function trackPageView(pathname: string): void
export declare function trackClick(label: string): void
export declare function trackFeature(name: string, meta?: Record<string, unknown>): void
