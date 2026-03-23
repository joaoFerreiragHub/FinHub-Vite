import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import {
  trackOnboardingCompleted,
  trackOnboardingSkipped,
  trackOnboardingStep,
} from '@/lib/analytics'

export type OnboardingStep = 1 | 2 | 3

const ONBOARDING_STEP_NAMES: Record<OnboardingStep, string> = {
  1: 'welcome',
  2: 'discovery',
  3: 'personalization',
}

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
    if (step === 1) {
      trackOnboardingStep(1, ONBOARDING_STEP_NAMES[1])
      setStep(2)
      return
    }
    if (step === 2) {
      trackOnboardingStep(2, ONBOARDING_STEP_NAMES[2])
      setStep(3)
      return
    }
    setStep(3)
  }, [step])

  const complete = useCallback(() => {
    trackOnboardingStep(3, ONBOARDING_STEP_NAMES[3])
    trackOnboardingCompleted(selectedTopics.length)
    persistDone(selectedTopics)
  }, [persistDone, selectedTopics])

  const skip = useCallback(() => {
    trackOnboardingSkipped()
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
