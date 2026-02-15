import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card } from '@/components/ui'
import { DashboardLayout } from '@/shared/layouts'
import {
  useMyCourses,
  useDeleteCourse,
  usePublishCourse,
} from '@/features/hub/courses/hooks/useCourses'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

/**
 * Pagina de gestao de cursos do creator
 */
export function ManageCourses() {
  const [filters, setFilters] = useState({
    status: undefined as 'draft' | 'published' | 'archived' | undefined,
    sortBy: 'recent' as 'recent' | 'popular' | 'rating',
  })

  const { data, isLoading, refetch } = useMyCourses(filters)
  const deleteCourse = useDeleteCourse()
  const publishCourse = usePublishCourse()

  const handleDelete = async (id: string) => {
    if (!confirm('Tens a certeza que queres eliminar este curso?')) return

    try {
      await deleteCourse.mutateAsync(id)
    } catch {
      alert('Erro ao eliminar curso')
    }
  }

  const handlePublish = async (id: string) => {
    try {
      await publishCourse.mutateAsync(id)
    } catch {
      alert('Erro ao publicar curso')
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gerir Cursos</h1>
            <p className="mt-1 text-muted-foreground">Cria e gere os teus cursos educativos</p>
          </div>

          <Link to="/creators/dashboard/courses/criar">
            <Button variant="default" size="lg">
              + Criar Curso
            </Button>
          </Link>
        </div>

        <Card className="p-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Estado:</label>
              <select
                value={filters.status || ''}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    status: (e.target.value as 'draft' | 'published' | 'archived') || undefined,
                  })
                }
                className="rounded-lg border border-input bg-transparent px-3 py-1.5 text-sm"
              >
                <option value="">Todos</option>
                <option value="draft">Rascunhos</option>
                <option value="published">Publicados</option>
                <option value="archived">Arquivados</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Ordenar:</label>
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    sortBy: e.target.value as 'recent' | 'popular' | 'rating',
                  })
                }
                className="rounded-lg border border-input bg-transparent px-3 py-1.5 text-sm"
              >
                <option value="recent">Mais Recentes</option>
                <option value="popular">Mais Populares</option>
                <option value="rating">Melhor Avaliados</option>
              </select>
            </div>

            <Button variant="ghost" size="sm" onClick={() => refetch()}>
              Atualizar
            </Button>
          </div>
        </Card>

        {data && (
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="p-6">
              <div className="text-2xl font-bold">{data.total}</div>
              <div className="text-sm text-muted-foreground">Total de Cursos</div>
            </Card>
            <Card className="p-6">
              <div className="text-2xl font-bold">
                {data.items.filter((c) => c.status === 'published').length}
              </div>
              <div className="text-sm text-muted-foreground">Publicados</div>
            </Card>
            <Card className="p-6">
              <div className="text-2xl font-bold">
                {data.items.filter((c) => c.status === 'draft').length}
              </div>
              <div className="text-sm text-muted-foreground">Rascunhos</div>
            </Card>
            <Card className="p-6">
              <div className="text-2xl font-bold">
                {data.items.reduce((sum, c) => sum + (c.enrolledCount || 0), 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total de Inscritos</div>
            </Card>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : data?.items.length === 0 ? (
          <Card className="p-8 text-center">
            <svg
              className="mx-auto mb-4 h-16 w-16 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <h3 className="mb-2 text-lg font-semibold">Nenhum curso ainda</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Começa a partilhar conhecimento criando o teu primeiro curso
            </p>
            <Link to="/creators/dashboard/courses/criar">
              <Button variant="default">Criar Primeiro Curso</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {data?.items.map((course) => (
              <Card key={course.id} className="p-6 transition-shadow hover:shadow-md">
                <div className="flex items-start gap-4">
                  {course.coverImage && (
                    <img
                      src={course.coverImage}
                      alt={course.title}
                      className="h-24 w-24 rounded-lg object-cover"
                    />
                  )}

                  <div className="flex-1">
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{course.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                          {course.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            course.level === 'beginner'
                              ? 'bg-green-100 text-green-800'
                              : course.level === 'intermediate'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {course.level === 'beginner'
                            ? 'Iniciante'
                            : course.level === 'intermediate'
                              ? 'Intermedio'
                              : 'Avancado'}
                        </span>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            course.status === 'published'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {course.status === 'published' ? 'Publicado' : 'Rascunho'}
                        </span>
                      </div>
                    </div>

                    <div className="mb-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span>{course.price === 0 ? 'Gratuito' : `${course.price}€`}</span>
                      <span>{course.totalModules} modulos</span>
                      <span>{course.totalLessons} aulas</span>
                      <span>{course.enrolledCount} inscritos</span>
                      <span>
                        {course.averageRating.toFixed(1)} ({course.ratingCount})
                      </span>
                      <span>
                        {formatDistanceToNow(new Date(course.updatedAt), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Link to={`/hub/courses/${course.slug}`}>
                        <Button variant="ghost" size="sm">
                          Ver
                        </Button>
                      </Link>
                      <Link to={`/creators/dashboard/courses/editar/${course.id}`}>
                        <Button variant="ghost" size="sm">
                          Editar
                        </Button>
                      </Link>

                      {course.status === 'draft' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePublish(course.id)}
                          disabled={publishCourse.isPending}
                        >
                          Publicar
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(course.id)}
                        disabled={deleteCourse.isPending}
                        className="text-red-600 hover:text-red-700"
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
