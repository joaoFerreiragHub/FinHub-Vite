import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card } from '@/components/ui'
import { DashboardLayout } from '@/shared/layouts'
import { useMyLives, useDeleteLive, usePublishLive } from '@/features/hub/lives/hooks/useLives'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

/**
 * Pagina de gestao de eventos do creator
 */
export function ManageLives() {
  const [filters, setFilters] = useState({
    status: undefined as 'draft' | 'published' | 'archived' | undefined,
    sortBy: 'recent' as 'recent' | 'popular' | 'rating',
  })

  const { data, isLoading, refetch } = useMyLives(filters)
  const deleteLive = useDeleteLive()
  const publishLive = usePublishLive()

  const handleDelete = async (id: string) => {
    if (!confirm('Tens a certeza que queres eliminar este evento?')) return
    try {
      await deleteLive.mutateAsync(id)
    } catch {
      alert('Erro ao eliminar evento')
    }
  }

  const handlePublish = async (id: string) => {
    try {
      await publishLive.mutateAsync(id)
    } catch {
      alert('Erro ao publicar evento')
    }
  }

  const now = new Date()
  const upcoming = data?.items.filter((e) => new Date(e.startDate) > now) || []
  const past = data?.items.filter((e) => new Date(e.startDate) <= now) || []

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gerir Eventos</h1>
            <p className="mt-1 text-muted-foreground">Cria e gere os teus eventos ao vivo</p>
          </div>

          <Link to="/creators/dashboard/lives/create">
            <Button variant="default" size="lg">
              + Criar Evento
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
              <div className="text-sm text-muted-foreground">Total de Eventos</div>
            </Card>
            <Card className="p-6">
              <div className="text-2xl font-bold">{upcoming.length}</div>
              <div className="text-sm text-muted-foreground">Proximos</div>
            </Card>
            <Card className="p-6">
              <div className="text-2xl font-bold">{past.length}</div>
              <div className="text-sm text-muted-foreground">Passados</div>
            </Card>
            <Card className="p-6">
              <div className="text-2xl font-bold">
                {data.items.reduce((sum, e) => sum + (e.attendeeCount || 0), 0)}
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
            <h3 className="mb-2 text-lg font-semibold">Nenhum evento ainda</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Começa a interagir com a tua audiencia criando o teu primeiro evento
            </p>
            <Link to="/creators/dashboard/lives/create">
              <Button variant="default">Criar Primeiro Evento</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {data?.items.map((live) => {
              const eventDate = new Date(live.startDate)
              const isUpcoming = eventDate > now
              const eventTypeLabel =
                live.eventType === 'online'
                  ? 'Online'
                  : live.eventType === 'presencial'
                    ? 'Presencial'
                    : 'Hibrido'

              return (
                <Card key={live.id} className="p-6 transition-shadow hover:shadow-md">
                  <div className="flex items-start gap-4">
                    {live.coverImage && (
                      <img
                        src={live.coverImage}
                        alt={live.title}
                        className="h-24 w-24 rounded-lg object-cover"
                      />
                    )}

                    <div className="flex-1">
                      <div className="mb-2 flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">{live.title}</h3>
                          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                            {live.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                            {eventTypeLabel}
                          </span>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              isUpcoming
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {isUpcoming ? 'Proximo' : 'Passado'}
                          </span>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              live.status === 'published'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {live.status === 'published' ? 'Publicado' : 'Rascunho'}
                          </span>
                        </div>
                      </div>

                      <div className="mb-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span>
                          {eventDate.toLocaleDateString('pt-PT')} {live.startTime}
                        </span>
                        <span>{live.price === 0 ? 'Gratuito' : `${live.price}€`}</span>
                        <span>{live.attendeeCount} inscritos</span>
                        <span>
                          {formatDistanceToNow(new Date(live.updatedAt), {
                            addSuffix: true,
                            locale: ptBR,
                          })}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <Link to={`/hub/lives/${live.slug}`}>
                          <Button variant="ghost" size="sm">
                            Ver
                          </Button>
                        </Link>
                        <Link to={`/creators/dashboard/lives/${live.id}/edit`}>
                          <Button variant="ghost" size="sm">
                            Editar
                          </Button>
                        </Link>
                        {live.status === 'draft' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePublish(live.id)}
                            disabled={publishLive.isPending}
                          >
                            Publicar
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(live.id)}
                          disabled={deleteLive.isPending}
                          className="text-red-600 hover:text-red-700"
                        >
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
      </div>
    </DashboardLayout>
  )
}
