import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card } from '@/components/ui'
import { DashboardLayout } from '@/shared/layouts'
import {
  useMyArticles,
  useDeleteArticle,
  usePublishArticle,
} from '@/features/hub/articles/hooks/useArticles'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

/**
 * Página de gestão de artigos do creator
 * Lista todos os artigos com opções de editar/eliminar/publicar
 */
export function ManageArticles() {
  const [filters, setFilters] = useState({
    status: undefined as 'draft' | 'published' | 'archived' | undefined,
    sortBy: 'recent' as 'recent' | 'popular' | 'rating',
  })

  const { data, isLoading, refetch } = useMyArticles(filters)
  const deleteArticle = useDeleteArticle()
  const publishArticle = usePublishArticle()

  const handleDelete = async (id: string) => {
    if (!confirm('Tens a certeza que queres eliminar este artigo?')) return

    try {
      await deleteArticle.mutateAsync(id)
    } catch {
      alert('Erro ao eliminar artigo')
    }
  }

  const handlePublish = async (id: string) => {
    try {
      await publishArticle.mutateAsync(id)
    } catch {
      alert('Erro ao publicar artigo')
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gerir Artigos</h1>
            <p className="mt-1 text-muted-foreground">Cria e gere os teus artigos educativos</p>
          </div>

          <Link to="/creators/dashboard/artigos/criar">
            <Button variant="default" size="lg">
              ✍️ Criar Artigo
            </Button>
          </Link>
        </div>

        {/* Filters */}
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
              🔄 Atualizar
            </Button>
          </div>
        </Card>

        {/* Stats */}
        {data && (
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="p-6">
              <div className="text-2xl font-bold">{data.total}</div>
              <div className="text-sm text-muted-foreground">Total de Artigos</div>
            </Card>
            <Card className="p-6">
              <div className="text-2xl font-bold">
                {data.items.filter((a) => a.status === 'published').length}
              </div>
              <div className="text-sm text-muted-foreground">Publicados</div>
            </Card>
            <Card className="p-6">
              <div className="text-2xl font-bold">
                {data.items.filter((a) => a.status === 'draft').length}
              </div>
              <div className="text-sm text-muted-foreground">Rascunhos</div>
            </Card>
            <Card className="p-6">
              <div className="text-2xl font-bold">
                {data.items.reduce((sum, a) => sum + a.viewCount, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total de Visualizações</div>
            </Card>
          </div>
        )}

        {/* Articles List */}
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mb-2 text-lg font-semibold">Nenhum artigo ainda</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Começa a partilhar conhecimento criando o teu primeiro artigo
            </p>
            <Link to="/creators/dashboard/artigos/criar">
              <Button variant="default">Criar Primeiro Artigo</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {data?.items.map((article) => (
              <Card key={article.id} className="p-6 transition-shadow hover:shadow-md">
                <div className="flex items-start gap-4">
                  {/* Cover Image */}
                  {article.coverImage && (
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="h-24 w-24 rounded-lg object-cover"
                    />
                  )}

                  {/* Content */}
                  <div className="flex-1">
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{article.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                          {article.description}
                        </p>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          article.status === 'published'
                            ? 'bg-green-100 text-green-800'
                            : article.status === 'draft'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {article.status === 'published'
                          ? 'Publicado'
                          : article.status === 'draft'
                            ? 'Rascunho'
                            : 'Arquivado'}
                      </span>
                    </div>

                    {/* Meta */}
                    <div className="mb-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span>👁️ {article.viewCount} visualizações</span>
                      <span>❤️ {article.likeCount} likes</span>
                      <span>
                        ⭐ {article.averageRating.toFixed(1)} ({article.ratingCount})
                      </span>
                      <span>💬 {article.commentCount} comentários</span>
                      <span>
                        {formatDistanceToNow(new Date(article.updatedAt), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link to={`/hub/articles/${article.slug}`}>
                        <Button variant="ghost" size="sm">
                          👁️ Ver
                        </Button>
                      </Link>
                      <Link to={`/creators/dashboard/artigos/editar/${article.id}`}>
                        <Button variant="ghost" size="sm">
                          ✏️ Editar
                        </Button>
                      </Link>

                      {article.status === 'draft' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePublish(article.id)}
                          disabled={publishArticle.isPending}
                        >
                          🚀 Publicar
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(article.id)}
                        disabled={deleteArticle.isPending}
                        className="text-red-600 hover:text-red-700"
                      >
                        🗑️ Eliminar
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
