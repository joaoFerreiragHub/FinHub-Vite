import { useEffect, useMemo } from 'react'
import { Helmet } from '@/lib/helmet'
import { Navigate, useParams } from 'react-router-dom'
import { BookOpen, Clock3, GraduationCap } from 'lucide-react'
import { Button, Card } from '@/components/ui'
import { ContentMeta, RatingsSection, CommentSection } from '@/features/hub/components'
import { useCourse, useEnrollCourse } from '../hooks/useCourses'
import { courseService } from '../services/courseService'
import { usePermissions, usePaywall } from '@/features/auth'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import type { UserSocialLinks } from '@/features/auth/types'
import { getErrorMessage } from '@/lib/api/client'
import { isRoleAtLeast } from '@/lib/permissions/config'
import { useComments } from '@/features/hub/hooks/useComments'
import { ContentType } from '@/features/hub/types'
import { FollowButton } from '@/features/social/components/FollowButton'

interface CourseDetailPageProps {
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

interface CourseLesson {
  id: string
  title: string
  type: 'video' | 'article' | 'quiz' | 'assignment'
  duration: number
  isFree: boolean
}

interface CourseModuleView {
  id: string
  title: string
  description?: string
  duration: number
  lessons: CourseLesson[]
}

const toNumber = (value: unknown, fallback = 0): number => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

const toString = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback

const toRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' ? (value as Record<string, unknown>) : {}

const toArray = (value: unknown): unknown[] => (Array.isArray(value) ? value : [])

const toLessonType = (value: unknown): CourseLesson['type'] => {
  const resolved = toString(value)
  if (resolved === 'article' || resolved === 'quiz' || resolved === 'assignment') {
    return resolved
  }
  return 'video'
}

const resolveCreatorSummary = (course: unknown): CreatorSummary => {
  const row = toRecord(course)
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

  return Object.entries(links)
    .filter(([, url]) => typeof url === 'string' && url.trim().length > 0)
    .map(([platform, url]) => ({
      label: platform.charAt(0).toUpperCase() + platform.slice(1),
      url: String(url),
    }))
}

const resolveModules = (course: unknown): CourseModuleView[] => {
  const row = toRecord(course)
  const modules = toArray(row.modules)

  if (modules.length > 0) {
    return modules.map((moduleValue, moduleIndex) => {
      const moduleRow = toRecord(moduleValue)
      const lessons = toArray(moduleRow.lessons).map((lessonValue, lessonIndex) => {
        const lessonRow = toRecord(lessonValue)
        return {
          id: toString(lessonRow.id, `lesson-${moduleIndex + 1}-${lessonIndex + 1}`),
          title: toString(lessonRow.title, `Licao ${lessonIndex + 1}`),
          type: toLessonType(lessonRow.type),
          duration: toNumber(lessonRow.duration, 0),
          isFree: Boolean(lessonRow.isFree),
        }
      })

      return {
        id: toString(moduleRow.id, `module-${moduleIndex + 1}`),
        title: toString(moduleRow.title, `Modulo ${moduleIndex + 1}`),
        description: toString(moduleRow.description) || undefined,
        duration: toNumber(moduleRow.duration, 0),
        lessons,
      }
    })
  }

  const lessons = toArray(row.lessons)
  if (lessons.length === 0) {
    return []
  }

  return [
    {
      id: 'module-1',
      title: 'Licoes do curso',
      duration: lessons.reduce<number>(
        (total, lesson) => total + toNumber(toRecord(lesson).duration, 0),
        0,
      ),
      lessons: lessons.map((lessonValue, lessonIndex) => {
        const lessonRow = toRecord(lessonValue)
        return {
          id: toString(lessonRow.id, `lesson-${lessonIndex + 1}`),
          title: toString(lessonRow.title, `Licao ${lessonIndex + 1}`),
          type: toLessonType(lessonRow.type),
          duration: toNumber(lessonRow.duration, 0),
          isFree: Boolean(lessonRow.isFree),
        }
      }),
    },
  ]
}

const resolveLevelLabel = (course: unknown): string => {
  const level = toString(toRecord(course).level, 'beginner')
  if (level === 'advanced') return 'Avancado'
  if (level === 'intermediate') return 'Intermedio'
  return 'Iniciante'
}

const resolveTotalDuration = (course: unknown, modules: CourseModuleView[]): number => {
  const row = toRecord(course)
  const directDuration = toNumber(row.totalDuration, -1)
  if (directDuration >= 0) {
    return directDuration
  }

  return modules.reduce(
    (moduleTotal, module) =>
      moduleTotal +
      (module.duration > 0
        ? module.duration
        : module.lessons.reduce((lessonTotal, lesson) => lessonTotal + lesson.duration, 0)),
    0,
  )
}

const resolveTotalLessons = (course: unknown, modules: CourseModuleView[]): number => {
  const totalLessons = toNumber(toRecord(course).totalLessons, -1)
  if (totalLessons >= 0) {
    return totalLessons
  }

  return modules.reduce((sum, module) => sum + module.lessons.length, 0)
}

const resolveTotalModules = (course: unknown, modules: CourseModuleView[]): number => {
  const totalModules = toNumber(toRecord(course).totalModules, -1)
  if (totalModules >= 0) {
    return totalModules
  }

  return modules.length
}

const resolveEnrolledCount = (course: unknown): number => {
  const row = toRecord(course)
  return toNumber(row.enrolledCount, toNumber(row.subscriberCount, 0))
}

const resolveViewCount = (course: unknown): number => {
  const row = toRecord(course)
  return toNumber(row.viewCount, toNumber(row.views, 0))
}

const formatMinutes = (minutes: number): string => {
  if (minutes <= 0) {
    return 'N/A'
  }

  if (minutes >= 60) {
    return `${Math.floor(minutes / 60)}h ${minutes % 60}min`
  }

  return `${minutes} min`
}

const lessonTypeLabel: Record<CourseLesson['type'], string> = {
  video: 'Video',
  article: 'Artigo',
  quiz: 'Quiz',
  assignment: 'Exercicio',
}

export function CourseDetailPage({ slug }: CourseDetailPageProps) {
  const params = useParams<{ slug: string }>()
  const resolvedSlug = (slug || params.slug || '').trim()

  const { data: course, isLoading, error } = useCourse(resolvedSlug)
  const enrollMutation = useEnrollCourse()
  const { role } = usePermissions()
  const { PaywallComponent } = usePaywall()
  const currentUserId = useAuthStore((state) => state.user?.id)

  const hasAccess = course ? isRoleAtLeast(role, course.requiredRole) : false
  const commentsEnabled = course?.commentsEnabled ?? true

  const comments = useComments(ContentType.COURSE, course?.id ?? '', {
    enabled: hasAccess && commentsEnabled,
    currentUserId,
    contentQueryKey: ['course', resolvedSlug],
  })

  const creator = useMemo(() => resolveCreatorSummary(course), [course])
  const creatorLinks = useMemo(() => resolveSocialLinks(creator.socialLinks), [creator.socialLinks])
  const modules = useMemo(() => resolveModules(course), [course])

  const totalModules = useMemo(() => resolveTotalModules(course, modules), [course, modules])
  const totalLessons = useMemo(() => resolveTotalLessons(course, modules), [course, modules])
  const totalDuration = useMemo(() => resolveTotalDuration(course, modules), [course, modules])
  const levelLabel = useMemo(() => resolveLevelLabel(course), [course])
  const viewCount = useMemo(() => resolveViewCount(course), [course])
  const enrolledCount = useMemo(() => resolveEnrolledCount(course), [course])

  useEffect(() => {
    if (course?.id) {
      courseService.incrementView(course.id).catch(() => {})
    }
  }, [course?.id])

  const handleEnroll = () => {
    if (!course?.id || enrollMutation.isPending) {
      return
    }

    enrollMutation.mutate(course.id)
  }

  if (!resolvedSlug) {
    return <Navigate to="/hub/courses" replace />
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (error || !course) {
    return <Navigate to="/hub/courses" replace />
  }

  const tags = Array.isArray(course.tags) ? course.tags : []
  const seoDescription = course.description || course.excerpt || 'Curso FinHub'
  const canonicalUrl =
    typeof window !== 'undefined'
      ? window.location.href
      : `/hub/courses/${encodeURIComponent(resolvedSlug)}`

  const originalPrice = Number(course.price || 0)
  const discountPrice = Number(course.discountPrice || 0)
  const hasDiscount = discountPrice > 0 && discountPrice < originalPrice
  const finalPrice = hasDiscount ? discountPrice : originalPrice
  const isFree = finalPrice <= 0
  const isEnrolled = Boolean(course.isEnrolled)

  const enrollmentError = enrollMutation.error ? getErrorMessage(enrollMutation.error) : null

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

      {course.coverImage ? (
        <div className="relative h-72 overflow-hidden md:h-96">
          <img src={course.coverImage} alt={course.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        </div>
      ) : null}

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article className="space-y-6">
            <header className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  Curso
                </span>
                {course.isPremium ? (
                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
                    Premium
                  </span>
                ) : null}
                <span className="rounded-full bg-muted px-3 py-1 text-sm font-medium">
                  {levelLabel}
                </span>
              </div>

              <h1 className="text-4xl font-bold leading-tight md:text-5xl">{course.title}</h1>
              <p className="text-xl text-muted-foreground">{course.description}</p>

              <div className="flex flex-wrap items-center gap-4">
                <ContentMeta content={course} showAvatar size="md" />
                <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock3 className="h-4 w-4" />
                  {formatMinutes(totalDuration)}
                </span>
                <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                  <GraduationCap className="h-4 w-4" />
                  {totalLessons} licoes
                </span>
              </div>

              {tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </header>

            <hr className="border-border" />

            {hasAccess ? (
              <section className="space-y-4">
                <h2 className="text-2xl font-bold">Licoes do curso</h2>

                {modules.length === 0 ? (
                  <Card className="p-6 text-sm text-muted-foreground">
                    Este curso ainda nao tem licoes publicadas.
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {modules.map((module) => (
                      <Card key={module.id} className="overflow-hidden">
                        <div className="flex flex-wrap items-center justify-between gap-2 bg-muted/40 px-5 py-4">
                          <div>
                            <h3 className="font-semibold">{module.title}</h3>
                            {module.description ? (
                              <p className="mt-1 text-sm text-muted-foreground">
                                {module.description}
                              </p>
                            ) : null}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {module.lessons.length} licoes
                            {module.duration > 0 ? ` - ${formatMinutes(module.duration)}` : ''}
                          </p>
                        </div>

                        <div className="divide-y divide-border">
                          {module.lessons.map((lesson) => (
                            <div
                              key={lesson.id}
                              className="flex items-center justify-between gap-3 px-5 py-3"
                            >
                              <div className="flex min-w-0 items-center gap-3">
                                <BookOpen className="h-4 w-4 shrink-0 text-muted-foreground" />
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-medium">{lesson.title}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {lessonTypeLabel[lesson.type]}
                                  </p>
                                </div>
                                {lesson.isFree ? (
                                  <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                                    Gratis
                                  </span>
                                ) : null}
                              </div>

                              <span className="shrink-0 text-xs text-muted-foreground">
                                {lesson.duration > 0 ? `${lesson.duration} min` : '--'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </section>
            ) : (
              <div className="space-y-6">
                {course.excerpt ? (
                  <div className="prose prose-lg max-w-none dark:prose-invert">
                    <p>{course.excerpt}</p>
                  </div>
                ) : null}
                <PaywallComponent
                  title="Conteudo Premium"
                  description={`Este curso requer plano ${course.requiredRole.toUpperCase()}. Faz upgrade para aceder.`}
                />
              </div>
            )}

            <hr className="border-border" />

            {hasAccess ? (
              <RatingsSection
                targetType="course"
                targetId={course.id}
                formTitle="Avaliar este curso"
                contentQueryKey={['course', resolvedSlug]}
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
                  targetType={course.type}
                  targetId={course.id}
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
              <h3 className="mb-4 text-sm font-semibold">Acesso ao curso</h3>

              <div className="mb-4">
                {isFree ? (
                  <p className="text-2xl font-bold text-green-600">Gratuito</p>
                ) : (
                  <div className="flex items-end gap-2">
                    {hasDiscount ? (
                      <span className="text-sm text-muted-foreground line-through">
                        {originalPrice} EUR
                      </span>
                    ) : null}
                    <span className="text-2xl font-bold">{finalPrice} EUR</span>
                  </div>
                )}
              </div>

              {hasAccess ? (
                <>
                  {course.purchaseLink ? (
                    <a
                      href={course.purchaseLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button className="w-full" size="lg">
                        Aceder ao curso
                      </Button>
                    </a>
                  ) : isEnrolled ? (
                    <Button className="w-full" size="lg" variant="outline">
                      Continuar curso
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleEnroll}
                      disabled={enrollMutation.isPending}
                    >
                      {enrollMutation.isPending
                        ? 'A inscrever...'
                        : isFree
                          ? 'Inscrever-se gratuitamente'
                          : 'Inscrever no curso'}
                    </Button>
                  )}
                </>
              ) : (
                <Button className="w-full" size="lg" disabled>
                  Requer plano {course.requiredRole.toUpperCase()}
                </Button>
              )}

              {enrollmentError ? (
                <p className="mt-3 text-sm text-red-600">{enrollmentError}</p>
              ) : null}

              <div className="mt-5 space-y-2 border-t border-border pt-4 text-sm text-muted-foreground">
                <p className="tabular-nums">Modulos: {totalModules}</p>
                <p className="tabular-nums">Licoes: {totalLessons}</p>
                <p className="tabular-nums">Duracao: {formatMinutes(totalDuration)}</p>
                <p className="tabular-nums">Nivel: {levelLabel}</p>
                <p className="tabular-nums">Inscritos: {enrolledCount}</p>
                <p className="tabular-nums">Views: {viewCount}</p>
                <p className="tabular-nums">Rating medio: {course.averageRating.toFixed(1)}</p>
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  )
}
