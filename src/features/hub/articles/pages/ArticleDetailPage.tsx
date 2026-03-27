import { useEffect, useMemo, useRef, useState } from 'react'
import DOMPurify from 'dompurify'
import { JsonLd } from '@/components/seo/JsonLd'
import { Helmet } from '@/lib/helmet'
import { CalendarClock, Heart } from 'lucide-react'
import { Navigate, useParams } from '@/lib/reactRouterDomCompat'
import { Button, Card } from '@/components/ui'
import { ContentMeta, RatingsSection, CommentSection } from '@/features/hub/components'
import { useArticle } from '../hooks/useArticles'
import { articleService } from '../services/articleService'
import { usePermissions, usePaywall } from '@/features/auth'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import type { UserSocialLinks } from '@/features/auth/types'
import { getErrorMessage } from '@/lib/api/client'
import { Permission, isRoleAtLeast } from '@/lib/permissions/config'
import { platformRuntimeConfigService } from '@/features/platform/services/platformRuntimeConfigService'
import { useComments } from '@/features/hub/hooks/useComments'
import { ContentType } from '@/features/hub/types'
import { FollowButton } from '@/features/social/components/FollowButton'
import {
  postRecommendationSignal,
  trackContentCompleted,
  trackContentFavorited,
} from '@/lib/analytics'

interface ArticleDetailPageProps {
  slug?: string
}

interface CreatorSummary {
  id: string
  name: string
  username: string
  avatar?: string
  bio?: string
  socialLinks?: UserSocialLinks
}

const fallbackSeoConfig = platformRuntimeConfigService.getFallback().seo
const fallbackSiteUrl = fallbackSeoConfig.siteUrl.replace(/\/$/, '')

const toNumber = (value: unknown, fallback = 0): number => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

const toString = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback

const toRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' ? (value as Record<string, unknown>) : {}

const resolveLikeCount = (article: unknown): number => {
  const row = toRecord(article)
  return toNumber(row.likeCount, toNumber(row.likes, 0))
}

const resolveViewCount = (article: unknown): number => {
  const row = toRecord(article)
  return toNumber(row.viewCount, toNumber(row.views, 0))
}

const resolveReadTime = (article: unknown): number | null => {
  const row = toRecord(article)
  const value = toNumber(row.readTime, toNumber(row.readingTime, 0))
  return value > 0 ? value : null
}

const resolveHasLiked = (article: unknown): boolean => {
  const row = toRecord(article)
  return Boolean(row.hasLiked ?? row.isLiked ?? false)
}

const resolveCreatorSummary = (article: unknown): CreatorSummary => {
  const row = toRecord(article)
  const creatorValue = row.creator
  const creatorRecord = toRecord(creatorValue)

  const fallbackId = toString(row.creatorId, toString(creatorValue, 'unknown-creator'))
  const fallbackName = toString(row.author, 'Criador FinHub')
  const fallbackUsername = fallbackName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-_]/g, '')

  const id = toString(
    creatorRecord.id,
    toString(creatorRecord._id, fallbackId || 'unknown-creator'),
  )
  const name = toString(creatorRecord.name, fallbackName || 'Criador FinHub')
  const username = toString(creatorRecord.username, fallbackUsername || 'creator')
  const avatar = toString(creatorRecord.avatar) || undefined
  const bio = toString(creatorRecord.bio) || undefined

  const socialLinksRecord = toRecord(creatorRecord.socialLinks)
  const hasSocialLinks = Object.keys(socialLinksRecord).length > 0

  return {
    id,
    name,
    username,
    avatar,
    bio,
    socialLinks: hasSocialLinks ? (socialLinksRecord as UserSocialLinks) : undefined,
  }
}

const resolveSocialLinks = (links?: UserSocialLinks): Array<{ label: string; url: string }> => {
  if (!links) {
    return []
  }

  const rows = Object.entries(links)
    .filter(([, url]) => typeof url === 'string' && url.trim().length > 0)
    .map(([platform, url]) => ({
      label: platform.charAt(0).toUpperCase() + platform.slice(1),
      url: String(url),
    }))

  return rows
}

const toOptionalDate = (value: unknown): string | undefined => {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return undefined
  }

  const parsed = Date.parse(value)
  if (!Number.isFinite(parsed)) {
    return undefined
  }

  return new Date(parsed).toISOString()
}

const toAbsoluteUrl = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined
  const normalized = value.trim()
  if (!normalized) return undefined
  if (normalized.startsWith('http://') || normalized.startsWith('https://')) return normalized
  if (normalized.startsWith('/')) return `${fallbackSiteUrl}${normalized}`
  return `${fallbackSiteUrl}/${normalized}`
}

const toWordCount = (value: unknown): number | undefined => {
  if (typeof value !== 'string') return undefined
  const plainText = value
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  if (!plainText) return undefined
  const words = plainText.split(' ').filter(Boolean)
  return words.length > 0 ? words.length : undefined
}

export function ArticleDetailPage({ slug }: ArticleDetailPageProps) {
  const params = useParams<{ slug: string }>()
  const resolvedSlug = (slug || params.slug || '').trim()

  const { data: article, isLoading, error } = useArticle(resolvedSlug)
  const { role, can } = usePermissions()
  const { PaywallComponent } = usePaywall()

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const currentUserId = useAuthStore((state) => state.user?.id)

  const creator = useMemo(() => resolveCreatorSummary(article), [article])
  const creatorLinks = useMemo(() => resolveSocialLinks(creator.socialLinks), [creator.socialLinks])

  const requiredRole = (article?.requiredRole ?? 'visitor') as Parameters<typeof isRoleAtLeast>[1]
  const hasAccess = article ? isRoleAtLeast(role, requiredRole) : false
  const commentsEnabled = article?.commentsEnabled ?? true
  const canLikeContent = can(Permission.POST_COMMENTS) && isAuthenticated

  const comments = useComments(ContentType.ARTICLE, article?.id ?? '', {
    enabled: hasAccess && commentsEnabled,
    currentUserId,
    contentQueryKey: ['article', resolvedSlug],
  })

  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [isLikeLoading, setIsLikeLoading] = useState(false)
  const [likeError, setLikeError] = useState<string | null>(null)
  const completionTrackedRef = useRef(false)

  useEffect(() => {
    if (article?.id) {
      articleService.incrementView(article.id).catch(() => {})
      postRecommendationSignal('content_viewed', article.id, 'article')
    }
  }, [article?.id])

  useEffect(() => {
    if (!article) {
      return
    }

    setIsLiked(resolveHasLiked(article))
    setLikeCount(resolveLikeCount(article))
    setLikeError(null)
  }, [article?.id, article])

  useEffect(() => {
    completionTrackedRef.current = false
  }, [article?.id])

  const sanitizedContent = useMemo(() => {
    if (!article?.content) {
      return ''
    }

    if (typeof window === 'undefined') {
      return article.content
    }

    return DOMPurify.sanitize(article.content)
  }, [article?.content])

  useEffect(() => {
    if (!article?.id || !hasAccess || completionTrackedRef.current) return
    if (typeof window === 'undefined') return

    const trackReadCompletion = () => {
      const doc = window.document.documentElement
      const scrollableHeight = doc.scrollHeight - doc.clientHeight
      const completionPercent =
        scrollableHeight <= 0 ? 100 : (doc.scrollTop / scrollableHeight) * 100

      if (completionPercent < 80) return

      completionTrackedRef.current = true
      trackContentCompleted(article.id, 'article', 80)
    }

    trackReadCompletion()
    window.addEventListener('scroll', trackReadCompletion, { passive: true })
    return () => window.removeEventListener('scroll', trackReadCompletion)
  }, [article?.id, hasAccess])

  const seoDescription = article?.description || article?.excerpt || 'Artigo FinHub'
  const keywords = Array.isArray(article?.tags)
    ? article.tags
        .map((tag) => (typeof tag === 'string' ? tag.trim() : ''))
        .filter((tag) => tag.length > 0)
        .join(', ')
    : ''
  const canonicalUrl =
    typeof window !== 'undefined'
      ? window.location.href
      : `${fallbackSiteUrl}/hub/articles/${encodeURIComponent(resolvedSlug)}`
  const creatorProfileUrl = `${fallbackSiteUrl}/creators/${encodeURIComponent(creator.username)}`
  const articleWordCount = toWordCount(article?.content ?? article?.excerpt ?? article?.description)
  const articleJsonLd: Record<string, unknown> | null = article
    ? {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        description: seoDescription,
        author: {
          '@type': 'Person',
          name: creator.name,
          url: creatorProfileUrl,
        },
        publisher: {
          '@type': 'Organization',
          name: fallbackSeoConfig.siteName,
          logo: `${fallbackSiteUrl}/logo.png`,
        },
        url: canonicalUrl,
        datePublished: toOptionalDate(article.publishedAt ?? article.createdAt),
        dateModified: toOptionalDate(article.updatedAt ?? article.publishedAt ?? article.createdAt),
        image: toAbsoluteUrl(article.coverImage),
        ...(keywords ? { keywords } : {}),
        ...(articleWordCount ? { wordCount: articleWordCount } : {}),
      }
    : null

  const handleToggleLike = async () => {
    if (!article?.id || !canLikeContent || isLikeLoading) {
      return
    }

    const previousLiked = isLiked
    const previousLikeCount = likeCount
    const nextLiked = !previousLiked

    setLikeError(null)
    setIsLikeLoading(true)
    setIsLiked(nextLiked)
    setLikeCount((current) => Math.max(0, current + (nextLiked ? 1 : -1)))

    try {
      const response = await articleService.toggleLike(article.id, nextLiked)
      setIsLiked(response.liked)
      setLikeCount(response.likeCount)
      if (response.liked) {
        trackContentFavorited(article.id, 'article')
      }
    } catch (mutationError) {
      setIsLiked(previousLiked)
      setLikeCount(previousLikeCount)
      setLikeError(getErrorMessage(mutationError))
    } finally {
      setIsLikeLoading(false)
    }
  }

  if (!resolvedSlug) {
    return <Navigate to="/hub/articles" replace />
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (error || !article) {
    return <Navigate to="/hub/articles" replace />
  }

  const readTime = resolveReadTime(article)
  const viewCount = resolveViewCount(article)

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{`${article.title} | FinHub`}</title>
        <meta name="description" content={seoDescription} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:type" content="article" />
        {article.coverImage ? <meta property="og:image" content={article.coverImage} /> : null}
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>
      <JsonLd schema={articleJsonLd} />

      {article.coverImage ? (
        <div className="relative h-80 overflow-hidden md:h-96">
          <img
            src={article.coverImage}
            alt={article.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        </div>
      ) : null}

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article className="space-y-6">
            <header className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  Artigo
                </span>
                {article.isPremium ? (
                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
                    Premium
                  </span>
                ) : null}
              </div>

              <h1 className="text-4xl font-bold leading-tight md:text-5xl">{article.title}</h1>
              <p className="text-xl text-muted-foreground">{article.description}</p>

              <div className="flex flex-wrap items-center gap-4">
                <ContentMeta content={article} showAvatar size="md" />
                {readTime ? (
                  <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                    <CalendarClock className="h-4 w-4" />
                    {readTime} min de leitura
                  </span>
                ) : null}
              </div>

              {article.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </header>

            <section className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  type="button"
                  variant={isLiked ? 'default' : 'outline'}
                  size="sm"
                  onClick={handleToggleLike}
                  disabled={!canLikeContent || isLikeLoading}
                  className="gap-2"
                >
                  <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                  {isLiked ? 'Gostaste' : 'Gostar'}
                  <span className="tabular-nums">{likeCount}</span>
                </Button>

                {!canLikeContent ? (
                  <p className="text-sm text-muted-foreground">
                    Faz login para gostar e interagir com este artigo.
                  </p>
                ) : null}
              </div>

              {likeError ? <p className="text-sm text-red-600">{likeError}</p> : null}
            </section>

            <hr className="border-border" />

            {hasAccess ? (
              <div
                className="prose prose-lg max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
              />
            ) : (
              <div className="space-y-6">
                {article.excerpt ? (
                  <div className="prose prose-lg max-w-none dark:prose-invert">
                    <p>{article.excerpt}</p>
                  </div>
                ) : null}
                <PaywallComponent
                  title="Conteudo Premium"
                  description={`Este artigo requer plano ${requiredRole.toUpperCase()}. Faz upgrade para continuar a ler.`}
                />
              </div>
            )}

            <hr className="border-border" />

            {hasAccess ? (
              <RatingsSection
                targetType="article"
                targetId={article.id}
                formTitle="Avaliar este artigo"
                contentQueryKey={['article', resolvedSlug]}
              />
            ) : null}

            <hr className="border-border" />

            {hasAccess && commentsEnabled ? (
              <section className="space-y-3">
                {comments.error ? (
                  <p className="text-sm text-red-600">
                    Erro ao carregar comentarios: {getErrorMessage(comments.error)}
                  </p>
                ) : null}

                <CommentSection
                  targetType={article.type}
                  targetId={article.id}
                  currentUserId={currentUserId}
                  response={comments.response}
                  enabled={commentsEnabled}
                  onSubmitComment={comments.submitComment}
                  onReplyComment={comments.replyToComment}
                  onEditComment={comments.editComment}
                  onDeleteComment={comments.deleteComment}
                  onLikeComment={comments.likeComment}
                  onLoadMore={comments.loadMore}
                  isLoading={comments.isLoading}
                  sortBy={comments.sortBy}
                  onSortChange={comments.setSortBy}
                />
              </section>
            ) : null}
          </article>

          <aside className="space-y-6">
            <Card className="sticky top-6 p-6">
              <h2 className="mb-4 text-lg font-semibold">Criador</h2>

              <div className="mb-4 flex items-center gap-3">
                {creator.avatar ? (
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
                    {creator.name.slice(0, 2).toUpperCase()}
                  </div>
                )}

                <div className="min-w-0">
                  <p className="truncate font-semibold text-foreground">{creator.name}</p>
                  <p className="truncate text-sm text-muted-foreground">@{creator.username}</p>
                </div>
              </div>

              {creator.bio ? (
                <p className="mb-4 text-sm text-muted-foreground">{creator.bio}</p>
              ) : null}

              {creator.id ? (
                <FollowButton
                  creatorId={creator.id}
                  creatorName={creator.name}
                  creatorUsername={creator.username}
                  creatorAvatar={creator.avatar}
                  creatorBio={creator.bio}
                  size="sm"
                />
              ) : null}

              {creatorLinks.length > 0 ? (
                <div className="mt-4 space-y-2 border-t border-border pt-4">
                  {creatorLinks.map((link) => (
                    <a
                      key={`${link.label}-${link.url}`}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-primary hover:underline"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              ) : null}
            </Card>

            <Card className="p-6">
              <h3 className="mb-3 text-sm font-semibold text-foreground">Estatisticas do artigo</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="tabular-nums">Views: {viewCount}</p>
                <p className="tabular-nums">Likes: {likeCount}</p>
                <p className="tabular-nums">Rating medio: {article.averageRating.toFixed(1)}</p>
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  )
}
