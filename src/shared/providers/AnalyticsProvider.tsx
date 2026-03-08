import { useEffect } from 'react'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { syncAnalyticsUserIdentity } from '@/lib/analytics'
import { initAnalytics, resetAnalyticsIdentity, setAnalyticsConsent } from '@/lib/analyticsProviders'

export function AnalyticsProvider() {
  const user = useAuthStore((state) => state.user)
  const hydrated = useAuthStore((state) => state.hydrated)

  useEffect(() => {
    initAnalytics()
  }, [])

  useEffect(() => {
    if (!hydrated) return

    const consentGranted = Boolean(user?.cookieConsent?.analytics)
    setAnalyticsConsent(consentGranted)

    if (consentGranted && user?.id) {
      syncAnalyticsUserIdentity()
      return
    }

    resetAnalyticsIdentity()
  }, [hydrated, user?.id, user?.cookieConsent?.analytics, user?.email, user?.role, user?.username])

  return null
}
