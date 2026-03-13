import * as Sentry from '@sentry/react'

const parseSampleRate = (rawValue: string | undefined, fallback: number): number => {
  const parsed = Number.parseFloat(rawValue ?? '')
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 1) {
    return fallback
  }

  return parsed
}

const sentryDsn = (import.meta.env.VITE_SENTRY_DSN ?? '').trim()
const sentryEnvironment = (
  import.meta.env.VITE_SENTRY_ENVIRONMENT ??
  import.meta.env.MODE ??
  'development'
).trim()
const sentryRelease = (import.meta.env.VITE_SENTRY_RELEASE ?? '').trim() || undefined
const sentryTracesSampleRate = parseSampleRate(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE, 0)
const sentryEnabled = sentryDsn.length > 0 && import.meta.env.MODE !== 'test'

let sentryInitialized = false

export const initializeSentry = (): void => {
  if (sentryInitialized) {
    return
  }

  sentryInitialized = true

  if (!sentryEnabled) {
    if (import.meta.env.DEV) {
      console.info('[sentry] disabled: configure VITE_SENTRY_DSN to enable frontend tracking')
    }
    return
  }

  Sentry.init({
    dsn: sentryDsn,
    environment: sentryEnvironment,
    release: sentryRelease,
    tracesSampleRate: sentryTracesSampleRate,
  })
}

export const isSentryEnabled = (): boolean => sentryEnabled
