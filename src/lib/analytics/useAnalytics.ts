import { trackClick, trackEvent, trackFeature } from '../analytics'

export function useAnalytics() {
  return {
    trackClick,
    trackFeature,
    trackEvent,
  }
}
