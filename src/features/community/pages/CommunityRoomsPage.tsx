import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui'
import { getErrorMessage } from '@/lib/api/client'
import { LeaderboardWidget } from '../components/LeaderboardWidget'
import { communityService } from '../services/communityService'
import type { CommunityRoom } from '../types/community'

const ROOMS_PER_PAGE = 12

const isPremiumRoom = (room: CommunityRoom): boolean =>
  room.isPremium || room.requiredRole === 'premium'

const formatCount = (value: number, singular: string, plural: string): string =>
  `${value} ${value === 1 ? singular : plural}`

export function CommunityRoomsPage() {
  const [page, setPage] = useState(1)

  const roomsQuery = useQuery({
    queryKey: ['community-rooms', page],
    queryFn: () => communityService.listRooms({ page, limit: ROOMS_PER_PAGE }),
    staleTime: 60_000,
  })

  const rooms = roomsQuery.data?.items ?? []
  const pagination = roomsQuery.data?.pagination

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="mb-8 rounded-2xl border border-border bg-card p-6 sm:p-8">
        <p className="text-sm font-medium uppercase tracking-wide text-primary">
          Comunidade FinHub
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Salas da Comunidade
        </h1>
        <p className="mt-3 max-w-3xl text-sm text-muted-foreground sm:text-base">
          Escolhe uma sala para participar em discussoes com outros membros, tirar duvidas e
          partilhar experiencias financeiras.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          {roomsQuery.isLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={`community-room-loading-${index}`} className="animate-pulse">
                  <CardHeader>
                    <div className="mb-2 h-5 w-24 rounded bg-muted" />
                    <div className="h-6 w-48 rounded bg-muted" />
                  </CardHeader>
                  <CardContent>
                    <div className="mb-2 h-4 w-full rounded bg-muted" />
                    <div className="h-4 w-4/5 rounded bg-muted" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : null}

          {roomsQuery.error ? (
            <Card className="border-red-500/60 bg-red-50/70">
              <CardHeader>
                <CardTitle>Erro ao carregar salas</CardTitle>
                <CardDescription>{getErrorMessage(roomsQuery.error)}</CardDescription>
              </CardHeader>
            </Card>
          ) : null}

          {!roomsQuery.isLoading && !roomsQuery.error ? (
            <>
              {rooms.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {rooms.map((room) => {
                    const premiumRoom = isPremiumRoom(room)

                    return (
                      <a
                        key={room.id}
                        href={`/comunidade/${encodeURIComponent(room.slug)}`}
                        className="block"
                      >
                        <Card className="h-full transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
                          <CardHeader>
                            <div className="flex items-start justify-between gap-3">
                              <span className="text-3xl leading-none">{room.icon}</span>
                              {premiumRoom ? <Badge variant="secondary">PREMIUM</Badge> : null}
                            </div>
                            <CardTitle className="pt-1 text-xl">{room.name}</CardTitle>
                            <CardDescription className="line-clamp-3 min-h-[3.5rem]">
                              {room.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>{formatCount(room.postCount, 'post', 'posts')}</span>
                              <span>{formatCount(room.memberCount, 'membro', 'membros')}</span>
                            </div>
                          </CardContent>
                        </Card>
                      </a>
                    )
                  })}
                </div>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Sem salas disponiveis</CardTitle>
                    <CardDescription>
                      Nao existem salas publicas para mostrar neste momento.
                    </CardDescription>
                  </CardHeader>
                </Card>
              )}

              {pagination && pagination.pages > 1 ? (
                <div className="mt-6 flex items-center justify-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={page <= 1 || roomsQuery.isFetching}
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                  >
                    Anterior
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Pagina {pagination.page} de {pagination.pages}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={page >= pagination.pages || roomsQuery.isFetching}
                    onClick={() => setPage((current) => Math.min(pagination.pages, current + 1))}
                  >
                    Seguinte
                  </Button>
                </div>
              ) : null}
            </>
          ) : null}
        </div>

        <aside className="lg:sticky lg:top-24">
          <LeaderboardWidget />
        </aside>
      </div>
    </div>
  )
}
