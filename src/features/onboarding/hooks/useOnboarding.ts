import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'

export type OnboardingStep = 1 | 2 | 3

const ONBOARDING_STORAGE_KEY = 'finhub-onboarding-done'

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

    if (typeof window === 'undefined') {
      return
    }

    const isDone = window.localStorage.getItem(ONBOARDING_STORAGE_KEY) === '1'
    setHasCompletedOnboarding(isDone)
    setStep(1)
    setSelectedTopics([])
  }, [isAuthenticated])

  const persistDone = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(ONBOARDING_STORAGE_KEY, '1')
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
    persistDone()
  }, [persistDone])

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
