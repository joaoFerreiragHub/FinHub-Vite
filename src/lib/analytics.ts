import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { apiClient } from './api/client'
import { captureEvent, identifyUser } from './analyticsProviders'

type AuthMethod = 'password' | 'google' | 'unknown'

export type AnalyticsContentType =
  | 'article'
  | 'video'
  | 'course'
  | 'event'
  | 'podcast'
  | 'book'
  | 'news'
  | 'creator'
  | 'resource'

export type AnalyticsShareMethod = 'link' | 'twitter' | 'whatsapp'
export type AnalyticsToolName = 'fire' | 'finhubscore' | 'mercados' | 'raiox'
type RecommendationSignalName =
  | 'content_viewed'
  | 'content_completed'
  | 'content_favorited'
  | 'not_interested'
type RecommendationSignalContentType = Extract<AnalyticsContentType, 'article' | 'video' | 'course'>

interface EventPropertiesMap {
  page_view: {
    pathname: string
  }
  click_button: {
    label: string
  }
  login_success: {
    method: AuthMethod
    redirectPath: string | null
  }
  sign_up_success: {
    method: AuthMethod
    redirectPath: string | null
  }
  feature_used: {
    feature: string
  } & Record<string, unknown>
  error_occurred: Record<string, unknown>
  user_role_assigned: Record<string, unknown>
  content_viewed: {
    contentType: AnalyticsContentType
    contentSlug: string
    pathname: string
  }
  upgrade_to_premium: Record<string, unknown>
  content_completed: {
    contentId: string
    contentType: AnalyticsContentType
    completionPercent: number
  }
  content_favorited: {
    contentId: string
    contentType: AnalyticsContentType
  }
  content_shared: {
    contentId: string
    contentType: AnalyticsContentType
    method: AnalyticsShareMethod
  }
  not_interested: {
    contentId: string
    contentType: AnalyticsContentType
    reason?: string
  }
  onboarding_step: {
    step: 1 | 2 | 3
    stepName: string
  }
  onboarding_completed: {
    interestsCount: number
  }
  onboarding_skipped: Record<string, never>
  search_performed: {
    query: string
    resultCount: number
  }
  search_result_clicked: {
    query: string
    resultIndex: number
    contentType: string
  }
  creator_followed: {
    creatorId: string
    creatorUsername: string
  }
  creator_unfollowed: {
    creatorId: string
  }
  tool_used: {
    toolName: AnalyticsToolName
  }
  fire_simulation_run: {
    targetAmount: number
    timeline: number
  }
  upgrade_cta_clicked: {
    source: string
  }
  ad_impression: {
    adId: string
    slotId: string
  }
  ad_clicked: {
    adId: string
    slotId: string
  }
  algo_reset: Record<string, never>
}

type KnownEventName = keyof EventPropertiesMap

export type EventName = KnownEventName | `custom_${string}`

type TrackKnownEventProps<TName extends KnownEventName> = {
  name: TName
  properties: EventPropertiesMap[TName]
}

type TrackCustomEventProps = {
  name: `custom_${string}`
  properties?: Record<string, unknown>
}

export type TrackEventProps<TName extends EventName = EventName> = TName extends KnownEventName
  ? TrackKnownEventProps<TName>
  : TrackCustomEventProps

export interface ContentViewMatch {
  contentType: AnalyticsContentType
  slug: string
}

const CONTENT_ROUTE_MATCHERS: Array<{
  pattern: RegExp
  contentType: AnalyticsContentType
}> = [
  { pattern: /^\/artigos\/([^/]+)$/, contentType: 'article' },
  { pattern: /^\/videos\/([^/]+)$/, contentType: 'video' },
  { pattern: /^\/cursos\/([^/]+)$/, contentType: 'course' },
  { pattern: /^\/eventos\/([^/]+)$/, contentType: 'event' },
  { pattern: /^\/podcasts\/([^/]+)$/, contentType: 'podcast' },
  { pattern: /^\/livros\/([^/]+)$/, contentType: 'book' },
  { pattern: /^\/criadores\/([^/]+)$/, contentType: 'creator' },
  { pattern: /^\/recursos\/([^/]+)$/, contentType: 'resource' },
]

const RESOURCE_STATIC_SLUGS = new Set([
  'corretoras',
  'plataformas',
  'exchanges',
  'apps',
  'sites',
  'podcasts',
  'livros',
  'comparar',
])
const RECOMMENDATION_SIGNAL_CONTENT_TYPES: ReadonlySet<RecommendationSignalContentType> = new Set([
  'article',
  'video',
  'course',
])

const normalizePathname = (pathname: string): string => {
  if (!pathname) return '/'
  if (pathname !== '/' && pathname.endsWith('/')) {
    return pathname.slice(0, -1)
  }
  return pathname
}

export const resolveContentViewMatch = (pathname: string): ContentViewMatch | null => {
  const normalizedPathname = normalizePathname(pathname)

  for (const matcher of CONTENT_ROUTE_MATCHERS) {
    const matched = normalizedPathname.match(matcher.pattern)
    if (!matched) continue

    const slug = matched[1]?.trim()
    if (!slug) return null

    if (matcher.contentType === 'resource' && RESOURCE_STATIC_SLUGS.has(slug.toLowerCase())) {
      continue
    }

    return {
      contentType: matcher.contentType,
      slug,
    }
  }

  return null
}

export function trackEvent<TName extends EventName>({ name, properties }: TrackEventProps<TName>) {
  const { user } = useAuthStore.getState()
  if (user?.allowAnalytics === false) return
  const baseProps = {
    userId: user?.id || 'anonymous',
    userRole: user?.role || 'visitor',
  }

  captureEvent(name, { ...baseProps, ...(properties ?? {}) })
}

export function syncAnalyticsUserIdentity() {
  const { user } = useAuthStore.getState()
  if (!user?.id) return

  identifyUser(user.id, {
    role: user.role,
    email: user.email,
    username: user.username,
  })
}

export function trackPageView(pathname: string) {
  trackEvent({ name: 'page_view', properties: { pathname } })
}

export function trackLoginSuccess(method: AuthMethod, redirectPath?: string) {
  trackEvent({
    name: 'login_success',
    properties: {
      method,
      redirectPath: redirectPath ?? null,
    },
  })
}

export function trackSignUpSuccess(method: AuthMethod, redirectPath?: string) {
  trackEvent({
    name: 'sign_up_success',
    properties: {
      method,
      redirectPath: redirectPath ?? null,
    },
  })
}

export function trackContentView(pathname: string) {
  const matched = resolveContentViewMatch(pathname)
  if (!matched) return

  trackEvent({
    name: 'content_viewed',
    properties: {
      contentType: matched.contentType,
      contentSlug: matched.slug,
      pathname: normalizePathname(pathname),
    },
  })
}

export function trackClick(label: string) {
  trackEvent({ name: 'click_button', properties: { label } })
}

export function trackFeature(name: string, meta?: Record<string, unknown>) {
  trackEvent({ name: 'feature_used', properties: { feature: name, ...meta } })
}

const isRecommendationSignalContentType = (
  contentType: AnalyticsContentType,
): contentType is RecommendationSignalContentType =>
  RECOMMENDATION_SIGNAL_CONTENT_TYPES.has(contentType as RecommendationSignalContentType)

export function postRecommendationSignal(
  signal: RecommendationSignalName,
  contentId: string,
  contentType: AnalyticsContentType,
) {
  const normalizedContentId = contentId.trim()
  if (!normalizedContentId) return
  if (!isRecommendationSignalContentType(contentType)) return

  const authState = useAuthStore.getState()
  if (!authState.isAuthenticated) return

  void apiClient
    .post('/user/signals', {
      signal,
      contentId: normalizedContentId,
      contentType,
    })
    .catch(() => {})
}

export function trackContentCompleted(
  contentId: string,
  contentType: AnalyticsContentType,
  completionPercent: number,
) {
  trackEvent({
    name: 'content_completed',
    properties: {
      contentId,
      contentType,
      completionPercent,
    },
  })
  postRecommendationSignal('content_completed', contentId, contentType)
}

export function trackContentFavorited(contentId: string, contentType: AnalyticsContentType) {
  trackEvent({
    name: 'content_favorited',
    properties: {
      contentId,
      contentType,
    },
  })
  postRecommendationSignal('content_favorited', contentId, contentType)
}

export function trackContentShared(
  contentId: string,
  contentType: AnalyticsContentType,
  method: AnalyticsShareMethod,
) {
  trackEvent({
    name: 'content_shared',
    properties: {
      contentId,
      contentType,
      method,
    },
  })
}

export function trackNotInterested(
  contentId: string,
  contentType: AnalyticsContentType,
  reason?: string,
) {
  trackEvent({
    name: 'not_interested',
    properties: {
      contentId,
      contentType,
      reason,
    },
  })
  postRecommendationSignal('not_interested', contentId, contentType)
}

export function trackOnboardingStep(step: 1 | 2 | 3, stepName: string) {
  trackEvent({
    name: 'onboarding_step',
    properties: {
      step,
      stepName,
    },
  })
}

export function trackOnboardingCompleted(interestsCount: number) {
  trackEvent({
    name: 'onboarding_completed',
    properties: {
      interestsCount,
    },
  })
}

export function trackOnboardingSkipped() {
  trackEvent({
    name: 'onboarding_skipped',
    properties: {},
  })
}

export function trackSearchPerformed(query: string, resultCount: number) {
  trackEvent({
    name: 'search_performed',
    properties: {
      query,
      resultCount,
    },
  })
}

export function trackSearchResultClicked(query: string, resultIndex: number, contentType: string) {
  trackEvent({
    name: 'search_result_clicked',
    properties: {
      query,
      resultIndex,
      contentType,
    },
  })
}

export function trackCreatorFollowed(creatorId: string, creatorUsername: string) {
  trackEvent({
    name: 'creator_followed',
    properties: {
      creatorId,
      creatorUsername,
    },
  })
}

export function trackCreatorUnfollowed(creatorId: string) {
  trackEvent({
    name: 'creator_unfollowed',
    properties: {
      creatorId,
    },
  })
}

export function trackToolUsed(toolName: AnalyticsToolName) {
  trackEvent({
    name: 'tool_used',
    properties: {
      toolName,
    },
  })
}

export function trackFireSimulationRun(targetAmount: number, timeline: number) {
  trackEvent({
    name: 'fire_simulation_run',
    properties: {
      targetAmount,
      timeline,
    },
  })
}

export function trackUpgradeCtaClicked(source: string) {
  trackEvent({
    name: 'upgrade_cta_clicked',
    properties: {
      source,
    },
  })
}

export function trackAdImpression(adId: string, slotId: string) {
  trackEvent({
    name: 'ad_impression',
    properties: {
      adId,
      slotId,
    },
  })
}

export function trackAdClicked(adId: string, slotId: string) {
  trackEvent({
    name: 'ad_clicked',
    properties: {
      adId,
      slotId,
    },
  })
}

export function trackAlgoReset() {
  trackEvent({
    name: 'algo_reset',
    properties: {},
  })
}
