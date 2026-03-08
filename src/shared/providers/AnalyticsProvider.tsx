import { useEffect, useState } from 'react'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import {
  COOKIE_CONSENT_UPDATED_EVENT,
  dispatchCookieConsentUpdated,
  readStoredCookieConsent,
  writeStoredCookieConsent,
} from '@/features/auth/services/cookieConsentStorage'
import { syncAnalyticsUserIdentity } from '@/lib/analytics'
import {
  initAnalytics,
  resetAnalyticsIdentity,
  setAnalyticsConsent,
} from '@/lib/analyticsProviders'

export function AnalyticsProvider() {
  const user = useAuthStore((state) => state.user)
  const hydrated = useAuthStore((state) => state.hydrated)
  const [visitorConsentGranted, setVisitorConsentGranted] = useState<boolean>(() =>
    Boolean(readStoredCookieConsent()?.analytics),
  )

  useEffect(() => {
    initAnalytics()
  }, [])

  useEffect(() => {
    const syncVisitorConsent = () => {
      setVisitorConsentGranted(Boolean(readStoredCookieConsent()?.analytics))
    }

    syncVisitorConsent()
    window.addEventListener(COOKIE_CONSENT_UPDATED_EVENT, syncVisitorConsent)

    return () => {
      window.removeEventListener(COOKIE_CONSENT_UPDATED_EVENT, syncVisitorConsent)
    }
  }, [])

  useEffect(() => {
    if (!hydrated) return

    if (user?.cookieConsent) {
      writeStoredCookieConsent(user.cookieConsent)
      dispatchCookieConsentUpdated()
    }

    const consentGranted = user?.id ? Boolean(user.cookieConsent?.analytics) : visitorConsentGranted

    setAnalyticsConsent(consentGranted)

    if (consentGranted && user?.id) {
      syncAnalyticsUserIdentity()
      return
    }

    resetAnalyticsIdentity()
  }, [
    hydrated,
    visitorConsentGranted,
    user?.id,
    user?.cookieConsent?.analytics,
    user?.cookieConsent?.marketing,
    user?.cookieConsent?.preferences,
    user?.cookieConsent?.version,
    user?.email,
    user?.role,
    user?.username,
  ])

  return null
}
