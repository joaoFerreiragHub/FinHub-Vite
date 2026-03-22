import { useState } from 'react'
import { Rocket, Trash2, Undo2 } from 'lucide-react'

import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui'
import {
  useDeleteVideo,
  useMyVideos,
  usePublishVideo,
  useUnpublishVideo,
} from '@/features/hub/videos/hooks/useVideos'
import type { Video } from '@/features/hub/videos/types'
import { getErrorMessage } from '@/lib/api/client'
import { CreatorDashboardShell } from '@/shared/layouts'
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
  const [actionError, setActionError] = useState<string | null>(null)
  const [videoToDelete, setVideoToDelete] = useState<Video | null>(null)

  const { data, isLoading, refetch } = useMyVideos(filters)
  const deleteVideo = useDeleteVideo()
  const publishVideo = usePublishVideo()
  const unpublishVideo = useUnpublishVideo()

  const isMutating = deleteVideo.isPending || publishVideo.isPending || unpublishVideo.isPending

  const handleDelete = async () => {
    if (!videoToDelete) return
    setActionError(null)

    try {
      await deleteVideo.mutateAsync(videoToDelete.id)
      setVideoToDelete(null)
    } catch (error) {
      setActionError(getErrorMessage(error))
    }
  }

  const handleTogglePublish = async (video: Video) => {
    setActionError(null)

    try {
      if (video.status === 'published') {
        await unpublishVideo.mutateAsync(video.id)
      } else {
        await publishVideo.mutateAsync(video.id)
      }
    } catch (error) {
      setActionError(getErrorMessage(error))
    }
  }

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${String(s).padStart(2, '0')}`
  }

  return (
    <CreatorDashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gerir Videos</h1>
            <p className="mt-1 text-muted-foreground">Cria e gere os teus videos educativos</p>
          </div>

          <a href="/creators/dashboard/videos/create">
            <Button variant="default" size="lg">
              + Novo Video
            </Button>
          </a>
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

            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading || isMutating}
            >
              Atualizar
            </Button>
          </div>
        </Card>

        {actionError ? (
          <Card className="border-red-500/40 bg-red-500/10">
            <CardContent className="py-3 text-sm text-red-400">{actionError}</CardContent>
          </Card>
        ) : null}

        {data && (
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="p-6">
              <div className="text-2xl font-bold">{data.total}</div>
              <div className="text-sm text-muted-foreground">Total de Videos</div>
            </Card>
            <Card className="p-6">
              <div className="text-2xl font-bold">
                {data.items.filter((video) => video.status === 'published').length}
              </div>
              <div className="text-sm text-muted-foreground">Publicados</div>
            </Card>
            <Card className="p-6">
              <div className="text-2xl font-bold">
                {data.items.filter((video) => video.status === 'draft').length}
              </div>
              <div className="text-sm text-muted-foreground">Rascunhos</div>
            </Card>
            <Card className="p-6">
              <div className="text-2xl font-bold">
                {data.items.reduce((sum, video) => sum + video.viewCount, 0)}
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
              Comeca a partilhar conhecimento criando o teu primeiro video
            </p>
            <a href="/creators/dashboard/videos/create">
              <Button variant="default">Criar Primeiro Video</Button>
            </a>
          </Card>
        ) : (
          <div className="space-y-4">
            {data?.items.map((video) => {
              const isPublished = video.status === 'published'

              return (
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
                            isPublished
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {isPublished ? 'Publicado' : 'Rascunho'}
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
                        <a href={`/hub/videos/${video.slug}`}>
                          <Button variant="ghost" size="sm">
                            Ver
                          </Button>
                        </a>
                        <a href={`/creators/dashboard/videos/${encodeURIComponent(video.id)}/edit`}>
                          <Button variant="ghost" size="sm">
                            Editar
                          </Button>
                        </a>
                        {(video.status === 'draft' || video.status === 'published') && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              void handleTogglePublish(video)
                            }}
                            disabled={isMutating}
                          >
                            {isPublished ? (
                              <Undo2 className="h-4 w-4" />
                            ) : (
                              <Rocket className="h-4 w-4" />
                            )}
                            {isPublished ? 'Despublicar' : 'Publicar'}
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setVideoToDelete(video)}
                          disabled={isMutating}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}

        <Dialog
          open={Boolean(videoToDelete)}
          onOpenChange={(open) => !open && setVideoToDelete(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Eliminar video</DialogTitle>
              <DialogDescription>
                Esta acao e irreversivel. O video{' '}
                <span className="font-semibold">{videoToDelete?.title ?? ''}</span> sera removido
                permanentemente.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setVideoToDelete(null)}
                disabled={deleteVideo.isPending}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  void handleDelete()
                }}
                isLoading={deleteVideo.isPending}
              >
                Eliminar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </CreatorDashboardShell>
  )
}
