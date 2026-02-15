import { useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { useCourse, useEnrollCourse } from '../hooks/useCourses'
import { courseService } from '../services/courseService'
import {
  ContentMeta,
  ContentActions,
  RatingDistribution,
  RatingForm,
  CommentSection,
} from '@/features/hub/components'
import { usePermissions, usePaywall } from '@/features/auth'
import { Permission, isRoleAtLeast } from '@/lib/permissions/config'
import { Card, Button } from '@/components/ui'
import type { CourseModule } from '../types'

/**
 * Pagina de detalhe do curso (publica)
 */
export function CourseDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: course, isLoading, error } = useCourse(slug!)
  const { role, can } = usePermissions()
  const { PaywallComponent } = usePaywall()
  const enrollMutation = useEnrollCourse()

  useEffect(() => {
    if (course?.id) {
      courseService.incrementView(course.id).catch(() => {})
    }
  }, [course?.id])

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

  const hasAccess = isRoleAtLeast(role, course.requiredRole)

  const handleEnroll = async () => {
    try {
      await enrollMutation.mutateAsync(course.id)
    } catch {
      // Handle error
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {course.coverImage && (
        <div className="relative h-96 overflow-hidden">
          <img src={course.coverImage} alt={course.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="container mx-auto">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-primary/90 px-3 py-1 text-sm font-medium text-primary-foreground">
                  Curso
                </span>
                {course.isPremium && (
                  <span className="rounded-full bg-yellow-500 px-3 py-1 text-sm font-medium text-white">
                    Premium
                  </span>
                )}
                <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-medium text-white">
                  {course.level === 'beginner'
                    ? 'Iniciante'
                    : course.level === 'intermediate'
                      ? 'Intermedio'
                      : 'Avancado'}
                </span>
              </div>
              <h1 className="mt-3 text-4xl font-bold text-white md:text-5xl">{course.title}</h1>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
          {/* Main Content */}
          <div className="space-y-8">
            {!course.coverImage && (
              <header className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                    Curso
                  </span>
                  {course.isPremium && (
                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
                      Premium
                    </span>
                  )}
                </div>
                <h1 className="text-4xl font-bold leading-tight md:text-5xl">{course.title}</h1>
              </header>
            )}

            <p className="text-lg text-muted-foreground">{course.description}</p>

            <div className="flex flex-wrap items-center gap-4">
              <ContentMeta content={course} showAvatar size="md" />
            </div>

            {course.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {course.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <ContentActions
              contentId={course.id}
              likeCount={course.likeCount}
              favoriteCount={course.favoriteCount}
              showLabels
            />

            <hr className="border-border" />

            {/* Learning Outcomes */}
            {course.learningOutcomes && course.learningOutcomes.length > 0 && (
              <Card className="p-6">
                <h2 className="mb-4 text-xl font-bold">O que vais aprender</h2>
                <ul className="grid gap-2 md:grid-cols-2">
                  {course.learningOutcomes.map((outcome, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="mt-0.5 text-green-500">✓</span>
                      {outcome}
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Prerequisites */}
            {course.prerequisites && course.prerequisites.length > 0 && (
              <Card className="p-6">
                <h2 className="mb-4 text-xl font-bold">Pre-requisitos</h2>
                <ul className="space-y-2">
                  {course.prerequisites.map((prereq, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="mt-0.5 text-muted-foreground">•</span>
                      {prereq}
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Course Modules */}
            {hasAccess ? (
              <section className="space-y-4">
                <h2 className="text-2xl font-bold">
                  Conteudo do Curso ({course.totalModules} modulos, {course.totalLessons} aulas)
                </h2>
                {course.modules.map((module: CourseModule) => (
                  <Card key={module.id} className="overflow-hidden">
                    <div className="flex items-center justify-between bg-muted/50 px-6 py-4">
                      <div>
                        <h3 className="font-semibold">{module.title}</h3>
                        {module.description && (
                          <p className="mt-1 text-sm text-muted-foreground">{module.description}</p>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {module.lessons.length} aulas · {module.duration} min
                      </div>
                    </div>
                    <div className="divide-y divide-border">
                      {module.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="flex items-center justify-between px-6 py-3"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-muted-foreground">
                              {lesson.type === 'video'
                                ? '▶'
                                : lesson.type === 'article'
                                  ? '📄'
                                  : lesson.type === 'quiz'
                                    ? '❓'
                                    : '📝'}
                            </span>
                            <span className="text-sm">{lesson.title}</span>
                            {lesson.isFree && (
                              <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                                Gratis
                              </span>
                            )}
                          </div>
                          {lesson.duration && (
                            <span className="text-xs text-muted-foreground">
                              {lesson.duration} min
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </section>
            ) : (
              <div className="space-y-6">
                {course.excerpt && (
                  <div className="prose prose-lg max-w-none dark:prose-invert">
                    <p>{course.excerpt}</p>
                  </div>
                )}
                <PaywallComponent
                  title="Conteudo Premium"
                  description={`Este curso requer plano ${course.requiredRole.toUpperCase()}. Faz upgrade para aceder.`}
                />
              </div>
            )}

            <hr className="border-border" />

            {/* Ratings */}
            {hasAccess && (
              <section className="space-y-6">
                <h2 className="text-2xl font-bold">Avaliacoes</h2>

                {course.ratingCount > 0 && (
                  <RatingDistribution
                    stats={{
                      averageRating: course.averageRating,
                      totalRatings: course.ratingCount,
                      distribution: {
                        5: Math.floor(course.ratingCount * 0.5),
                        4: Math.floor(course.ratingCount * 0.3),
                        3: Math.floor(course.ratingCount * 0.15),
                        2: Math.floor(course.ratingCount * 0.04),
                        1: Math.floor(course.ratingCount * 0.01),
                      },
                      percentages: {
                        5: 50,
                        4: 30,
                        3: 15,
                        2: 4,
                        1: 1,
                      },
                    }}
                  />
                )}

                {can(Permission.RATE_CONTENT) ? (
                  <Card className="p-6">
                    <h3 className="mb-4 font-semibold">Avaliar este curso</h3>
                    <RatingForm
                      targetType={course.type}
                      targetId={course.id}
                      onSubmit={async (data) => {
                        console.log('Submit rating:', data)
                      }}
                    />
                  </Card>
                ) : (
                  <Card className="p-6 text-center text-sm text-muted-foreground">
                    Faz login para avaliar este curso
                  </Card>
                )}
              </section>
            )}

            <hr className="border-border" />

            {/* Comments */}
            {hasAccess && course.commentsEnabled && (
              <section>
                <CommentSection
                  targetType={course.type}
                  targetId={course.id}
                  response={{
                    items: [],
                    total: course.commentCount,
                    limit: 10,
                    offset: 0,
                    hasMore: false,
                  }}
                  enabled={course.commentsEnabled}
                  onSubmitComment={async (content) => {
                    console.log('Submit comment:', content)
                  }}
                  onReplyComment={async (commentId, content) => {
                    console.log('Reply to comment:', commentId, content)
                  }}
                  onEditComment={async (commentId, content) => {
                    console.log('Edit comment:', commentId, content)
                  }}
                  onDeleteComment={async (commentId) => {
                    console.log('Delete comment:', commentId)
                  }}
                  onLikeComment={async (commentId) => {
                    console.log('Like comment:', commentId)
                  }}
                />
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <Card className="sticky top-6 p-6">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold">
                    {course.price === 0 ? (
                      <span className="text-green-600">Gratuito</span>
                    ) : (
                      <>
                        {course.discountPrice ? (
                          <div className="space-y-1">
                            <span className="text-lg text-muted-foreground line-through">
                              {course.price}€
                            </span>
                            <span className="ml-2">{course.discountPrice}€</span>
                          </div>
                        ) : (
                          <span>{course.price}€</span>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {!course.isEnrolled ? (
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleEnroll}
                    disabled={enrollMutation.isPending}
                  >
                    {enrollMutation.isPending
                      ? 'A inscrever...'
                      : course.price === 0
                        ? 'Inscrever-se Gratuitamente'
                        : 'Comprar Curso'}
                  </Button>
                ) : (
                  <Button className="w-full" size="lg" variant="outline">
                    Continuar Curso
                  </Button>
                )}

                <div className="space-y-3 pt-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Modulos</span>
                    <span className="font-medium">{course.totalModules}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Aulas</span>
                    <span className="font-medium">{course.totalLessons}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duracao</span>
                    <span className="font-medium">
                      {course.totalDuration >= 60
                        ? `${Math.floor(course.totalDuration / 60)}h ${course.totalDuration % 60}min`
                        : `${course.totalDuration} min`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nivel</span>
                    <span className="font-medium">
                      {course.level === 'beginner'
                        ? 'Iniciante'
                        : course.level === 'intermediate'
                          ? 'Intermedio'
                          : 'Avancado'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Idioma</span>
                    <span className="font-medium">{course.language}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Inscritos</span>
                    <span className="font-medium">{course.enrolledCount}</span>
                  </div>
                  {course.averageRating > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avaliacao</span>
                      <span className="font-medium">
                        {course.averageRating.toFixed(1)} ({course.ratingCount})
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  )
}
