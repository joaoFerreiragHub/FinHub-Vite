import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { MessageSquare, Users } from 'lucide-react'
import { Button } from '@/components/ui'
import { getErrorMessage } from '@/lib/api/client'
import { LeaderboardWidget } from '../components/LeaderboardWidget'
import { communityService } from '../services/communityService'
import type { CommunityRoom, CommunityRoomCategory } from '../types/community'

const ROOMS_PER_PAGE = 12

const isPremiumRoom = (room: CommunityRoom): boolean =>
  room.isPremium || room.requiredRole === 'premium'

// Translucent tinted background for each category's icon header
const CATEGORY_BG: Record<CommunityRoomCategory, string> = {
  general: 'rgba(99,102,241,0.10)',
  budgeting: 'rgba(245,158,11,0.10)',
  investing: 'rgba(16,185,129,0.10)',
  real_estate: 'rgba(249,115,22,0.10)',
  fire: 'rgba(239,68,68,0.10)',
  credit: 'rgba(59,130,246,0.10)',
  expat: 'rgba(6,182,212,0.10)',
  beginners: 'rgba(139,92,246,0.10)',
  premium: 'rgba(245,158,11,0.15)',
}

// Foreground accent per category for "Entrar →" and hover cues
const CATEGORY_COLOR: Record<CommunityRoomCategory, string> = {
  general: '#6366f1',
  budgeting: '#d97706',
  investing: '#059669',
  real_estate: '#ea580c',
  fire: '#dc2626',
  credit: '#2563eb',
  expat: '#0891b2',
  beginners: '#7c3aed',
  premium: '#d97706',
}

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
      {/* Header */}
      <section className="relative mb-8 overflow-hidden rounded-2xl border border-brand/20 bg-brand/[0.03] p-6 dark:bg-brand/[0.06] sm:p-8">
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-brand via-brand/50 to-transparent" />
        <p className="text-xs font-semibold uppercase tracking-widest text-brand">
          FinHub Comunidade
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tighter text-foreground sm:text-4xl">
          Salas da Comunidade
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Escolhe uma sala, participa em discussões e cresce com outros investidores portugueses.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          {/* Loading skeletons */}
          {roomsQuery.isLoading ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={`community-room-loading-${index}`}
                  className="animate-pulse overflow-hidden rounded-xl border border-border/50 bg-card"
                >
                  <div className="h-[72px] bg-muted/40" />
                  <div className="p-5">
                    <div className="mb-2 h-5 w-28 rounded bg-muted" />
                    <div className="h-3.5 w-full rounded bg-muted" />
                    <div className="mt-1.5 h-3.5 w-4/5 rounded bg-muted" />
                    <div className="mt-5 h-3 w-24 rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {/* Error */}
          {roomsQuery.error ? (
            <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-6">
              <p className="font-semibold text-foreground">Erro ao carregar salas</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {getErrorMessage(roomsQuery.error)}
              </p>
            </div>
          ) : null}

          {/* Rooms grid */}
          {!roomsQuery.isLoading && !roomsQuery.error ? (
            <>
              {rooms.length > 0 ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {rooms.map((room) => {
                    const premium = isPremiumRoom(room)
                    const headerBg = premium
                      ? CATEGORY_BG.premium
                      : (CATEGORY_BG[room.category] ?? CATEGORY_BG.general)
                    const accentColor = premium
                      ? CATEGORY_COLOR.premium
                      : (CATEGORY_COLOR[room.category] ?? CATEGORY_COLOR.general)

                    return (
                      <a
                        key={room.id}
                        href={`/comunidade/${encodeURIComponent(room.slug)}`}
                        className="group block"
                      >
                        <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border/60 bg-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
                          {/* Icon + name row */}
                          <div className="flex items-start gap-3 p-4 sm:p-5">
                            {/* Category-tinted icon badge */}
                            <div
                              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-2xl leading-none"
                              style={{ backgroundColor: headerBg }}
                              aria-hidden="true"
                            >
                              {room.icon}
                            </div>

                            {/* Name + premium + description */}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <h3 className="text-base font-extrabold leading-tight tracking-tight text-foreground transition-colors group-hover:text-brand">
                                  {room.name}
                                </h3>
                                {premium ? (
                                  <span className="shrink-0 rounded-full border border-amber-400/50 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-amber-600 dark:bg-amber-950/30 dark:text-amber-400">
                                    Premium
                                  </span>
                                ) : null}
                              </div>
                              <p className="mt-1 line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {room.description}
                              </p>
                            </div>
                          </div>

                          {/* Footer */}
                          <div className="mt-auto flex items-center justify-between border-t border-border/40 px-4 pb-4 pt-3 sm:px-5">
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span className="inline-flex items-center gap-1">
                                <Users className="h-3.5 w-3.5" />
                                {room.memberCount.toLocaleString('pt-PT')}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <MessageSquare className="h-3.5 w-3.5" />
                                {room.postCount.toLocaleString('pt-PT')}
                              </span>
                            </div>
                            <span
                              className="text-[11px] font-bold opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                              style={{ color: accentColor }}
                            >
                              Entrar →
                            </span>
                          </div>
                        </div>
                      </a>
                    )
                  })}
                </div>
              ) : (
                <div className="rounded-xl border border-border/50 bg-card p-8 text-center">
                  <p className="font-semibold text-foreground">Sem salas disponíveis</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Não existem salas públicas para mostrar neste momento.
                  </p>
                </div>
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
                    Página {pagination.page} de {pagination.pages}
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
