import { Card } from '@/components/ui'
import { VideoForm } from '../components/VideoForm'
import { useVideoById, useUpdateVideo } from '@/features/hub/videos/hooks/useVideos'
import type { UpdateVideoDto } from '@/features/hub/videos/types'
import { CreatorDashboardShell } from '@/shared/layouts'

interface EditVideoProps {
  videoId?: string
}

const resolveVideoIdFromPathname = (): string => {
  if (typeof window === 'undefined') return ''

  const routeMatch = window.location.pathname.match(
    /^\/creators\/dashboard\/videos\/([^/?#]+)\/edit$/,
  )
  if (!routeMatch?.[1]) return ''

  return decodeURIComponent(routeMatch[1])
}

/**
 * Pagina de edicao de video
 */
export function EditVideo({ videoId }: EditVideoProps) {
  const resolvedVideoId = videoId || resolveVideoIdFromPathname()
  const { data: video, isLoading, error } = useVideoById(resolvedVideoId)
  const updateVideo = useUpdateVideo()

  const handleSubmit = async (data: UpdateVideoDto) => {
    if (!resolvedVideoId) return
    await updateVideo.mutateAsync({ id: resolvedVideoId, data })
  }

  if (!resolvedVideoId) {
    return (
      <CreatorDashboardShell>
        <Card className="mx-auto max-w-2xl p-6">
          <h1 className="text-xl font-semibold">Video nao encontrado</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Nao foi possivel identificar o video para edicao.
          </p>
          <a
            href="/creators/dashboard/videos"
            className="mt-4 inline-block text-sm text-primary hover:underline"
          >
            Voltar para a lista de videos
          </a>
        </Card>
      </CreatorDashboardShell>
    )
  }

  if (isLoading) {
    return (
      <CreatorDashboardShell>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </CreatorDashboardShell>
    )
  }

  if (error || !video) {
    return (
      <CreatorDashboardShell>
        <Card className="mx-auto max-w-2xl p-6">
          <h1 className="text-xl font-semibold">Video indisponivel</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            O video que procuras nao existe ou nao pode ser carregado neste momento.
          </p>
          <a
            href="/creators/dashboard/videos"
            className="mt-4 inline-block text-sm text-primary hover:underline"
          >
            Voltar para a lista de videos
          </a>
        </Card>
      </CreatorDashboardShell>
    )
  }

  return (
    <CreatorDashboardShell>
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Editar Video</h1>
          <p className="mt-1 text-muted-foreground">
            A editar: <span className="font-medium">{video.title}</span>
          </p>
        </div>

        <Card className="p-8">
          <VideoForm
            video={video}
            onSubmit={handleSubmit}
            submitText="Atualizar Video"
            showDraftOption={false}
          />
        </Card>
      </div>
    </CreatorDashboardShell>
  )
}
