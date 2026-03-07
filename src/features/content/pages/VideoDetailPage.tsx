import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Clock3, Eye, Star } from 'lucide-react'
import { useVideo } from '@/features/hub/videos/hooks/useVideos'
import { videoService } from '@/features/hub/videos/services/videoService'

const formatDate = (value?: string): string => {
  if (!value) return 'Data indisponivel'
  const parsed = Date.parse(value)
  if (Number.isNaN(parsed)) return 'Data indisponivel'
  return new Intl.DateTimeFormat('pt-PT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(parsed))
}

const formatNumber = (value: number): string => {
  if (!Number.isFinite(value) || value <= 0) return '0'
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
  return `${Math.round(value)}`
}

const formatDuration = (seconds?: number): string => {
  if (!seconds || seconds <= 0) return 'Duracao indisponivel'
  const totalMinutes = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  if (totalMinutes < 60) return `${totalMinutes}m ${String(s).padStart(2, '0')}s`
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  return `${h}h ${m}m`
}

const resolveAuthor = (creator: unknown): string => {
  if (!creator || typeof creator === 'string') return 'FinHub'
  const row = creator as { name?: string; username?: string }
  return row.name || row.username || 'FinHub'
}

export default function VideoDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: video, isLoading, isError } = useVideo(slug || '')

  useEffect(() => {
    if (video?.id) {
      videoService.incrementView(video.id).catch(() => {})
    }
  }, [video?.id])

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (isError || !video) {
    return <Navigate to="/explorar/videos" replace />
  }

  const canEmbed = video.videoUrl && /^https?:\/\//i.test(video.videoUrl)

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 py-8 sm:px-6 md:px-10 lg:px-12">
        <div className="mx-auto max-w-5xl space-y-6">
          <Link
            to="/explorar/videos"
            className="inline-flex text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            Voltar para explorar videos
          </Link>

          <div className="overflow-hidden rounded-2xl border border-border/60 bg-card">
            {canEmbed ? (
              <div className="aspect-video w-full bg-black">
                <iframe
                  src={video.videoUrl}
                  title={video.title}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : video.thumbnail || video.coverImage ? (
              <img
                src={video.thumbnail || video.coverImage}
                alt={video.title}
                className="h-[320px] w-full object-cover"
              />
            ) : (
              <div className="flex h-[320px] items-center justify-center bg-muted text-sm text-muted-foreground">
                Video indisponivel para preview.
              </div>
            )}
          </div>

          <header className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
              <span className="rounded-full bg-primary/15 px-3 py-1 text-primary">Video</span>
              {video.isPremium ? (
                <span className="rounded-full bg-amber-500/20 px-3 py-1 text-amber-300">
                  Premium
                </span>
              ) : null}
              <span className="rounded-full bg-muted px-3 py-1 text-muted-foreground">
                {video.quality}
              </span>
            </div>

            <h1 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl">
              {video.title}
            </h1>

            <p className="text-base text-muted-foreground sm:text-lg">{video.description}</p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span>{resolveAuthor(video.creator)}</span>
              <span>{formatDate(video.publishedAt || video.createdAt)}</span>
              <span className="inline-flex items-center gap-1">
                <Clock3 className="h-4 w-4" />
                {formatDuration(video.duration)}
              </span>
              <span className="inline-flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {formatNumber(video.viewCount)}
              </span>
              <span className="inline-flex items-center gap-1">
                <Star className="h-4 w-4 text-amber-400" />
                {video.averageRating.toFixed(1)} ({formatNumber(video.ratingCount)})
              </span>
            </div>
          </header>

          {video.transcript ? (
            <section className="rounded-2xl border border-border/60 bg-card p-5 sm:p-6">
              <h2 className="mb-3 text-lg font-semibold text-foreground">Transcricao</h2>
              <p className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
                {video.transcript}
              </p>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  )
}

