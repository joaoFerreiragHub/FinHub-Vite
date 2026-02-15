import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card } from '@/components/ui'
import { DashboardLayout } from '@/shared/layouts'
import { useMyVideos, useDeleteVideo, usePublishVideo } from '@/features/hub/videos/hooks/useVideos'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

/**
 * Pagina de gestao de videos do creator
 */
export function ManageVideos() {
  const [filters, setFilters] = useState({
    status: undefined as 'draft' | 'published' | 'archived' | undefined,
    sortBy: 'recent' as 'recent' | 'popular' | 'rating',
  })

  const { data, isLoading, refetch } = useMyVideos(filters)
  const deleteVideo = useDeleteVideo()
  const publishVideo = usePublishVideo()

  const handleDelete = async (id: string) => {
    if (!confirm('Tens a certeza que queres eliminar este video?')) return
    try {
      await deleteVideo.mutateAsync(id)
    } catch {
      alert('Erro ao eliminar video')
    }
  }

  const handlePublish = async (id: string) => {
    try {
      await publishVideo.mutateAsync(id)
    } catch {
      alert('Erro ao publicar video')
    }
  }

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${String(s).padStart(2, '0')}`
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gerir Videos</h1>
            <p className="mt-1 text-muted-foreground">Cria e gere os teus videos educativos</p>
          </div>

          <Link to="/creators/dashboard/videos/criar">
            <Button variant="default" size="lg">
              + Criar Video
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
              <div className="text-sm text-muted-foreground">Total de Videos</div>
            </Card>
            <Card className="p-6">
              <div className="text-2xl font-bold">
                {data.items.filter((v) => v.status === 'published').length}
              </div>
              <div className="text-sm text-muted-foreground">Publicados</div>
            </Card>
            <Card className="p-6">
              <div className="text-2xl font-bold">
                {data.items.filter((v) => v.status === 'draft').length}
              </div>
              <div className="text-sm text-muted-foreground">Rascunhos</div>
            </Card>
            <Card className="p-6">
              <div className="text-2xl font-bold">
                {data.items.reduce((sum, v) => sum + v.viewCount, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total de Visualizacoes</div>
            </Card>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : data?.items.length === 0 ? (
          <Card className="p-8 text-center">
            <h3 className="mb-2 text-lg font-semibold">Nenhum video ainda</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Começa a partilhar conhecimento criando o teu primeiro video
            </p>
            <Link to="/creators/dashboard/videos/criar">
              <Button variant="default">Criar Primeiro Video</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {data?.items.map((video) => (
              <Card key={video.id} className="p-6 transition-shadow hover:shadow-md">
                <div className="flex items-start gap-4">
                  {(video.thumbnail || video.coverImage) && (
                    <img
                      src={video.thumbnail || video.coverImage}
                      alt={video.title}
                      className="h-24 w-36 rounded-lg object-cover"
                    />
                  )}

                  <div className="flex-1">
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{video.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                          {video.description}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          video.status === 'published'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {video.status === 'published' ? 'Publicado' : 'Rascunho'}
                      </span>
                    </div>

                    <div className="mb-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span>{formatDuration(video.duration)}</span>
                      <span>{video.quality}</span>
                      <span>{video.viewCount} visualizacoes</span>
                      <span>{video.likeCount} likes</span>
                      <span>
                        {formatDistanceToNow(new Date(video.updatedAt), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Link to={`/hub/videos/${video.slug}`}>
                        <Button variant="ghost" size="sm">
                          Ver
                        </Button>
                      </Link>
                      <Link to={`/creators/dashboard/videos/editar/${video.id}`}>
                        <Button variant="ghost" size="sm">
                          Editar
                        </Button>
                      </Link>
                      {video.status === 'draft' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePublish(video.id)}
                          disabled={publishVideo.isPending}
                        >
                          Publicar
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(video.id)}
                        disabled={deleteVideo.isPending}
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
