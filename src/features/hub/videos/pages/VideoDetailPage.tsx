import { useEffect, useMemo } from 'react'
import { Helmet } from '@/lib/helmet'
import { Navigate, useParams } from 'react-router-dom'
import { Clock3, PlayCircle } from 'lucide-react'
import { Card } from '@/components/ui'
import { ContentMeta, RatingsSection, CommentSection } from '@/features/hub/components'
import { useVideo } from '../hooks/useVideos'
import { videoService } from '../services/videoService'
import { usePermissions, usePaywall } from '@/features/auth'
import { useAuthStore } from '@/features/auth/stores/useAuthStore'
import type { UserSocialLinks } from '@/features/auth/types'
import { getErrorMessage } from '@/lib/api/client'
import { isRoleAtLeast } from '@/lib/permissions/config'
import { useComments } from '@/features/hub/hooks/useComments'
import { ContentType } from '@/features/hub/types'
import { FollowButton } from '@/features/social/components/FollowButton'

interface VideoDetailPageProps {
  slug?: string
}

interface CreatorSummary {
  id: string
  name: string
  username: string
  avatar?: string
  bio?: string
  socialLinks?: UserSocialLinks
}

const toNumber = (value: unknown, fallback = 0): number => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

const toString = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback

const toRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' ? (value as Record<string, unknown>) : {}

const resolveCreatorSummary = (video: unknown): CreatorSummary => {
  const row = toRecord(video)
  const creatorValue = row.creator
  const creatorRecord = toRecord(creatorValue)

  const fallbackId = toString(row.creatorId, toString(creatorValue, 'unknown-creator'))
  const fallbackName = toString(row.author, 'Criador FinHub')
  const fallbackUsername = fallbackName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-_]/g, '')

  const id = toString(
    creatorRecord.id,
    toString(creatorRecord._id, fallbackId || 'unknown-creator'),
  )
  const name = toString(creatorRecord.name, fallbackName || 'Criador FinHub')
  const username = toString(creatorRecord.username, fallbackUsername || 'creator')
  const avatar = toString(creatorRecord.avatar) || undefined
  const bio = toString(creatorRecord.bio) || undefined

  const socialLinksRecord = toRecord(creatorRecord.socialLinks)
  const hasSocialLinks = Object.keys(socialLinksRecord).length > 0

  return {
    id,
    name,
    username,
    avatar,
    bio,
    socialLinks: hasSocialLinks ? (socialLinksRecord as UserSocialLinks) : undefined,
  }
}

const resolveSocialLinks = (links?: UserSocialLinks): Array<{ label: string; url: string }> => {
  if (!links) {
    return []
  }

  return Object.entries(links)
    .filter(([, url]) => typeof url === 'string' && url.trim().length > 0)
    .map(([platform, url]) => ({
      label: platform.charAt(0).toUpperCase() + platform.slice(1),
      url: String(url),
    }))
}

const resolveViewCount = (video: unknown): number => {
  const row = toRecord(video)
  return toNumber(row.viewCount, toNumber(row.views, 0))
}

const resolveLikeCount = (video: unknown): number => {
  const row = toRecord(video)
  return toNumber(row.likeCount, toNumber(row.likes, 0))
}

const resolveDurationSeconds = (video: unknown): number => {
  const row = toRecord(video)
  return toNumber(row.duration, 0)
}

const formatDuration = (seconds: number): string => {
  if (seconds <= 0) {
    return 'N/A'
  }

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  if (hours > 0) {
    return `${hours}h ${minutes}min`
  }

  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`
}

const getYouTubeEmbedUrl = (input: string): string | null => {
  try {
    const url = new URL(input)
    const host = url.hostname.replace(/^www\./, '')

    if (host === 'youtu.be') {
      const videoId = url.pathname.slice(1)
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null
    }

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      if (url.pathname === '/watch') {
        const id = url.searchParams.get('v')
        return id ? `https://www.youtube.com/embed/${id}` : null
      }

      if (url.pathname.startsWith('/shorts/')) {
        const id = url.pathname.replace('/shorts/', '').split('/')[0]
        return id ? `https://www.youtube.com/embed/${id}` : null
      }

      if (url.pathname.startsWith('/embed/')) {
        const id = url.pathname.replace('/embed/', '').split('/')[0]
        return id ? `https://www.youtube.com/embed/${id}` : null
      }
    }
  } catch {
    return null
  }

  return null
}

const getVimeoEmbedUrl = (input: string): string | null => {
  try {
    const url = new URL(input)
    const host = url.hostname.replace(/^www\./, '')
    if (host !== 'vimeo.com' && host !== 'player.vimeo.com') {
      return null
    }

    const id = url.pathname.split('/').filter(Boolean).at(-1)
    return id ? `https://player.vimeo.com/video/${id}` : null
  } catch {
    return null
  }
}

const isDirectVideoFile = (input: string): boolean =>
  /\.(mp4|webm|ogg|m4v|mov)(\?|#|$)/i.test(input)

type PlayerSource =
  | { kind: 'iframe'; src: string }
  | { kind: 'video'; src: string }
  | { kind: 'empty'; src: '' }

const resolvePlayerSource = (videoUrl: string): PlayerSource => {
  if (!videoUrl) {
    return { kind: 'empty', src: '' }
  }

  const youtube = getYouTubeEmbedUrl(videoUrl)
  if (youtube) {
    return { kind: 'iframe', src: youtube }
  }

  const vimeo = getVimeoEmbedUrl(videoUrl)
  if (vimeo) {
    return { kind: 'iframe', src: vimeo }
  }

  if (isDirectVideoFile(videoUrl)) {
    return { kind: 'video', src: videoUrl }
  }

  return { kind: 'video', src: videoUrl }
}

export function VideoDetailPage({ slug }: VideoDetailPageProps) {
  const params = useParams<{ slug: string }>()
  const resolvedSlug = (slug || params.slug || '').trim()

  const { data: video, isLoading, error } = useVideo(resolvedSlug)
  const { role } = usePermissions()
  const { PaywallComponent } = usePaywall()
  const currentUserId = useAuthStore((state) => state.user?.id)

  const hasAccess = video ? isRoleAtLeast(role, video.requiredRole) : false
  const commentsEnabled = video?.commentsEnabled ?? true

  const comments = useComments(ContentType.VIDEO, video?.id ?? '', {
    enabled: hasAccess && commentsEnabled,
    currentUserId,
    contentQueryKey: ['video', resolvedSlug],
  })

  const creator = useMemo(() => resolveCreatorSummary(video), [video])
  const creatorLinks = useMemo(() => resolveSocialLinks(creator.socialLinks), [creator.socialLinks])
  const durationSeconds = useMemo(() => resolveDurationSeconds(video), [video])
  const viewCount = useMemo(() => resolveViewCount(video), [video])
  const likeCount = useMemo(() => resolveLikeCount(video), [video])
  const playerSource = useMemo(() => resolvePlayerSource(video?.videoUrl ?? ''), [video?.videoUrl])

  useEffect(() => {
    if (video?.id) {
      videoService.incrementView(video.id).catch(() => {})
    }
  }, [video?.id])

  if (!resolvedSlug) {
    return <Navigate to="/hub/videos" replace />
  }

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

  const tags = Array.isArray(video.tags) ? video.tags : []
  const seoDescription = video.description || video.excerpt || 'Video FinHub'
  const canonicalUrl =
    typeof window !== 'undefined'
      ? window.location.href
      : `/hub/videos/${encodeURIComponent(resolvedSlug)}`

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{`${video.title} | Video FinHub`}</title>
        <meta name="description" content={seoDescription} />
        <meta property="og:title" content={video.title} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:type" content="video.other" />
        {video.thumbnail ? <meta property="og:image" content={video.thumbnail} /> : null}
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article className="space-y-6">
            {hasAccess ? (
              <div className="aspect-video overflow-hidden rounded-xl bg-black">
                {playerSource.kind === 'iframe' ? (
                  <iframe
                    src={playerSource.src}
                    title={video.title}
                    className="h-full w-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                ) : playerSource.kind === 'video' ? (
                  <video
                    controls
                    className="h-full w-full"
                    src={playerSource.src}
                    poster={video.thumbnail || video.coverImage}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    Video indisponivel.
                  </div>
                )}
              </div>
            ) : (
              <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
                {video.thumbnail || video.coverImage ? (
                  <img
                    src={video.thumbnail || video.coverImage}
                    alt={video.title}
                    className="h-full w-full object-cover opacity-50"
                  />
                ) : null}
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <PaywallComponent
                    title="Video Premium"
                    description={`Este video requer plano ${video.requiredRole.toUpperCase()}. Faz upgrade para assistir.`}
                  />
                </div>
              </div>
            )}

            <header className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  Video
                </span>
                {video.isPremium ? (
                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
                    Premium
                  </span>
                ) : null}
                <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock3 className="h-4 w-4" />
                  {formatDuration(durationSeconds)}
                </span>
              </div>

              <h1 className="text-4xl font-bold leading-tight md:text-5xl">{video.title}</h1>
              <p className="text-lg text-muted-foreground">{video.description}</p>

              <div className="flex flex-wrap items-center gap-4">
                <ContentMeta content={video} showAvatar size="md" />
                {video.quality ? (
                  <span className="text-sm text-muted-foreground">
                    {video.quality.toUpperCase()}
                  </span>
                ) : null}
              </div>

              {tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </header>

            <hr className="border-border" />

            {hasAccess && video.transcript ? (
              <details className="rounded-lg border border-border">
                <summary className="cursor-pointer px-6 py-4 font-semibold">Transcricao</summary>
                <div className="whitespace-pre-wrap border-t border-border px-6 py-4 text-sm text-muted-foreground">
                  {video.transcript}
                </div>
              </details>
            ) : null}

            <hr className="border-border" />

            {hasAccess ? (
              <RatingsSection
                targetType="video"
                targetId={video.id}
                formTitle="Avaliar este video"
                contentQueryKey={['video', resolvedSlug]}
              />
            ) : null}

            <hr className="border-border" />

            {hasAccess && commentsEnabled ? (
              <section className="space-y-3">
                {comments.error ? (
                  <p className="text-sm text-red-600">
                    Erro ao carregar comentarios: {getErrorMessage(comments.error)}
                  </p>
                ) : null}

                <CommentSection
                  targetType={video.type}
                  targetId={video.id}
                  currentUserId={currentUserId}
                  response={comments.response}
                  enabled={commentsEnabled}
                  onSubmitComment={comments.submitComment}
                  onReplyComment={comments.replyToComment}
                  onEditComment={comments.editComment}
                  onDeleteComment={comments.deleteComment}
                  onLikeComment={comments.likeComment}
                  onLoadMore={comments.loadMore}
                  isLoading={comments.isLoading}
                  sortBy={comments.sortBy}
                  onSortChange={comments.setSortBy}
                />
              </section>
            ) : null}
          </article>

          <aside className="space-y-6">
            <Card className="sticky top-6 p-6">
              <h2 className="mb-4 text-lg font-semibold">Criador</h2>

              <div className="mb-4 flex items-center gap-3">
                {creator.avatar ? (
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
                    {creator.name.slice(0, 2).toUpperCase()}
                  </div>
                )}

                <div className="min-w-0">
                  <p className="truncate font-semibold text-foreground">{creator.name}</p>
                  <p className="truncate text-sm text-muted-foreground">@{creator.username}</p>
                </div>
              </div>

              {creator.bio ? (
                <p className="mb-4 text-sm text-muted-foreground">{creator.bio}</p>
              ) : null}

              {creator.id ? (
                <FollowButton
                  creatorId={creator.id}
                  creatorName={creator.name}
                  creatorUsername={creator.username}
                  creatorAvatar={creator.avatar}
                  creatorBio={creator.bio}
                  size="sm"
                />
              ) : null}

              {creatorLinks.length > 0 ? (
                <div className="mt-4 space-y-2 border-t border-border pt-4">
                  {creatorLinks.map((link) => (
                    <a
                      key={`${link.label}-${link.url}`}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-primary hover:underline"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              ) : null}
            </Card>

            <Card className="p-6">
              <h3 className="mb-3 text-sm font-semibold text-foreground">Estatisticas do video</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="tabular-nums">Duracao: {formatDuration(durationSeconds)}</p>
                <p className="tabular-nums">Qualidade: {video.quality || 'N/A'}</p>
                <p className="tabular-nums">Views: {viewCount}</p>
                <p className="tabular-nums">Likes: {likeCount}</p>
                <p className="tabular-nums">Rating medio: {video.averageRating.toFixed(1)}</p>
              </div>
            </Card>

            {hasAccess && video.subtitles && video.subtitles.length > 0 ? (
              <Card className="p-6">
                <h3 className="mb-3 text-sm font-semibold">Legendas</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  {video.subtitles.map((subtitle) => (
                    <p key={subtitle.language}>{subtitle.language}</p>
                  ))}
                </div>
              </Card>
            ) : null}

            {!hasAccess ? (
              <Card className="p-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <PlayCircle className="h-4 w-4" />
                  Requer plano {video.requiredRole.toUpperCase()}
                </div>
              </Card>
            ) : null}
          </aside>
        </div>
      </div>
    </div>
  )
}
