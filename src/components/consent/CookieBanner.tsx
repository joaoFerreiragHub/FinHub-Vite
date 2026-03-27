import { useEffect, useState } from 'react'
import { Link, useInRouterContext } from '@/lib/reactRouterDomCompat'
import { Button } from '@/components/ui'
import { authService } from '@/features/auth/services/authService'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import {
  DEFAULT_COOKIE_CONSENT_VERSION,
  buildCookieConsentSnapshot,
  dispatchCookieConsentUpdated,
  readStoredCookieConsent,
  writeStoredCookieConsent,
} from '@/features/auth/services/cookieConsentStorage'
import { getErrorMessage } from '@/lib/api/client'
import { initAnalytics } from '@/lib/analyticsProviders'

const cookieConsentVersion =
  import.meta.env.VITE_COOKIE_CONSENT_VERSION ||
  import.meta.env.VITE_LEGAL_VERSION ||
  DEFAULT_COOKIE_CONSENT_VERSION

const shouldHideCookieBannerInDev =
  import.meta.env.DEV && import.meta.env.VITE_SHOW_COOKIE_BANNER_IN_DEV !== 'true'

export function CookieBanner() {
  const inRouterContext = useInRouterContext()
  const user = useAuthStore((state) => state.user)
  const hydrated = useAuthStore((state) => state.hydrated)
  const updateUser = useAuthStore((state) => state.updateUser)

  const [visible, setVisible] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!hydrated) return

    if (user?.id && user.cookieConsent?.consentedAt) {
      writeStoredCookieConsent(user.cookieConsent)
      dispatchCookieConsentUpdated()
      setVisible(false)
      return
    }

    const storedConsent = readStoredCookieConsent()
    setVisible(!storedConsent?.consentedAt)
  }, [hydrated, user?.id, user?.cookieConsent])

  const saveConsent = async (accepted: boolean) => {
    setIsSaving(true)
    setError(null)

    const nextConsent = buildCookieConsentSnapshot({
      analytics: accepted,
      marketing: false,
      preferences: false,
      version: cookieConsentVersion,
    })

    try {
      if (user?.id) {
        const [cookieResponse, profileResponse] = await Promise.all([
          authService.updateCookieConsent({
            analytics: accepted,
            marketing: false,
            preferences: false,
            version: cookieConsentVersion,
          }),
          authService.updateMyProfile({ allowAnalytics: accepted }),
        ])

        updateUser({
          cookieConsent: cookieResponse.cookieConsent,
          allowAnalytics: profileResponse.user.allowAnalytics !== false,
        })

        writeStoredCookieConsent(cookieResponse.cookieConsent)
      } else {
        writeStoredCookieConsent(nextConsent)
      }

      dispatchCookieConsentUpdated()
      initAnalytics()
      setVisible(false)
    } catch (saveError) {
      setError(getErrorMessage(saveError))
    } finally {
      setIsSaving(false)
    }
  }

  if (shouldHideCookieBannerInDev || !hydrated || !visible) return null

  return (
    <section className="fixed bottom-4 left-4 right-4 z-[80]">
      <div className="mx-auto w-full max-w-4xl rounded-xl border border-border bg-card p-4 shadow-xl sm:p-5">
        <h2 className="text-sm font-semibold text-foreground sm:text-base">
          Privacidade e analytics
        </h2>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
          A FinHub usa cookies essenciais para sessao e seguranca. Analytics so e ativado com o teu
          consentimento explicito. Consulta a{' '}
          {inRouterContext ? (
            <Link to="/legal/cookies" className="font-medium text-primary hover:underline">
              Politica de Cookies
            </Link>
          ) : (
            <a href="/legal/cookies" className="font-medium text-primary hover:underline">
              Politica de Cookies
            </a>
          )}
          .
        </p>

        {error ? (
          <p className="mt-3 rounded-md border border-red-500/40 bg-red-500/10 p-2 text-xs text-red-300">
            Nao foi possivel guardar a preferencia: {error}
          </p>
        ) : null}

        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={isSaving}
            onClick={() => saveConsent(false)}
          >
            Recusar
          </Button>
          <Button type="button" size="sm" disabled={isSaving} onClick={() => saveConsent(true)}>
            Aceitar
          </Button>
        </div>
      </div>
    </section>
  )
}
