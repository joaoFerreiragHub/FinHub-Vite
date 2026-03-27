import type { UserCookieConsent } from '@/features/auth/types'

export const COOKIE_CONSENT_STORAGE_KEY = 'finhub_cookie_consent'
const LEGACY_COOKIE_CONSENT_STORAGE_KEY = 'finhub-cookie-consent'
export const COOKIE_CONSENT_UPDATED_EVENT = 'finhub:cookie-consent-updated'
export const DEFAULT_COOKIE_CONSENT_VERSION = 'v1'

type CookieConsentStoredValue = 'accepted' | 'rejected'

interface CookieConsentInput {
  analytics?: boolean
  marketing?: boolean
  preferences?: boolean
  version?: string
}

const canUseStorage = (): boolean =>
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'

const toSnapshot = (
  value: CookieConsentStoredValue,
  consentedAt = new Date().toISOString(),
): UserCookieConsent => ({
  essential: true,
  analytics: value === 'accepted',
  marketing: false,
  preferences: false,
  consentedAt,
  version: DEFAULT_COOKIE_CONSENT_VERSION,
})

const toStoredValue = (consent: Pick<UserCookieConsent, 'analytics'>): CookieConsentStoredValue =>
  consent.analytics ? 'accepted' : 'rejected'

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

  const directValue = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY)
  if (directValue === 'accepted' || directValue === 'rejected') {
    return toSnapshot(directValue)
  }

  const legacyRawValue = window.localStorage.getItem(LEGACY_COOKIE_CONSENT_STORAGE_KEY)
  if (!legacyRawValue) return null

  try {
    const parsed = JSON.parse(legacyRawValue) as Partial<UserCookieConsent> | null
    if (!parsed || typeof parsed !== 'object') return null

    const migratedValue: CookieConsentStoredValue = parsed.analytics ? 'accepted' : 'rejected'
    window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, migratedValue)
    window.localStorage.removeItem(LEGACY_COOKIE_CONSENT_STORAGE_KEY)

    return {
      essential: parsed.essential !== false,
      analytics: migratedValue === 'accepted',
      marketing: Boolean(parsed.marketing),
      preferences: Boolean(parsed.preferences),
      consentedAt: parsed.consentedAt ?? new Date().toISOString(),
      version: parsed.version ?? DEFAULT_COOKIE_CONSENT_VERSION,
    }
  } catch (error) {
    console.warn('[cookie-consent] invalid local storage payload:', error)
    return null
  }
}

export const writeStoredCookieConsent = (consent: UserCookieConsent): void => {
  if (!canUseStorage()) return

  window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, toStoredValue(consent))
  window.localStorage.removeItem(LEGACY_COOKIE_CONSENT_STORAGE_KEY)
}

export const dispatchCookieConsentUpdated = (): void => {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(COOKIE_CONSENT_UPDATED_EVENT))
}
