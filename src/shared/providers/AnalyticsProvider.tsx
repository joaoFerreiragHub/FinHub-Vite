import { useEffect, useState } from 'react'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import {
  COOKIE_CONSENT_UPDATED_EVENT,
  dispatchCookieConsentUpdated,
  readStoredCookieConsent,
  writeStoredCookieConsent,
} from '@/features/auth/services/cookieConsentStorage'
import { usePlatformRuntimeConfig } from '@/features/platform/hooks/usePlatformRuntimeConfig'
import { platformRuntimeConfigService } from '@/features/platform/services/platformRuntimeConfigService'
import { syncAnalyticsUserIdentity } from '@/lib/analytics'
import {
  configureAnalyticsRuntime,
  initAnalytics,
  resetAnalyticsIdentity,
  setAnalyticsConsent,
} from '@/lib/analyticsProviders'

export function AnalyticsProvider() {
  const user = useAuthStore((state) => state.user)
  const hydrated = useAuthStore((state) => state.hydrated)
  const userCookieConsent = user?.cookieConsent
  const userAllowsAnalytics = user?.allowAnalytics !== false
  const runtimeConfigQuery = usePlatformRuntimeConfig()
  const runtimeConfig = runtimeConfigQuery.data ?? platformRuntimeConfigService.getFallback()
  const runtimePosthog = runtimeConfig.analytics.posthog
  const [visitorConsentGranted, setVisitorConsentGranted] = useState<boolean>(() =>
    Boolean(readStoredCookieConsent()?.analytics),
  )

  useEffect(() => {
    configureAnalyticsRuntime({
      enabled: runtimePosthog.enabled,
      posthogKey: runtimePosthog.key,
      posthogHost: runtimePosthog.host,
    })
    initAnalytics()
  }, [runtimePosthog.enabled, runtimePosthog.host, runtimePosthog.key])

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

    if (userCookieConsent) {
      writeStoredCookieConsent(userCookieConsent)
      dispatchCookieConsentUpdated()
    }

    const cookieConsentGranted = user?.id
      ? Boolean(userCookieConsent?.analytics)
      : visitorConsentGranted

    const consentGranted = cookieConsentGranted && userAllowsAnalytics
    setAnalyticsConsent(consentGranted)

    if (consentGranted && user?.id) {
      syncAnalyticsUserIdentity()
      return
    }

    resetAnalyticsIdentity()
  }, [
    hydrated,
    runtimePosthog.enabled,
    runtimePosthog.host,
    runtimePosthog.key,
    userCookieConsent,
    userAllowsAnalytics,
    visitorConsentGranted,
    user?.id,
    user?.email,
    user?.role,
    user?.username,
  ])

  return null
}
