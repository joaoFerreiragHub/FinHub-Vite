import { useEffect } from 'react'
import { JsonLd } from '@/components/seo/JsonLd'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Helmet } from '@/lib/helmet'
import { Clock3, Eye, Star, Users } from 'lucide-react'
import { useCourse } from '@/features/hub/courses/hooks/useCourses'
import { courseService } from '@/features/hub/courses/services/courseService'
import { platformRuntimeConfigService } from '@/features/platform/services/platformRuntimeConfigService'
import { postRecommendationSignal } from '@/lib/analytics'

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

const formatDurationMinutes = (minutes?: number): string => {
  if (!minutes || minutes <= 0) return 'Duracao indisponivel'
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h}h ${m}m`
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

const levelLabel = (level?: string): string => {
  if (level === 'beginner') return 'Iniciante'
  if (level === 'intermediate') return 'Intermedio'
  if (level === 'advanced') return 'Avancado'
  return 'Nivel geral'
}

const educationalLevelLabel = (level?: string): string => {
  if (level === 'advanced') return 'Advanced'
  if (level === 'intermediate') return 'Intermediate'
  return 'Beginner'
}

export default function CourseDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: course, isLoading, isError } = useCourse(slug || '')

  useEffect(() => {
    if (course?.id) {
      courseService.incrementView(course.id).catch(() => {})
      postRecommendationSignal('content_viewed', course.id, 'course')
    }
  }, [course?.id])

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (isError || !course) {
    return <Navigate to="/explorar/cursos" replace />
  }

  const seoDescription = course.description || course.excerpt || 'Curso FinHub'
  const authorName = resolveAuthor(course.creator)
  const authorUsername = resolveCreatorUsername(course.creator, authorName)
  const canonicalUrl =
    typeof window !== 'undefined'
      ? window.location.href
      : `${fallbackSiteUrl}/cursos/${encodeURIComponent(slug || '')}`
  const courseJsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: seoDescription,
    provider: {
      '@type': 'Organization',
      name: fallbackSeoConfig.siteName,
      url: fallbackSiteUrl,
    },
    instructor: {
      '@type': 'Person',
      name: authorName,
      url: `${fallbackSiteUrl}/creators/${encodeURIComponent(authorUsername)}`,
    },
    courseMode: 'online',
    educationalLevel: educationalLevelLabel(course.level),
    image: toAbsoluteUrl(course.coverImage),
    url: canonicalUrl,
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{`${course.title} | Curso FinHub`}</title>
        <meta name="description" content={seoDescription} />
        <meta property="og:title" content={course.title} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:type" content="website" />
        {course.coverImage ? <meta property="og:image" content={course.coverImage} /> : null}
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>
      <JsonLd schema={courseJsonLd} />
      <div className="px-4 py-8 sm:px-6 md:px-10 lg:px-12">
        <div className="mx-auto max-w-5xl space-y-6">
          <Link
            to="/explorar/cursos"
            className="inline-flex text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            Voltar para explorar cursos
          </Link>

          {course.coverImage ? (
            <div className="overflow-hidden rounded-2xl border border-border/60 bg-card">
              <img
                src={course.coverImage}
                alt={course.title}
                className="h-[320px] w-full object-cover"
              />
            </div>
          ) : null}

          <header className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
              <span className="rounded-full bg-primary/15 px-3 py-1 text-primary">Curso</span>
              {course.isPremium ? (
                <span className="rounded-full bg-amber-500/20 px-3 py-1 text-amber-300">
                  Premium
                </span>
              ) : null}
              <span className="rounded-full bg-muted px-3 py-1 text-muted-foreground">
                {levelLabel(course.level)}
              </span>
            </div>

            <h1 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl">
              {course.title}
            </h1>

            <p className="text-base text-muted-foreground sm:text-lg">{course.description}</p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span>{resolveAuthor(course.creator)}</span>
              <span>{formatDate(course.publishedAt || course.createdAt)}</span>
              <span className="inline-flex items-center gap-1">
                <Clock3 className="h-4 w-4" />
                {formatDurationMinutes(course.totalDuration)}
              </span>
              <span className="inline-flex items-center gap-1">
                <Users className="h-4 w-4" />
                {formatNumber(course.enrolledCount)} inscritos
              </span>
              <span className="inline-flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {formatNumber(course.viewCount)}
              </span>
              <span className="inline-flex items-center gap-1">
                <Star className="h-4 w-4 text-amber-400" />
                {course.averageRating.toFixed(1)} ({formatNumber(course.ratingCount)})
              </span>
            </div>
          </header>

          {course.learningOutcomes?.length ? (
            <section className="rounded-2xl border border-border/60 bg-card p-5 sm:p-6">
              <h2 className="mb-3 text-lg font-semibold text-foreground">O que vais aprender</h2>
              <ul className="grid gap-2 sm:grid-cols-2">
                {course.learningOutcomes.map((outcome, index) => (
                  <li key={`${outcome}-${index}`} className="text-sm text-muted-foreground">
                    - {outcome}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {course.modules?.length ? (
            <section className="space-y-3 rounded-2xl border border-border/60 bg-card p-5 sm:p-6">
              <h2 className="text-lg font-semibold text-foreground">
                Conteudo do curso ({course.totalModules} modulos, {course.totalLessons} aulas)
              </h2>
              {course.modules.map((module) => (
                <div
                  key={module.id}
                  className="rounded-xl border border-border/60 bg-background/60 px-4 py-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-medium text-foreground">{module.title}</h3>
                    <span className="text-xs text-muted-foreground">
                      {module.lessons.length} aulas · {formatDurationMinutes(module.duration)}
                    </span>
                  </div>
                  {module.description ? (
                    <p className="mt-2 text-sm text-muted-foreground">{module.description}</p>
                  ) : null}
                </div>
              ))}
            </section>
          ) : null}
        </div>
      </div>
    </div>
  )
}
