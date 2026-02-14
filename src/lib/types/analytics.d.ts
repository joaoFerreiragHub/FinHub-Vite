// src/types/analytics.d.ts
import type { PostHog } from 'posthog-js'

type AnalyticsPrimitive = string | number | boolean | null
export type AnalyticsProps = Record<string, AnalyticsPrimitive | AnalyticsPrimitive[]>

declare global {
  interface Window {
    // Google Analytics
    gtag?: (command: string, target: string, parameters?: AnalyticsProps) => void

    // Meta Pixel
    fbq?: (command: string, eventNameOrId: string, parameters?: AnalyticsProps) => void

    // PostHog
    posthog?: PostHog
  }
}

export {}
