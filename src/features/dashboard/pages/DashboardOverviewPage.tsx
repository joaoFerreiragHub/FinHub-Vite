import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { AlertTriangle, Clock3, Eye, FileText, Star, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import { articleService } from '@/features/hub/articles/services/articleService'
import { videoService } from '@/features/hub/videos/services/videoService'
import { courseService } from '@/features/hub/courses/services/courseService'
import { liveService } from '@/features/hub/lives/services/liveService'
import { podcastService } from '@/features/hub/podcasts/services/podcastService'
import { bookService } from '@/features/hub/books/services/bookService'
import { fetchPublicCreatorProfile } from '@/features/creators/services/publicCreatorsService'
import type { ContentListResponse } from '@/features/hub/types'

type DashboardContentType = 'article' | 'video' | 'course' | 'event' | 'podcast' | 'book'
type DashboardStatus = 'published' | 'draft' | 'other'

interface DashboardContentItem {
  id: string
  slug: string
  title: string
  type: DashboardContentType
  status: DashboardStatus
  viewCount: number
  averageRating: number
  ratingCount: number
  publishedAt?: string
  createdAt?: string
}

interface DashboardOverviewResult {
  items: DashboardContentItem[]
  hasErrors: boolean
  followersCount: number
}

const TYPE_LABEL: Record<DashboardContentType, string> = {
  article: 'Artigo',
  video: 'Video',
  course: 'Curso',
  event: 'Evento',
  podcast: 'Podcast',
  book: 'Livro',
}

const TYPE_ROUTE: Record<DashboardContentType, string> = {
  article: '/artigos',
  video: '/videos',
  course: '/cursos',
  event: '/eventos',
  podcast: '/podcasts',
  book: '/livros',
}

const DEFAULT_QUERY_LIMIT = 50

const parseNumber = (value: unknown): number => {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return 0
}

const parseDateScore = (value?: string): number => {
  if (!value) return 0
  const parsed = Date.parse(value)
  return Number.isNaN(parsed) ? 0 : parsed
}

const formatNumber = (value: number): string => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
  return `${Math.round(value)}`
}

const formatDate = (value?: string): string => {
  const parsed = parseDateScore(value)
  if (!parsed) return 'sem data'
  return new Intl.DateTimeFormat('pt-PT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(parsed))
}

const normalizeStatus = (row: Record<string, unknown>): DashboardStatus => {
  const status = typeof row.status === 'string' ? row.status.toLowerCase() : ''
  if (status === 'published') return 'published'
  if (status === 'draft') return 'draft'
  if (row.isPublished === true) return 'published'
  return 'other'
}

const toDashboardItems = (
  rows: unknown[],
  type: DashboardContentType,
): DashboardContentItem[] =>
  rows
    .map((raw) => {
      if (!raw || typeof raw !== 'object') return null
      const row = raw as Record<string, unknown>
      const id = typeof row.id === 'string' ? row.id : typeof row._id === 'string' ? row._id : ''
      const slug =
        typeof row.slug === 'string' ? row.slug : id || (typeof row.title === 'string' ? row.title : '')
      if (!slug) return null

      return {
        id: id || slug,
        slug,
        title: typeof row.title === 'string' ? row.title : 'Sem titulo',
        type,
        status: normalizeStatus(row),
        viewCount: parseNumber(row.viewCount ?? row.views),
        averageRating: parseNumber(row.averageRating),
        ratingCount: parseNumber(row.ratingCount ?? row.ratingsCount),
        publishedAt: typeof row.publishedAt === 'string' ? row.publishedAt : undefined,
        createdAt: typeof row.createdAt === 'string' ? row.createdAt : undefined,
      }
    })
    .filter((item): item is DashboardContentItem => item !== null)

const fetchDashboardOverview = async (username?: string): Promise<DashboardOverviewResult> => {
  const filters = { limit: DEFAULT_QUERY_LIMIT, sortBy: 'recent' as const }
  const calls: Array<Promise<ContentListResponse<unknown>>> = [
    articleService.getMyArticles(filters),
    videoService.getMyVideos(filters),
    courseService.getMyCourses(filters),
    liveService.getMyLives(filters),
    podcastService.getMyPodcasts(filters),
    bookService.getMyBooks(filters),
  ]

  const [contentResponses, profile] = await Promise.all([
    Promise.allSettled(calls),
    username ? fetchPublicCreatorProfile(username).catch(() => null) : Promise.resolve(null),
  ])

  const items: DashboardContentItem[] = []
  let hasErrors = false

  const types: DashboardContentType[] = [
    'article',
    'video',
    'course',
    'event',
    'podcast',
    'book',
  ]

  contentResponses.forEach((result, index) => {
    if (result.status === 'rejected') {
      hasErrors = true
      return
    }

    const rows = Array.isArray(result.value.items) ? result.value.items : []
    items.push(...toDashboardItems(rows, types[index]))
  })

  return {
    items,
    hasErrors,
    followersCount: profile?.followersCount ?? 0,
  }
}

const buildContentLink = (item: DashboardContentItem): string =>
  `${TYPE_ROUTE[item.type]}/${encodeURIComponent(item.slug || item.id)}`

const statCardClass =
  'rounded-xl border border-border/60 bg-card p-4 shadow-sm transition-colors hover:border-border'

export default function DashboardOverviewPage() {
  const user = useAuthStore((state) => state.user)
  const isHydrated = useAuthStore((state) => state.hydrated)

  const overviewQuery = useQuery({
    queryKey: ['creator-dashboard-overview', user?.id],
    queryFn: () => fetchDashboardOverview(user?.username),
    enabled: isHydrated && Boolean(user?.id),
    staleTime: 60_000,
    retry: 1,
  })

  const metrics = useMemo(() => {
    const items = overviewQuery.data?.items ?? []
    const totalContent = items.length
    const publishedCount = items.filter((item) => item.status === 'published').length
    const draftCount = items.filter((item) => item.status === 'draft').length
    const totalViews = items.reduce((acc, item) => acc + item.viewCount, 0)

    const totalRatings = items.reduce((acc, item) => acc + item.ratingCount, 0)
    const weightedRating = items.reduce(
      (acc, item) => acc + item.averageRating * item.ratingCount,
      0,
    )
    const avgRating = totalRatings > 0 ? weightedRating / totalRatings : 0

    const topContent = [...items]
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, 5)

    const recentContent = [...items]
      .sort(
        (a, b) =>
          parseDateScore(b.publishedAt || b.createdAt) - parseDateScore(a.publishedAt || a.createdAt),
      )
      .slice(0, 5)

    return {
      totalContent,
      publishedCount,
      draftCount,
      totalViews,
      avgRating,
      followersCount: overviewQuery.data?.followersCount ?? 0,
      topContent,
      recentContent,
    }
  }, [overviewQuery.data])

  if (!isHydrated || overviewQuery.isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Visao geral</h1>
        <p className="text-sm text-muted-foreground">
          Resumo operacional do teu conteudo publicado e performance recente.
        </p>
      </header>

      {overviewQuery.isError || overviewQuery.data?.hasErrors ? (
        <div className="flex items-start gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-200">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            Algumas fontes nao responderam. O dashboard mostra os dados disponiveis enquanto a API
            estabiliza.
          </p>
        </div>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <article className={statCardClass}>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Conteudo total</p>
          <p className="mt-1 text-2xl font-semibold">{formatNumber(metrics.totalContent)}</p>
        </article>
        <article className={statCardClass}>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Publicados</p>
          <p className="mt-1 text-2xl font-semibold">{formatNumber(metrics.publishedCount)}</p>
        </article>
        <article className={statCardClass}>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Rascunhos</p>
          <p className="mt-1 text-2xl font-semibold">{formatNumber(metrics.draftCount)}</p>
        </article>
        <article className={statCardClass}>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Views totais</p>
          <p className="mt-1 inline-flex items-center gap-1 text-2xl font-semibold">
            <Eye className="h-5 w-5 text-muted-foreground" />
            {formatNumber(metrics.totalViews)}
          </p>
        </article>
        <article className={statCardClass}>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Rating medio</p>
          <p className="mt-1 inline-flex items-center gap-1 text-2xl font-semibold">
            <Star className="h-5 w-5 text-amber-400" />
            {metrics.avgRating.toFixed(1)}
          </p>
        </article>
        <article className={statCardClass}>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Seguidores</p>
          <p className="mt-1 inline-flex items-center gap-1 text-2xl font-semibold">
            <Users className="h-5 w-5 text-muted-foreground" />
            {formatNumber(metrics.followersCount)}
          </p>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-xl border border-border/60 bg-card p-4">
          <h2 className="text-lg font-semibold">Top conteudos por views</h2>
          <div className="mt-3 space-y-2">
            {metrics.topContent.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sem conteudo suficiente para ranking.</p>
            ) : (
              metrics.topContent.map((item) => (
                <Link
                  key={`top-${item.type}-${item.id}`}
                  to={buildContentLink(item)}
                  className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2 text-sm hover:bg-muted/40"
                >
                  <span className="truncate pr-3">
                    [{TYPE_LABEL[item.type]}] {item.title}
                  </span>
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <Eye className="h-4 w-4" />
                    {formatNumber(item.viewCount)}
                  </span>
                </Link>
              ))
            )}
          </div>
        </article>

        <article className="rounded-xl border border-border/60 bg-card p-4">
          <h2 className="text-lg font-semibold">Conteudo mais recente</h2>
          <div className="mt-3 space-y-2">
            {metrics.recentContent.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sem conteudo publicado recentemente.</p>
            ) : (
              metrics.recentContent.map((item) => (
                <Link
                  key={`recent-${item.type}-${item.id}`}
                  to={buildContentLink(item)}
                  className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2 text-sm hover:bg-muted/40"
                >
                  <span className="truncate pr-3">
                    [{TYPE_LABEL[item.type]}] {item.title}
                  </span>
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <Clock3 className="h-4 w-4" />
                    {formatDate(item.publishedAt || item.createdAt)}
                  </span>
                </Link>
              ))
            )}
          </div>
        </article>
      </section>

      <section className="rounded-xl border border-border/60 bg-card p-4">
        <h2 className="text-lg font-semibold">Atalhos rapidos</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            to="/dashboard/criar"
            className="flex items-center gap-2 rounded-lg border border-border/60 px-3 py-2 text-sm hover:bg-muted/40"
          >
            <FileText className="h-4 w-4" />
            Criar novo conteudo
          </Link>
          <Link
            to="/dashboard/conteudo"
            className="flex items-center gap-2 rounded-lg border border-border/60 px-3 py-2 text-sm hover:bg-muted/40"
          >
            Gerir conteudo
          </Link>
          <Link
            to="/dashboard/analytics"
            className="flex items-center gap-2 rounded-lg border border-border/60 px-3 py-2 text-sm hover:bg-muted/40"
          >
            Ver analytics
          </Link>
        </div>
      </section>
    </div>
  )
}

