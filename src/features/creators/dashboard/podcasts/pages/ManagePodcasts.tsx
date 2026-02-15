import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card } from '@/components/ui'
import { DashboardLayout } from '@/shared/layouts'
import {
  useMyPodcasts,
  useDeletePodcast,
  usePublishPodcast,
} from '@/features/hub/podcasts/hooks/usePodcasts'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

/**
 * Pagina de gestao de podcasts do creator
 */
export function ManagePodcasts() {
  const [filters, setFilters] = useState({
    status: undefined as 'draft' | 'published' | 'archived' | undefined,
    sortBy: 'recent' as 'recent' | 'popular' | 'rating',
  })

  const { data, isLoading, refetch } = useMyPodcasts(filters)
  const deletePodcast = useDeletePodcast()
  const publishPodcast = usePublishPodcast()

  const handleDelete = async (id: string) => {
    if (!confirm('Tens a certeza que queres eliminar este podcast?')) return
    try {
      await deletePodcast.mutateAsync(id)
    } catch {
      alert('Erro ao eliminar podcast')
    }
  }

  const handlePublish = async (id: string) => {
    try {
      await publishPodcast.mutateAsync(id)
    } catch {
      alert('Erro ao publicar podcast')
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gerir Podcasts</h1>
            <p className="mt-1 text-muted-foreground">Cria e gere os teus podcasts e episodios</p>
          </div>

          <Link to="/creators/dashboard/podcasts/create">
            <Button variant="default" size="lg">
              + Criar Podcast
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
              <div className="text-sm text-muted-foreground">Total de Podcasts</div>
            </Card>
            <Card className="p-6">
              <div className="text-2xl font-bold">
                {data.items.filter((p) => p.status === 'published').length}
              </div>
              <div className="text-sm text-muted-foreground">Publicados</div>
            </Card>
            <Card className="p-6">
              <div className="text-2xl font-bold">
                {data.items.reduce((sum, p) => sum + p.totalEpisodes, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total de Episodios</div>
            </Card>
            <Card className="p-6">
              <div className="text-2xl font-bold">
                {data.items.reduce((sum, p) => sum + p.subscriberCount, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total de Subscritores</div>
            </Card>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : data?.items.length === 0 ? (
          <Card className="p-8 text-center">
            <h3 className="mb-2 text-lg font-semibold">Nenhum podcast ainda</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Começa a partilhar conhecimento em formato audio
            </p>
            <Link to="/creators/dashboard/podcasts/create">
              <Button variant="default">Criar Primeiro Podcast</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {data?.items.map((podcast) => (
              <Card key={podcast.id} className="p-6 transition-shadow hover:shadow-md">
                <div className="flex items-start gap-4">
                  {podcast.coverImage && (
                    <img
                      src={podcast.coverImage}
                      alt={podcast.title}
                      className="h-24 w-24 rounded-lg object-cover"
                    />
                  )}

                  <div className="flex-1">
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{podcast.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                          {podcast.description}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          podcast.status === 'published'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {podcast.status === 'published' ? 'Publicado' : 'Rascunho'}
                      </span>
                    </div>

                    <div className="mb-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span>{podcast.totalEpisodes} episodios</span>
                      <span>{podcast.subscriberCount} subscritores</span>
                      <span>
                        {podcast.averageRating.toFixed(1)} ({podcast.ratingCount})
                      </span>
                      <span>
                        {formatDistanceToNow(new Date(podcast.updatedAt), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Link to={`/hub/podcasts/${podcast.slug}`}>
                        <Button variant="ghost" size="sm">
                          Ver
                        </Button>
                      </Link>
                      <Link to={`/creators/dashboard/podcasts/${podcast.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          Editar
                        </Button>
                      </Link>
                      {podcast.status === 'draft' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePublish(podcast.id)}
                          disabled={publishPodcast.isPending}
                        >
                          Publicar
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(podcast.id)}
                        disabled={deletePodcast.isPending}
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
