import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'

export type OnboardingStep = 1 | 2 | 3

const ONBOARDING_STORAGE_KEY = 'finhub-onboarding-done'
const ONBOARDING_PREFS_STORAGE_KEY = 'finhub_onboarding_prefs'
const ONBOARDING_DONE_LEGACY_KEY = 'finhub_onboarding_done'
const ONBOARDING_PREFS_LEGACY_KEY = 'finhub-onboarding-prefs'

export interface UseOnboardingResult {
  show: boolean
  step: OnboardingStep
  next: () => void
  skip: () => void
  complete: () => void
  selectedTopics: string[]
  toggleTopic: (topic: string) => void
}

export function useOnboarding(): UseOnboardingResult {
  const { isAuthenticated } = useAuthStore()
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(true)
  const [step, setStep] = useState<OnboardingStep>(1)
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])

  useEffect(() => {
    if (!isAuthenticated) {
      setHasCompletedOnboarding(true)
      setStep(1)
      setSelectedTopics([])
      return
    }

    if (typeof window === 'undefined') return

    try {
      const hasDoneFlag =
        window.localStorage.getItem(ONBOARDING_STORAGE_KEY) === '1' ||
        window.localStorage.getItem(ONBOARDING_DONE_LEGACY_KEY) === '1'
      const hasStoredPreferences =
        (window.localStorage.getItem(ONBOARDING_PREFS_STORAGE_KEY) ?? '').trim().length > 0 ||
        (window.localStorage.getItem(ONBOARDING_PREFS_LEGACY_KEY) ?? '').trim().length > 0

      setHasCompletedOnboarding(hasDoneFlag || hasStoredPreferences)
    } catch {
      // Fail-open to avoid blocking the UI if storage is unavailable.
      setHasCompletedOnboarding(true)
    }
    setStep(1)
    setSelectedTopics([])
  }, [isAuthenticated])

  const persistDone = useCallback((topics?: string[]) => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(ONBOARDING_STORAGE_KEY, '1')
        window.localStorage.setItem(ONBOARDING_DONE_LEGACY_KEY, '1')

        if (Array.isArray(topics) && topics.length > 0) {
          const serializedTopics = JSON.stringify({ interests: topics })
          window.localStorage.setItem(ONBOARDING_PREFS_STORAGE_KEY, serializedTopics)
          window.localStorage.setItem(ONBOARDING_PREFS_LEGACY_KEY, serializedTopics)
        }
      } catch {
        // Ignore storage write failures to avoid breaking navigation.
      }
    }
    setHasCompletedOnboarding(true)
  }, [])

  const next = useCallback(() => {
    setStep((prev) => {
      if (prev === 1) return 2
      if (prev === 2) return 3
      return 3
    })
  }, [])

  const complete = useCallback(() => {
    persistDone(selectedTopics)
  }, [persistDone, selectedTopics])

  const skip = useCallback(() => {
    persistDone()
  }, [persistDone])

  const toggleTopic = useCallback((topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((item) => item !== topic) : [...prev, topic],
    )
  }, [])

  const show = useMemo(
    () => isAuthenticated && !hasCompletedOnboarding,
    [isAuthenticated, hasCompletedOnboarding],
  )

  return {
    show,
    step,
    next,
    skip,
    complete,
    selectedTopics,
    toggleTopic,
  }
}
