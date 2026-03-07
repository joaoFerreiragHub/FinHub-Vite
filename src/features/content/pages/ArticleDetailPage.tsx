import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Eye, Star } from 'lucide-react'
import { useArticle } from '@/features/hub/articles/hooks/useArticles'
import { articleService } from '@/features/hub/articles/services/articleService'

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

const hasHtml = (value: string): boolean => /<\/?[a-z][\s\S]*>/i.test(value)

export default function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: article, isLoading, isError } = useArticle(slug || '')

  useEffect(() => {
    if (article?.id) {
      articleService.incrementView(article.id).catch(() => {})
    }
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

  return (
    <div className="min-h-screen bg-background">
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
        </div>
      </div>
    </div>
  )
}

