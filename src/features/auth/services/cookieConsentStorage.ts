import type { UserCookieConsent } from '@/features/auth/types'

export const COOKIE_CONSENT_STORAGE_KEY = 'finhub-cookie-consent'
export const COOKIE_CONSENT_UPDATED_EVENT = 'finhub:cookie-consent-updated'
export const DEFAULT_COOKIE_CONSENT_VERSION = 'v1'

interface CookieConsentInput {
  analytics?: boolean
  marketing?: boolean
  preferences?: boolean
  version?: string
}

const canUseStorage = (): boolean =>
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'

export const buildCookieConsentSnapshot = (
  input: CookieConsentInput,
  consentedAt = new Date().toISOString(),
): UserCookieConsent => ({
  essential: true,
  analytics: Boolean(input.analytics),
  marketing: Boolean(input.marketing),
  preferences: Boolean(input.preferences),
  consentedAt,
  version: input.version?.trim() || DEFAULT_COOKIE_CONSENT_VERSION,
})

export const readStoredCookieConsent = (): UserCookieConsent | null => {
  if (!canUseStorage()) return null

  const rawValue = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY)
  if (!rawValue) return null

  try {
    const parsed = JSON.parse(rawValue) as Partial<UserCookieConsent> | null
    if (!parsed || typeof parsed !== 'object') return null

    return {
      essential: parsed.essential !== false,
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
      preferences: Boolean(parsed.preferences),
      consentedAt: parsed.consentedAt ?? null,
      version: parsed.version ?? DEFAULT_COOKIE_CONSENT_VERSION,
    }
  } catch (error) {
    console.warn('[cookie-consent] invalid local storage payload:', error)
    return null
  }
}

export const writeStoredCookieConsent = (consent: UserCookieConsent): void => {
  if (!canUseStorage()) return

  window.localStorage.setItem(
    COOKIE_CONSENT_STORAGE_KEY,
    JSON.stringify({
      essential: consent.essential !== false,
      analytics: Boolean(consent.analytics),
      marketing: Boolean(consent.marketing),
      preferences: Boolean(consent.preferences),
      consentedAt: consent.consentedAt ?? new Date().toISOString(),
      version: consent.version ?? DEFAULT_COOKIE_CONSENT_VERSION,
    }),
  )
}

export const dispatchCookieConsentUpdated = (): void => {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(COOKIE_CONSENT_UPDATED_EVENT))
}
