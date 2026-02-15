import { useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { useVideo } from '../hooks/useVideos'
import { videoService } from '../services/videoService'
import {
  ContentMeta,
  ContentActions,
  RatingDistribution,
  RatingForm,
  CommentSection,
} from '@/features/hub/components'
import { usePermissions, usePaywall } from '@/features/auth'
import { Permission, isRoleAtLeast } from '@/lib/permissions/config'
import { Card } from '@/components/ui'

/**
 * Pagina de detalhe do video (publica)
 */
export function VideoDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: video, isLoading, error } = useVideo(slug!)
  const { role, can } = usePermissions()
  const { PaywallComponent } = usePaywall()

  useEffect(() => {
    if (video?.id) {
      videoService.incrementView(video.id).catch(() => {})
    }
  }, [video?.id])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (error || !video) {
    return <Navigate to="/hub/videos" replace />
  }

  const hasAccess = isRoleAtLeast(role, video.requiredRole)

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    if (h > 0) return `${h}h ${m}min`
    return `${m}:${String(s).padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Video Player */}
            {hasAccess ? (
              <div className="aspect-video overflow-hidden rounded-xl bg-black">
                <iframe
                  src={video.videoUrl}
                  title={video.title}
                  className="h-full w-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
            ) : (
              <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
                {video.thumbnail && (
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="h-full w-full object-cover opacity-50"
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <PaywallComponent
                    title="Video Premium"
                    description={`Este video requer plano ${video.requiredRole.toUpperCase()}. Faz upgrade para assistir.`}
                  />
                </div>
              </div>
            )}

            <header className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  Video
                </span>
                {video.isPremium && (
                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
                    Premium
                  </span>
                )}
                <span className="text-sm text-muted-foreground">
                  {formatDuration(video.duration)} · {video.quality}
                </span>
              </div>

              <h1 className="text-3xl font-bold leading-tight md:text-4xl">{video.title}</h1>

              <div className="flex flex-wrap items-center gap-4">
                <ContentMeta content={video} showAvatar size="md" />
              </div>

              {video.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {video.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            <ContentActions
              contentId={video.id}
              likeCount={video.likeCount}
              favoriteCount={video.favoriteCount}
              showLabels
            />

            <hr className="border-border" />

            <div className="prose max-w-none dark:prose-invert">
              <p>{video.description}</p>
            </div>

            {/* Transcript */}
            {hasAccess && video.transcript && (
              <details className="rounded-lg border border-border">
                <summary className="cursor-pointer px-6 py-4 font-semibold">Transcricao</summary>
                <div className="border-t border-border px-6 py-4 text-sm text-muted-foreground whitespace-pre-wrap">
                  {video.transcript}
                </div>
              </details>
            )}

            <hr className="border-border" />

            {/* Ratings */}
            {hasAccess && (
              <section className="space-y-6">
                <h2 className="text-2xl font-bold">Avaliacoes</h2>

                {video.ratingCount > 0 && (
                  <RatingDistribution
                    stats={{
                      averageRating: video.averageRating,
                      totalRatings: video.ratingCount,
                      distribution: {
                        5: Math.floor(video.ratingCount * 0.5),
                        4: Math.floor(video.ratingCount * 0.3),
                        3: Math.floor(video.ratingCount * 0.15),
                        2: Math.floor(video.ratingCount * 0.04),
                        1: Math.floor(video.ratingCount * 0.01),
                      },
                      percentages: { 5: 50, 4: 30, 3: 15, 2: 4, 1: 1 },
                    }}
                  />
                )}

                {can(Permission.RATE_CONTENT) ? (
                  <Card className="p-6">
                    <h3 className="mb-4 font-semibold">Avaliar este video</h3>
                    <RatingForm
                      targetType={video.type}
                      targetId={video.id}
                      onSubmit={async (data) => {
                        console.log('Submit rating:', data)
                      }}
                    />
                  </Card>
                ) : (
                  <Card className="p-6 text-center text-sm text-muted-foreground">
                    Faz login para avaliar este video
                  </Card>
                )}
              </section>
            )}

            <hr className="border-border" />

            {/* Comments */}
            {hasAccess && video.commentsEnabled && (
              <section>
                <CommentSection
                  targetType={video.type}
                  targetId={video.id}
                  response={{
                    items: [],
                    total: video.commentCount,
                    limit: 10,
                    offset: 0,
                    hasMore: false,
                  }}
                  enabled={video.commentsEnabled}
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
            <Card className="p-6">
              <h3 className="mb-4 font-semibold">Informacoes</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duracao</span>
                  <span className="font-medium">{formatDuration(video.duration)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Qualidade</span>
                  <span className="font-medium">{video.quality}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Visualizacoes</span>
                  <span className="font-medium">{video.viewCount}</span>
                </div>
                {video.averageRating > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avaliacao</span>
                    <span className="font-medium">
                      {video.averageRating.toFixed(1)} ({video.ratingCount})
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Idioma</span>
                  <span className="font-medium">{video.language}</span>
                </div>
              </div>
            </Card>

            {video.subtitles && video.subtitles.length > 0 && (
              <Card className="p-6">
                <h3 className="mb-4 font-semibold">Legendas</h3>
                <div className="space-y-2">
                  {video.subtitles.map((sub) => (
                    <div key={sub.language} className="text-sm">
                      {sub.language}
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </aside>
        </div>
      </div>
    </div>
  )
}
