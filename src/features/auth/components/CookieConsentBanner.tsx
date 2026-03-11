import { useEffect, useMemo, useState } from 'react'
import { Link, useInRouterContext } from 'react-router-dom'
import { Button, Label, Switch } from '@/components/ui'
import { getErrorMessage } from '@/lib/api/client'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { authService } from '@/features/auth/services/authService'
import {
  DEFAULT_COOKIE_CONSENT_VERSION,
  buildCookieConsentSnapshot,
  dispatchCookieConsentUpdated,
  readStoredCookieConsent,
  writeStoredCookieConsent,
} from '@/features/auth/services/cookieConsentStorage'
import type { UserCookieConsent } from '@/features/auth/types'

interface CookieConsentPreferences {
  analytics: boolean
  marketing: boolean
  preferences: boolean
}

const cookieConsentVersion =
  import.meta.env.VITE_COOKIE_CONSENT_VERSION ||
  import.meta.env.VITE_LEGAL_VERSION ||
  DEFAULT_COOKIE_CONSENT_VERSION
const shouldHideCookieBannerInDev =
  import.meta.env.DEV && import.meta.env.VITE_SHOW_COOKIE_BANNER_IN_DEV !== 'true'

const toPreferences = (
  consent: UserCookieConsent | null | undefined,
): CookieConsentPreferences => ({
  analytics: Boolean(consent?.analytics),
  marketing: Boolean(consent?.marketing),
  preferences: Boolean(consent?.preferences),
})

export function CookieConsentBanner() {
  const inRouterContext = useInRouterContext()
  const user = useAuthStore((state) => state.user)
  const hydrated = useAuthStore((state) => state.hydrated)
  const updateUser = useAuthStore((state) => state.updateUser)
  const userCookieConsent = user?.cookieConsent

  const [visible, setVisible] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preferences, setPreferences] = useState<CookieConsentPreferences>({
    analytics: false,
    marketing: false,
    preferences: false,
  })

  useEffect(() => {
    if (!hydrated) return

    const storedConsent = readStoredCookieConsent()

    if (user?.id) {
      if (userCookieConsent?.consentedAt) {
        const userPreferences = toPreferences(userCookieConsent)
        setPreferences(userPreferences)
        writeStoredCookieConsent(userCookieConsent)
        dispatchCookieConsentUpdated()
        setVisible(false)
        return
      }

      if (storedConsent) {
        setPreferences(toPreferences(storedConsent))
      }
      setVisible(true)
      return
    }

    if (storedConsent?.consentedAt) {
      setPreferences(toPreferences(storedConsent))
      setVisible(false)
      return
    }

    setVisible(true)
  }, [hydrated, user?.id, userCookieConsent])

  const payload = useMemo(
    () => ({
      analytics: preferences.analytics,
      marketing: preferences.marketing,
      preferences: preferences.preferences,
      version: cookieConsentVersion,
    }),
    [preferences.analytics, preferences.marketing, preferences.preferences],
  )

  const saveConsent = async (next: CookieConsentPreferences) => {
    setIsSaving(true)
    setError(null)

    const nextPayload = {
      analytics: next.analytics,
      marketing: next.marketing,
      preferences: next.preferences,
      version: cookieConsentVersion,
    }

    try {
      if (user?.id) {
        const response = await authService.updateCookieConsent(nextPayload)
        updateUser({ cookieConsent: response.cookieConsent })
        writeStoredCookieConsent(response.cookieConsent)
      } else {
        writeStoredCookieConsent(buildCookieConsentSnapshot(nextPayload))
      }

      dispatchCookieConsentUpdated()
      setPreferences(next)
      setVisible(false)
    } catch (consentError) {
      setError(getErrorMessage(consentError))
    } finally {
      setIsSaving(false)
    }
  }

  if (shouldHideCookieBannerInDev || !hydrated || !visible) return null

  const renderLegalLink = (path: string, label: string) =>
    inRouterContext ? (
      <Link to={path} className="font-medium text-primary hover:underline">
        {label}
      </Link>
    ) : (
      <a href={path} className="font-medium text-primary hover:underline">
        {label}
      </a>
    )

  return (
    <section className="fixed bottom-4 left-4 right-4 z-[70]">
      <div className="mx-auto w-full max-w-4xl rounded-xl border border-border bg-card p-4 shadow-xl sm:p-5">
        <div className="flex flex-col gap-3">
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-foreground sm:text-base">
              Preferencias de cookies
            </h2>
            <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
              Usamos cookies essenciais para seguranca e sessao. Podes ativar analytics,
              preferencias e marketing. Consulta a{' '}
              {renderLegalLink('/cookies', 'Politica de Cookies')} e o{' '}
              {renderLegalLink('/aviso-legal', 'Aviso Legal Financeiro')}.
            </p>
          </div>

          <div className="grid gap-3 rounded-lg border border-border p-3 sm:grid-cols-3 sm:p-4">
            <div className="space-y-1">
              <Label htmlFor="cookie-analytics" className="text-sm text-foreground">
                Analytics
              </Label>
              <p className="text-xs text-muted-foreground">Melhorar produto com dados agregados.</p>
              <Switch
                id="cookie-analytics"
                checked={preferences.analytics}
                onCheckedChange={(checked) =>
                  setPreferences((current) => ({ ...current, analytics: Boolean(checked) }))
                }
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="cookie-preferences" className="text-sm text-foreground">
                Preferencias
              </Label>
              <p className="text-xs text-muted-foreground">
                Guardar opcoes de interface e personalizacao.
              </p>
              <Switch
                id="cookie-preferences"
                checked={preferences.preferences}
                onCheckedChange={(checked) =>
                  setPreferences((current) => ({ ...current, preferences: Boolean(checked) }))
                }
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="cookie-marketing" className="text-sm text-foreground">
                Marketing
              </Label>
              <p className="text-xs text-muted-foreground">
                Comunicar novidades e campanhas relevantes.
              </p>
              <Switch
                id="cookie-marketing"
                checked={preferences.marketing}
                onCheckedChange={(checked) =>
                  setPreferences((current) => ({ ...current, marketing: Boolean(checked) }))
                }
              />
            </div>
          </div>

          {error ? (
            <p className="rounded-md border border-red-500/40 bg-red-500/10 p-2 text-xs text-red-300">
              Nao foi possivel guardar o consentimento: {error}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={isSaving}
              onClick={() =>
                saveConsent({ analytics: false, marketing: false, preferences: false })
              }
            >
              Rejeitar nao essenciais
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={isSaving}
              onClick={() => saveConsent({ analytics: true, marketing: true, preferences: true })}
            >
              Aceitar tudo
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={isSaving}
              onClick={() => saveConsent(payload)}
              isLoading={isSaving}
            >
              Guardar escolhas
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
