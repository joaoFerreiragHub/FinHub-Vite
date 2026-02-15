import { useEffect, useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { usePodcast } from '../hooks/usePodcasts'
import { podcastService } from '../services/podcastService'
import {
  ContentMeta,
  ContentActions,
  RatingDistribution,
  RatingForm,
  CommentSection,
} from '@/features/hub/components'
import { usePermissions, usePaywall } from '@/features/auth'
import { Permission, isRoleAtLeast } from '@/lib/permissions/config'
import { Card, Button } from '@/components/ui'
import type { PodcastEpisode } from '../types'

/**
 * Pagina de detalhe do podcast (publica)
 */
export function PodcastDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: podcast, isLoading, error } = usePodcast(slug!)
  const { role, can } = usePermissions()
  const { PaywallComponent } = usePaywall()
  const [expandedEpisode, setExpandedEpisode] = useState<string | null>(null)

  useEffect(() => {
    if (podcast?.id) {
      podcastService.incrementView(podcast.id).catch(() => {})
    }
  }, [podcast?.id])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (error || !podcast) {
    return <Navigate to="/hub/podcasts" replace />
  }

  const hasAccess = isRoleAtLeast(role, podcast.requiredRole)

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const frequencyLabel: Record<string, string> = {
    daily: 'Diario',
    weekly: 'Semanal',
    biweekly: 'Quinzenal',
    monthly: 'Mensal',
  }

  return (
    <div className="min-h-screen bg-background">
      {podcast.coverImage && (
        <div className="relative h-96 overflow-hidden">
          <img
            src={podcast.coverImage}
            alt={podcast.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="container mx-auto">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-primary/90 px-3 py-1 text-sm font-medium text-primary-foreground">
                  Podcast
                </span>
                {podcast.isPremium && (
                  <span className="rounded-full bg-yellow-500 px-3 py-1 text-sm font-medium text-white">
                    Premium
                  </span>
                )}
                {podcast.frequency && (
                  <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-medium text-white">
                    {frequencyLabel[podcast.frequency] || podcast.frequency}
                  </span>
                )}
              </div>
              <h1 className="mt-3 text-4xl font-bold text-white md:text-5xl">{podcast.title}</h1>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
          {/* Main Content */}
          <div className="space-y-8">
            {!podcast.coverImage && (
              <header className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                    Podcast
                  </span>
                  {podcast.isPremium && (
                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
                      Premium
                    </span>
                  )}
                </div>
                <h1 className="text-4xl font-bold leading-tight md:text-5xl">{podcast.title}</h1>
              </header>
            )}

            <p className="text-lg text-muted-foreground">{podcast.description}</p>

            <div className="flex flex-wrap items-center gap-4">
              <ContentMeta content={podcast} showAvatar size="md" />
            </div>

            {podcast.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {podcast.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <ContentActions
              contentId={podcast.id}
              likeCount={podcast.likeCount}
              favoriteCount={podcast.favoriteCount}
              showLabels
            />

            <hr className="border-border" />

            {/* Episodes */}
            {hasAccess ? (
              <section className="space-y-4">
                <h2 className="text-2xl font-bold">Episodios ({podcast.totalEpisodes})</h2>

                {podcast.episodes.length === 0 ? (
                  <Card className="p-6 text-center text-muted-foreground">
                    Ainda nao ha episodios publicados
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {podcast.episodes
                      .filter((ep) => ep.isPublished)
                      .map((episode: PodcastEpisode, index: number) => (
                        <Card key={episode.id} className="overflow-hidden">
                          <div
                            className="flex cursor-pointer items-center gap-4 p-4 hover:bg-muted/30"
                            onClick={() =>
                              setExpandedEpisode(expandedEpisode === episode.id ? null : episode.id)
                            }
                          >
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold">{episode.title}</h3>
                              {episode.description && (
                                <p className="mt-0.5 text-sm text-muted-foreground line-clamp-1">
                                  {episode.description}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <span>{formatDuration(episode.duration)}</span>
                              <span>
                                {new Date(episode.publishedAt).toLocaleDateString('pt-PT')}
                              </span>
                            </div>
                          </div>

                          {expandedEpisode === episode.id && (
                            <div className="border-t border-border bg-muted/20 p-4 space-y-4">
                              {/* Audio Player */}
                              <audio controls className="w-full" src={episode.audioUrl}>
                                O teu browser nao suporta audio.
                              </audio>

                              {episode.description && (
                                <p className="text-sm text-muted-foreground">
                                  {episode.description}
                                </p>
                              )}

                              {episode.showNotes && (
                                <div>
                                  <h4 className="mb-2 text-sm font-semibold">Notas do Episodio</h4>
                                  <div className="prose prose-sm max-w-none text-muted-foreground">
                                    <p>{episode.showNotes}</p>
                                  </div>
                                </div>
                              )}

                              {episode.transcript && (
                                <details className="text-sm">
                                  <summary className="cursor-pointer font-medium text-primary">
                                    Ver transcricao
                                  </summary>
                                  <div className="mt-2 rounded-lg bg-background p-4 text-muted-foreground">
                                    {episode.transcript}
                                  </div>
                                </details>
                              )}
                            </div>
                          )}
                        </Card>
                      ))}
                  </div>
                )}
              </section>
            ) : (
              <div className="space-y-6">
                {podcast.excerpt && (
                  <div className="prose prose-lg max-w-none dark:prose-invert">
                    <p>{podcast.excerpt}</p>
                  </div>
                )}
                <PaywallComponent
                  title="Conteudo Premium"
                  description={`Este podcast requer plano ${podcast.requiredRole.toUpperCase()}. Faz upgrade para aceder.`}
                />
              </div>
            )}

            <hr className="border-border" />

            {/* Ratings */}
            {hasAccess && (
              <section className="space-y-6">
                <h2 className="text-2xl font-bold">Avaliacoes</h2>

                {podcast.ratingCount > 0 && (
                  <RatingDistribution
                    stats={{
                      averageRating: podcast.averageRating,
                      totalRatings: podcast.ratingCount,
                      distribution: {
                        5: Math.floor(podcast.ratingCount * 0.5),
                        4: Math.floor(podcast.ratingCount * 0.3),
                        3: Math.floor(podcast.ratingCount * 0.15),
                        2: Math.floor(podcast.ratingCount * 0.04),
                        1: Math.floor(podcast.ratingCount * 0.01),
                      },
                      percentages: { 5: 50, 4: 30, 3: 15, 2: 4, 1: 1 },
                    }}
                  />
                )}

                {can(Permission.RATE_CONTENT) ? (
                  <Card className="p-6">
                    <h3 className="mb-4 font-semibold">Avaliar este podcast</h3>
                    <RatingForm
                      targetType={podcast.type}
                      targetId={podcast.id}
                      onSubmit={async (data) => {
                        console.log('Submit rating:', data)
                      }}
                    />
                  </Card>
                ) : (
                  <Card className="p-6 text-center text-sm text-muted-foreground">
                    Faz login para avaliar este podcast
                  </Card>
                )}
              </section>
            )}

            <hr className="border-border" />

            {/* Comments */}
            {hasAccess && podcast.commentsEnabled && (
              <section>
                <CommentSection
                  targetType={podcast.type}
                  targetId={podcast.id}
                  response={{
                    items: [],
                    total: podcast.commentCount,
                    limit: 10,
                    offset: 0,
                    hasMore: false,
                  }}
                  enabled={podcast.commentsEnabled}
                  onSubmitComment={async (content) => {
                    console.log('Submit comment:', content)
                  }}
                  onReplyComment={async (commentId, content) => {
                    console.log('Reply:', commentId, content)
                  }}
                  onEditComment={async (commentId, content) => {
                    console.log('Edit:', commentId, content)
                  }}
                  onDeleteComment={async (commentId) => {
                    console.log('Delete:', commentId)
                  }}
                  onLikeComment={async (commentId) => {
                    console.log('Like:', commentId)
                  }}
                />
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <Card className="sticky top-6 p-6">
              <div className="space-y-4">
                <Button className="w-full" size="lg" variant="default">
                  Subscrever
                </Button>

                {/* External links */}
                <div className="space-y-2">
                  {podcast.spotifyUrl && (
                    <a
                      href={podcast.spotifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-lg border border-input px-4 py-2 text-sm font-medium hover:bg-muted"
                    >
                      Ouvir no Spotify
                    </a>
                  )}
                  {podcast.applePodcastsUrl && (
                    <a
                      href={podcast.applePodcastsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-lg border border-input px-4 py-2 text-sm font-medium hover:bg-muted"
                    >
                      Apple Podcasts
                    </a>
                  )}
                  {podcast.rssFeedUrl && (
                    <a
                      href={podcast.rssFeedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-lg border border-input px-4 py-2 text-sm font-medium hover:bg-muted"
                    >
                      RSS Feed
                    </a>
                  )}
                </div>

                <div className="space-y-3 pt-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Episodios</span>
                    <span className="font-medium">{podcast.totalEpisodes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duracao total</span>
                    <span className="font-medium">
                      {podcast.totalDuration >= 60
                        ? `${Math.floor(podcast.totalDuration / 60)}h ${podcast.totalDuration % 60}min`
                        : `${podcast.totalDuration} min`}
                    </span>
                  </div>
                  {podcast.frequency && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Frequencia</span>
                      <span className="font-medium">
                        {frequencyLabel[podcast.frequency] || podcast.frequency}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subscritores</span>
                    <span className="font-medium">{podcast.subscriberCount}</span>
                  </div>
                  {podcast.averageRating > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avaliacao</span>
                      <span className="font-medium">
                        {podcast.averageRating.toFixed(1)} ({podcast.ratingCount})
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
