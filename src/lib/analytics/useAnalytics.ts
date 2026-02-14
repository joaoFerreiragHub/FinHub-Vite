import { trackClick, trackEvent, trackFeature } from '../lib/analytics'

export function useAnalytics() {
  return {
    trackClick,
    trackFeature,
    trackEvent,
  }
}
