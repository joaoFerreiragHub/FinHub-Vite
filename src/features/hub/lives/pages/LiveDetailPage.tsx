import { useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { useLive, useRegisterLive } from '../hooks/useLives'
import { liveService } from '../services/liveService'
import {
  ContentMeta,
  ContentActions,
  RatingsSection,
  CommentSection,
} from '@/features/hub/components'
import { usePermissions, usePaywall } from '@/features/auth'
import { isRoleAtLeast } from '@/lib/permissions/config'
import { Card, Button } from '@/components/ui'

/**
 * Pagina de detalhe do evento (publica)
 */
export function LiveDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: live, isLoading, error } = useLive(slug!)
  const { role } = usePermissions()
  const { PaywallComponent } = usePaywall()
  const registerMutation = useRegisterLive()

  useEffect(() => {
    if (live?.id) {
      liveService.incrementView(live.id).catch(() => {})
    }
  }, [live?.id])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (error || !live) {
    return <Navigate to="/hub/lives" replace />
  }

  const hasAccess = isRoleAtLeast(role, live.requiredRole)

  const handleRegister = async () => {
    try {
      await registerMutation.mutateAsync(live.id)
    } catch {
      // Handle error
    }
  }

  const eventDate = new Date(live.startDate)
  const isUpcoming = eventDate > new Date()
  const isPast = eventDate < new Date()

  const eventTypeLabel =
    live.eventType === 'online'
      ? 'Online'
      : live.eventType === 'presencial'
        ? 'Presencial'
        : 'Hibrido'

  return (
    <div className="min-h-screen bg-background">
      {live.coverImage && (
        <div className="relative h-96 overflow-hidden">
          <img src={live.coverImage} alt={live.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="container mx-auto">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-primary/90 px-3 py-1 text-sm font-medium text-primary-foreground">
                  Evento
                </span>
                <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-medium text-white">
                  {eventTypeLabel}
                </span>
                {live.isPremium && (
                  <span className="rounded-full bg-yellow-500 px-3 py-1 text-sm font-medium text-white">
                    Premium
                  </span>
                )}
                {isUpcoming && (
                  <span className="rounded-full bg-green-500 px-3 py-1 text-sm font-medium text-white">
                    Proximo
                  </span>
                )}
                {isPast && (
                  <span className="rounded-full bg-gray-500 px-3 py-1 text-sm font-medium text-white">
                    Terminado
                  </span>
                )}
              </div>
              <h1 className="mt-3 text-4xl font-bold text-white md:text-5xl">{live.title}</h1>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
          {/* Main Content */}
          <div className="space-y-8">
            {!live.coverImage && (
              <header className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                    Evento
                  </span>
                  <span className="rounded-full bg-muted px-3 py-1 text-sm font-medium">
                    {eventTypeLabel}
                  </span>
                  {live.isPremium && (
                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
                      Premium
                    </span>
                  )}
                </div>
                <h1 className="text-4xl font-bold leading-tight md:text-5xl">{live.title}</h1>
              </header>
            )}

            <p className="text-lg text-muted-foreground">{live.description}</p>

            <div className="flex flex-wrap items-center gap-4">
              <ContentMeta content={live} showAvatar size="md" />
            </div>

            {live.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {live.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <ContentActions
              contentId={live.id}
              likeCount={live.likeCount}
              favoriteCount={live.favoriteCount}
              showLabels
            />

            <hr className="border-border" />

            {/* Event Details */}
            {hasAccess ? (
              <section className="space-y-6">
                {/* Location / Meeting */}
                {live.eventType !== 'presencial' && live.meetingUrl && (
                  <Card className="p-6">
                    <h2 className="mb-4 text-xl font-bold">Link da Sessao</h2>
                    {isUpcoming ? (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          O link estara disponivel quando o evento comecar.
                        </p>
                        {live.isRegistered && (
                          <a
                            href={live.meetingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-primary hover:underline"
                          >
                            Entrar na Sessao
                          </a>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Este evento ja terminou.</p>
                    )}
                  </Card>
                )}

                {(live.eventType === 'presencial' || live.eventType === 'hybrid') &&
                  live.address && (
                    <Card className="p-6">
                      <h2 className="mb-4 text-xl font-bold">Localizacao</h2>
                      <p className="text-sm">{live.address}</p>
                    </Card>
                  )}
              </section>
            ) : (
              <div className="space-y-6">
                <PaywallComponent
                  title="Evento Premium"
                  description={`Este evento requer plano ${live.requiredRole.toUpperCase()}. Faz upgrade para aceder.`}
                />
              </div>
            )}

            <hr className="border-border" />

            {/* Ratings */}
            {hasAccess && (
              <RatingsSection
                targetType="live"
                targetId={live.id}
                formTitle="Avaliar este evento"
                contentQueryKey={['live', slug]}
              />
            )}

            <hr className="border-border" />

            {/* Comments */}
            {hasAccess && live.commentsEnabled && (
              <section>
                <CommentSection
                  targetType={live.type}
                  targetId={live.id}
                  response={{
                    items: [],
                    total: live.commentCount,
                    limit: 10,
                    offset: 0,
                    hasMore: false,
                  }}
                  enabled={live.commentsEnabled}
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
                    {live.price === 0 ? (
                      <span className="text-green-600">Gratuito</span>
                    ) : (
                      <span>
                        {live.price}
                        {live.currency || '€'}
                      </span>
                    )}
                  </div>
                </div>

                {isUpcoming && !live.isRegistered && (
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleRegister}
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending
                      ? 'A inscrever...'
                      : live.price === 0
                        ? 'Inscrever-se Gratuitamente'
                        : 'Comprar Bilhete'}
                  </Button>
                )}

                {live.isRegistered && isUpcoming && (
                  <Button className="w-full" size="lg" variant="outline" disabled>
                    Inscrito
                  </Button>
                )}

                {isPast && (
                  <Button className="w-full" size="lg" variant="outline" disabled>
                    Evento Terminado
                  </Button>
                )}

                <div className="space-y-3 pt-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tipo</span>
                    <span className="font-medium">{eventTypeLabel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Data</span>
                    <span className="font-medium">
                      {eventDate.toLocaleDateString('pt-PT', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Horario</span>
                    <span className="font-medium">
                      {live.startTime}
                      {live.endTime ? ` - ${live.endTime}` : ''}
                    </span>
                  </div>
                  {live.maxAttendees && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Capacidade</span>
                      <span className="font-medium">
                        {live.attendeeCount}/{live.maxAttendees}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Inscritos</span>
                    <span className="font-medium">{live.attendeeCount}</span>
                  </div>
                  {live.averageRating > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avaliacao</span>
                      <span className="font-medium">
                        {live.averageRating.toFixed(1)} ({live.ratingCount})
                      </span>
                    </div>
                  )}
                  {live.registrationDeadline && isUpcoming && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Inscricoes ate</span>
                      <span className="font-medium">
                        {new Date(live.registrationDeadline).toLocaleDateString('pt-PT')}
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
