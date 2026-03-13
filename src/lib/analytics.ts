import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { captureEvent, identifyUser } from './analyticsProviders'

type AuthMethod = 'password' | 'google' | 'unknown'

type ContentType =
  | 'article'
  | 'video'
  | 'course'
  | 'event'
  | 'podcast'
  | 'book'
  | 'creator'
  | 'resource'

export type EventName =
  | 'page_view'
  | 'click_button'
  | 'login_success'
  | 'sign_up_success'
  | 'feature_used'
  | 'error_occurred'
  | 'user_role_assigned'
  | 'content_viewed'
  | 'upgrade_to_premium'
  | `custom_${string}`

export interface TrackEventProps {
  name: EventName
  properties?: Record<string, unknown>
}

export interface ContentViewMatch {
  contentType: ContentType
  slug: string
}

const CONTENT_ROUTE_MATCHERS: Array<{
  pattern: RegExp
  contentType: ContentType
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

export function trackEvent({ name, properties }: TrackEventProps) {
  const { user } = useAuthStore.getState()
  const baseProps = {
    userId: user?.id || 'anonymous',
    userRole: user?.role || 'visitor',
  }

  captureEvent(name, { ...baseProps, ...properties })
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
