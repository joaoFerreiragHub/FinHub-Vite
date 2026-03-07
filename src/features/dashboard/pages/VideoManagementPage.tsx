import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Eye,
  Heart,
  MessageCircle,
  PenSquare,
  RefreshCcw,
  Rocket,
  Star,
  Trash2,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Button, Card } from '@/components/ui'
import type { ContentFilters } from '@/features/hub/types'
import {
  useDeleteVideo,
  useMyVideos,
  usePublishVideo,
} from '@/features/hub/videos/hooks/useVideos'

type VideoStatusFilter = NonNullable<ContentFilters['status']>
type VideoSortFilter = NonNullable<ContentFilters['sortBy']>

const INITIAL_FILTERS: { status: VideoStatusFilter | undefined; sortBy: VideoSortFilter } = {
  status: undefined,
  sortBy: 'recent',
}

function getStatusLabel(status: string) {
  if (status === 'published') return 'Publicado'
  if (status === 'draft') return 'Rascunho'
  if (status === 'scheduled') return 'Agendado'
  if (status === 'archived') return 'Arquivado'
  return status
}

function getStatusClassName(status: string) {
  if (status === 'published') return 'bg-green-100 text-green-800'
  if (status === 'draft') return 'bg-amber-100 text-amber-800'
  if (status === 'scheduled') return 'bg-blue-100 text-blue-800'
  if (status === 'archived') return 'bg-slate-100 text-slate-800'
  return 'bg-slate-100 text-slate-800'
}

function formatDuration(seconds: number) {
  const parsed = Number.isFinite(seconds) ? Math.max(0, Math.round(seconds)) : 0
  const minutes = Math.floor(parsed / 60)
  const remainingSeconds = parsed % 60
  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`
}

export default function VideoManagementPage() {
  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const { data, isLoading, refetch } = useMyVideos(filters)
  const deleteVideo = useDeleteVideo()
  const publishVideo = usePublishVideo()

  const handleDelete = async (id: string) => {
    if (!window.confirm('Queres mesmo eliminar este video?')) {
      return
    }

    try {
      await deleteVideo.mutateAsync(id)
    } catch {
      window.alert('Erro ao eliminar video.')
    }
  }

  const handlePublish = async (id: string) => {
    try {
      await publishVideo.mutateAsync(id)
    } catch {
      window.alert('Erro ao publicar video.')
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Gestao de videos</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Cria, edita e publica videos do teu dashboard.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link to="/dashboard/conteudo/artigos">Gerir artigos</Link>
          </Button>
          <Button asChild>
            <Link to="/dashboard/criar/video">
              <PenSquare className="mr-2 h-4 w-4" />
              Criar video
            </Link>
          </Button>
        </div>
      </header>

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm font-medium" htmlFor="video-status-filter">
            Estado
          </label>
          <select
            id="video-status-filter"
            value={filters.status ?? ''}
            onChange={(event) => {
              const nextStatus = event.target.value
              setFilters((current) => ({
                ...current,
                status: nextStatus ? (nextStatus as VideoStatusFilter) : undefined,
              }))
            }}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">Todos</option>
            <option value="draft">Rascunhos</option>
            <option value="published">Publicados</option>
            <option value="scheduled">Agendados</option>
            <option value="archived">Arquivados</option>
          </select>

          <label className="ml-0 text-sm font-medium sm:ml-2" htmlFor="video-sort-filter">
            Ordenar
          </label>
          <select
            id="video-sort-filter"
            value={filters.sortBy}
            onChange={(event) => {
              setFilters((current) => ({
                ...current,
                sortBy: event.target.value as VideoSortFilter,
              }))
            }}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="recent">Mais recentes</option>
            <option value="popular">Mais populares</option>
            <option value="rating">Melhor rating</option>
            <option value="views">Mais vistos</option>
          </select>

          <Button variant="ghost" size="sm" onClick={() => refetch()}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Atualizar
          </Button>
        </div>
      </Card>

      {data ? (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card className="p-4">
            <p className="text-2xl font-semibold">{data.total}</p>
            <p className="text-sm text-muted-foreground">Total de videos</p>
          </Card>
          <Card className="p-4">
            <p className="text-2xl font-semibold">
              {data.items.filter((video) => video.status === 'published').length}
            </p>
            <p className="text-sm text-muted-foreground">Publicados</p>
          </Card>
          <Card className="p-4">
            <p className="text-2xl font-semibold">
              {data.items.filter((video) => video.status === 'draft').length}
            </p>
            <p className="text-sm text-muted-foreground">Rascunhos</p>
          </Card>
          <Card className="p-4">
            <p className="text-2xl font-semibold">
              {data.items.reduce((totalViews, video) => totalViews + video.viewCount, 0)}
            </p>
            <p className="text-sm text-muted-foreground">Visualizacoes</p>
          </Card>
        </section>
      ) : null}

      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : data?.items.length === 0 ? (
        <Card className="p-8 text-center">
          <h2 className="text-lg font-semibold">Ainda nao tens videos</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Cria o primeiro video para comecar a tua linha editorial multimidia.
          </p>
          <Button className="mt-4" asChild>
            <Link to="/dashboard/criar/video">Criar primeiro video</Link>
          </Button>
        </Card>
      ) : (
        <section className="space-y-4">
          {data?.items.map((video) => (
            <Card key={video.id} className="p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                {video.thumbnail || video.coverImage ? (
                  <img
                    src={video.thumbnail || video.coverImage}
                    alt={video.title}
                    className="h-20 w-full rounded-md object-cover sm:w-36"
                  />
                ) : null}

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h2 className="truncate text-lg font-semibold">{video.title}</h2>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {video.description}
                      </p>
                    </div>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusClassName(video.status)}`}
                    >
                      {getStatusLabel(video.status)}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span>{formatDuration(video.duration)}</span>
                    <span>{video.quality}</span>
                    <span className="inline-flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      {video.viewCount}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Heart className="h-3.5 w-3.5" />
                      {video.likeCount}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-3.5 w-3.5" />
                      {video.averageRating.toFixed(1)} ({video.ratingCount})
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MessageCircle className="h-3.5 w-3.5" />
                      {video.commentCount}
                    </span>
                    <span>
                      Atualizado{' '}
                      {formatDistanceToNow(new Date(video.updatedAt), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/videos/${video.slug}`}>
                        <Eye className="mr-1 h-4 w-4" />
                        Ver
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/dashboard/conteudo/videos/${video.id}/editar`}>
                        <PenSquare className="mr-1 h-4 w-4" />
                        Editar
                      </Link>
                    </Button>

                    {video.status === 'draft' ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePublish(video.id)}
                        disabled={publishVideo.isPending}
                      >
                        <Rocket className="mr-1 h-4 w-4" />
                        Publicar
                      </Button>
                    ) : null}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(video.id)}
                      disabled={deleteVideo.isPending}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="mr-1 h-4 w-4" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </section>
      )}
    </div>
  )
}
