import { useMemo, type ElementType } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Eye, FileText, PenSquare, Star, Users } from 'lucide-react'

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { useMyArticles } from '@/features/hub/articles/hooks/useArticles'
import type { Article } from '@/features/hub/articles/types'
import { ratingService } from '@/features/hub/services/ratingService'
import { apiClient } from '@/lib/api/client'
import { ProtectedRoute } from '@/shared/guards'
import { DashboardLayout } from '@/shared/layouts'

const THIRTY_DAYS_IN_MS = 30 * 24 * 60 * 60 * 1000

type NumericCandidate = number | string | null | undefined
type ArticleWithLegacyFields = Article & {
  _id?: string
  views?: NumericCandidate
  ratingsCount?: NumericCandidate
}

const toFiniteNumber = (value: NumericCandidate): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return null
}

const parseDateScore = (value?: string): number => {
  if (!value) return 0
  const parsed = Date.parse(value)
  return Number.isNaN(parsed) ? 0 : parsed
}

const getArticleId = (article: ArticleWithLegacyFields): string =>
  article.id || article._id || article.slug

const getArticleStatus = (article: ArticleWithLegacyFields): string => {
  if (typeof article.status === 'string') return article.status
  return article.isPublished ? 'published' : 'draft'
}

const isPublishedArticle = (article: ArticleWithLegacyFields): boolean =>
  getArticleStatus(article) === 'published' || article.isPublished === true

const getArticleViews = (article: ArticleWithLegacyFields): number =>
  toFiniteNumber(article.viewCount) ?? toFiniteNumber(article.views) ?? 0

const getArticleRatingCount = (article: ArticleWithLegacyFields): number =>
  toFiniteNumber(article.ratingCount) ?? toFiniteNumber(article.ratingsCount) ?? 0

const formatNumber = (value: number): string => value.toLocaleString('pt-PT')

const formatDate = (value?: string): string => {
  const timestamp = parseDateScore(value)
  if (!timestamp) return 'sem data'

  return new Intl.DateTimeFormat('pt-PT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(timestamp))
}

const parseFollowersCount = (data: unknown): number => {
  if (!data || typeof data !== 'object') return 0
  const payload = data as Record<string, unknown>

  const direct =
    toFiniteNumber(payload.followersCount as NumericCandidate) ??
    toFiniteNumber(payload.total as NumericCandidate)
  if (direct !== null) return direct

  if (Array.isArray(payload.followers)) return payload.followers.length
  return 0
}

const parseAverageRating = (data: unknown): number | null => {
  if (!data || typeof data !== 'object') return null
  const payload = data as Record<string, unknown>

  const direct =
    toFiniteNumber(payload.averageRating as NumericCandidate) ??
    toFiniteNumber(payload.average as NumericCandidate)
  if (direct !== null) return direct

  const stats = payload.stats
  if (stats && typeof stats === 'object') {
    const statsRecord = stats as Record<string, unknown>
    const fromStats =
      toFiniteNumber(statsRecord.averageRating as NumericCandidate) ??
      toFiniteNumber(statsRecord.average as NumericCandidate)
    if (fromStats !== null) return fromStats
  }

  if (Array.isArray(payload.ratings) && payload.ratings.length > 0) {
    const ratings = payload.ratings
      .map((entry) => {
        if (!entry || typeof entry !== 'object') return null
        const item = entry as Record<string, unknown>
        return toFiniteNumber(item.rating as NumericCandidate)
      })
      .filter((entry): entry is number => entry !== null)

    if (ratings.length > 0) {
      return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
    }
  }

  return null
}

async function fetchFollowersCount(creatorId: string): Promise<number> {
  try {
    const response = await apiClient.get('/follow', { params: { creatorId } })
    return parseFollowersCount(response.data)
  } catch {
    try {
      const fallbackResponse = await apiClient.get(`/follow/${encodeURIComponent(creatorId)}/stats`)
      return parseFollowersCount(fallbackResponse.data)
    } catch {
      return 0
    }
  }
}

async function fetchCreatorAverageRating(creatorId: string): Promise<number> {
  try {
    const response = await apiClient.get('/ratings', { params: { creatorId } })
    const parsed = parseAverageRating(response.data)
    if (parsed !== null) return parsed
  } catch {
    // no-op: fallback abaixo
  }

  try {
    const stats = await ratingService.getRatingStats('creator', creatorId)
    return stats.averageRating
  } catch {
    return 0
  }
}

interface KpiCardProps {
  title: string
  value: string
  description: string
  icon: ElementType
}

function KpiCard({ title, value, description, icon: Icon }: KpiCardProps) {
  return (
    <Card className="border-border/60 bg-card/75">
      <CardHeader className="pb-2">
        <CardDescription className="flex items-center justify-between">
          <span>{title}</span>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardDescription>
        <CardTitle className="text-2xl tabular-nums">{value}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

function DashboardPage() {
  const user = useAuthStore((state) => state.user)
  const hydrated = useAuthStore((state) => state.hydrated)

  const articlesQuery = useMyArticles({
    limit: 100,
    sortBy: 'recent',
  })

  const followersQuery = useQuery({
    queryKey: ['creator-dashboard-followers', user?.id],
    queryFn: () => fetchFollowersCount(user!.id),
    enabled: hydrated && Boolean(user?.id),
    staleTime: 60_000,
  })

  const ratingQuery = useQuery({
    queryKey: ['creator-dashboard-rating', user?.id],
    queryFn: () => fetchCreatorAverageRating(user!.id),
    enabled: hydrated && Boolean(user?.id),
    staleTime: 60_000,
  })

  const metrics = useMemo(() => {
    const rawItems = articlesQuery.data?.items ?? []
    const items = rawItems as ArticleWithLegacyFields[]
    const now = Date.now()
    const threshold = now - THIRTY_DAYS_IN_MS

    const publishedArticles = items
      .filter(isPublishedArticle)
      .sort(
        (a, b) =>
          parseDateScore(b.publishedAt || b.updatedAt || b.createdAt) -
          parseDateScore(a.publishedAt || a.updatedAt || a.createdAt),
      )

    const viewsLast30Days = items.reduce((sum, article) => {
      const reference = parseDateScore(
        article.publishedAt || article.updatedAt || article.createdAt,
      )
      if (!reference || reference < threshold || reference > now) return sum
      return sum + getArticleViews(article)
    }, 0)

    const totalRatings = items.reduce((sum, article) => sum + getArticleRatingCount(article), 0)
    const weightedRatingSum = items.reduce(
      (sum, article) => sum + article.averageRating * getArticleRatingCount(article),
      0,
    )
    const fallbackAverageRating = totalRatings > 0 ? weightedRatingSum / totalRatings : 0

    return {
      totalPublications: publishedArticles.length,
      followersCount: followersQuery.data ?? 0,
      viewsLast30Days,
      averageRating: ratingQuery.data ?? fallbackAverageRating,
      latestPublishedArticles: publishedArticles.slice(0, 3),
    }
  }, [articlesQuery.data, followersQuery.data, ratingQuery.data])

  const isLoading =
    !hydrated ||
    articlesQuery.isLoading ||
    (Boolean(user?.id) && followersQuery.isLoading) ||
    (Boolean(user?.id) && ratingQuery.isLoading)

  const hasDataWarnings = articlesQuery.isError || followersQuery.isError || ratingQuery.isError

  return (
    <ProtectedRoute allowedRoles={['creator', 'admin']}>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Painel do Criador</h1>
              <p className="text-sm text-muted-foreground">
                Visao geral das publicacoes, alcance e qualidade do teu conteudo.
              </p>
            </div>
            <Button asChild>
              <a href="/creators/dashboard/articles/create">
                <PenSquare className="h-4 w-4" />
                Criar novo artigo
              </a>
            </Button>
          </div>

          {hasDataWarnings ? (
            <Card className="border-amber-500/40 bg-amber-500/10">
              <CardContent className="py-3 text-sm text-amber-200">
                Alguns dados nao responderam e o dashboard esta a mostrar a informacao disponivel.
              </CardContent>
            </Card>
          ) : null}

          {isLoading ? (
            <div className="flex min-h-[280px] items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : (
            <>
              <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <KpiCard
                  title="Total de publicacoes"
                  value={formatNumber(metrics.totalPublications)}
                  description="Artigos atualmente publicados."
                  icon={FileText}
                />
                <KpiCard
                  title="Seguidores"
                  value={formatNumber(metrics.followersCount)}
                  description="Total atual de seguidores do creator."
                  icon={Users}
                />
                <KpiCard
                  title="Views (30 dias)"
                  value={formatNumber(metrics.viewsLast30Days)}
                  description="Views dos artigos atualizados/publicados nos ultimos 30 dias."
                  icon={Eye}
                />
                <KpiCard
                  title="Rating medio"
                  value={metrics.averageRating.toFixed(1)}
                  description="Media das reviews recebidas."
                  icon={Star}
                />
              </section>

              <section className="rounded-xl border border-border/60 bg-card/75 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold">Ultimos 3 artigos publicados</h2>
                  <Button variant="outline" size="sm" asChild>
                    <a href="/creators/dashboard/articles">Gerir artigos</a>
                  </Button>
                </div>

                {metrics.latestPublishedArticles.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Ainda nao tens artigos publicados. Cria um novo artigo para aparecer aqui.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {metrics.latestPublishedArticles.map((article) => (
                      <a
                        key={`dashboard-latest-article-${getArticleId(article)}`}
                        href={`/creators/dashboard/articles/${encodeURIComponent(getArticleId(article))}/edit`}
                        className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2 text-sm transition-colors hover:bg-muted/40"
                      >
                        <span className="truncate pr-3">{article.title}</span>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {formatDate(
                            article.publishedAt || article.updatedAt || article.createdAt,
                          )}
                        </span>
                      </a>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}

export default {
  Page: DashboardPage,
}
