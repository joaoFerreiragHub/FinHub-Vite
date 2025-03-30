import { trackClick, trackEvent, trackFeature } from '../lib/analytics'
export declare function useAnalytics(): {
  trackClick: typeof trackClick
  trackFeature: typeof trackFeature
  trackEvent: typeof trackEvent
}
