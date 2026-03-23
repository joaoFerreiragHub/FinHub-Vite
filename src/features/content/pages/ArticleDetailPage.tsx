import { useEffect, useRef } from 'react'
import { JsonLd } from '@/components/seo/JsonLd'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Helmet } from '@/lib/helmet'
import { Eye, Star } from 'lucide-react'
import { useArticle } from '@/features/hub/articles/hooks/useArticles'
import { articleService } from '@/features/hub/articles/services/articleService'
import { CommentSection } from '@/features/hub/components'
import { useComments } from '@/features/hub/hooks/useComments'
import { ContentType } from '@/features/hub/types'
import { getErrorMessage } from '@/lib/api/client'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { platformRuntimeConfigService } from '@/features/platform/services/platformRuntimeConfigService'
import { postRecommendationSignal, trackContentCompleted } from '@/lib/analytics'

const fallbackSeoConfig = platformRuntimeConfigService.getFallback().seo
const fallbackSiteUrl = fallbackSeoConfig.siteUrl.replace(/\/$/, '')

const formatDate = (value?: string): string => {
  if (!value) return 'Data indisponivel'
  const parsed = Date.parse(value)
  if (Number.isNaN(parsed)) return 'Data indisponivel'
  return new Intl.DateTimeFormat('pt-PT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(parsed))
}

const formatNumber = (value: number): string => {
  if (!Number.isFinite(value) || value <= 0) return '0'
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
  return `${Math.round(value)}`
}

const resolveAuthor = (creator: unknown): string => {
  if (!creator || typeof creator === 'string') return 'FinHub'
  const row = creator as { name?: string; username?: string }
  return row.name || row.username || 'FinHub'
}

const resolveCreatorUsername = (creator: unknown, fallbackName: string): string => {
  if (creator && typeof creator === 'object') {
    const row = creator as { username?: string }
    if (typeof row.username === 'string' && row.username.trim().length > 0) {
      return row.username.trim().toLowerCase()
    }
  }

  return fallbackName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-_]/g, '')
}

const toAbsoluteUrl = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined
  const normalized = value.trim()
  if (!normalized) return undefined
  if (normalized.startsWith('http://') || normalized.startsWith('https://')) return normalized
  if (normalized.startsWith('/')) return `${fallbackSiteUrl}${normalized}`
  return `${fallbackSiteUrl}/${normalized}`
}

const hasHtml = (value: string): boolean => /<\/?[a-z][\s\S]*>/i.test(value)

export default function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: article, isLoading, isError } = useArticle(slug || '')
  const completionTrackedRef = useRef(false)
  const currentUserId = useAuthStore((state) => state.user?.id)
  const comments = useComments(ContentType.ARTICLE, article?.id ?? '', {
    enabled: Boolean(article?.id && article.commentsEnabled),
    currentUserId,
    contentQueryKey: ['article', slug],
  })

  useEffect(() => {
    if (article?.id) {
      articleService.incrementView(article.id).catch(() => {})
      postRecommendationSignal('content_viewed', article.id, 'article')
    }
  }, [article?.id])

  useEffect(() => {
    completionTrackedRef.current = false
  }, [article?.id])

  useEffect(() => {
    if (!article?.id || completionTrackedRef.current) return
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
  }, [article?.id])

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (isError || !article) {
    return <Navigate to="/explorar/artigos" replace />
  }

  const body = article.content || article.excerpt || article.description
  const seoDescription = article.description || article.excerpt || 'Artigo FinHub'
  const authorName = resolveAuthor(article.creator)
  const authorUsername = resolveCreatorUsername(article.creator, authorName)
  const canonicalUrl =
    typeof window !== 'undefined'
      ? window.location.href
      : `${fallbackSiteUrl}/artigos/${encodeURIComponent(slug || '')}`
  const keywords = Array.isArray(article.tags)
    ? article.tags
        .map((tag) => (typeof tag === 'string' ? tag.trim() : ''))
        .filter((tag) => tag.length > 0)
        .join(', ')
    : ''
  const articleJsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: seoDescription,
    author: {
      '@type': 'Person',
      name: authorName,
      url: `${fallbackSiteUrl}/creators/${encodeURIComponent(authorUsername)}`,
    },
    publisher: {
      '@type': 'Organization',
      name: fallbackSeoConfig.siteName,
      logo: `${fallbackSiteUrl}/logo.png`,
    },
    datePublished: article.publishedAt || article.createdAt,
    dateModified: article.updatedAt || article.publishedAt || article.createdAt,
    image: toAbsoluteUrl(article.coverImage),
    url: canonicalUrl,
    ...(keywords ? { keywords } : {}),
  }

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
      <div className="px-4 py-8 sm:px-6 md:px-10 lg:px-12">
        <div className="mx-auto max-w-4xl space-y-6">
          <Link
            to="/explorar/artigos"
            className="inline-flex text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            Voltar para explorar artigos
          </Link>

          {article.coverImage ? (
            <div className="overflow-hidden rounded-2xl border border-border/60 bg-card">
              <img
                src={article.coverImage}
                alt={article.title}
                className="h-[320px] w-full object-cover"
              />
            </div>
          ) : null}

          <header className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
              <span className="rounded-full bg-primary/15 px-3 py-1 text-primary">Artigo</span>
              {article.isPremium ? (
                <span className="rounded-full bg-amber-500/20 px-3 py-1 text-amber-300">
                  Premium
                </span>
              ) : null}
            </div>

            <h1 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl">
              {article.title}
            </h1>

            <p className="text-base text-muted-foreground sm:text-lg">{article.description}</p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span>{resolveAuthor(article.creator)}</span>
              <span>{formatDate(article.publishedAt || article.createdAt)}</span>
              <span className="inline-flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {formatNumber(article.viewCount)}
              </span>
              <span className="inline-flex items-center gap-1">
                <Star className="h-4 w-4 text-amber-400" />
                {article.averageRating.toFixed(1)} ({formatNumber(article.ratingCount)})
              </span>
            </div>
          </header>

          <article className="rounded-2xl border border-border/60 bg-card p-5 sm:p-6">
            {hasHtml(body) ? (
              <div
                className="prose prose-slate max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: body }}
              />
            ) : (
              <div className="whitespace-pre-wrap text-sm leading-7 text-foreground">{body}</div>
            )}
          </article>

          {article.commentsEnabled && (
            <section className="space-y-3">
              {comments.error ? (
                <p className="text-sm text-red-600">
                  Erro ao carregar comentarios: {getErrorMessage(comments.error)}
                </p>
              ) : null}

              <CommentSection
                targetType={ContentType.ARTICLE}
                targetId={article.id}
                currentUserId={currentUserId}
                response={comments.response}
                enabled={article.commentsEnabled}
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
          )}
        </div>
      </div>
    </div>
  )
}
