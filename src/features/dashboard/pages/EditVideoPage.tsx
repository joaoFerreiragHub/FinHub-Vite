import { Navigate, useParams } from 'react-router-dom'
import { Card } from '@/components/ui'
import { VideoForm } from '@/features/creators/dashboard/videos/components/VideoForm'
import { useUpdateVideo, useVideoById } from '@/features/hub/videos/hooks/useVideos'
import type { UpdateVideoDto } from '@/features/hub/videos/types'

export default function EditVideoPage() {
  const { id } = useParams<{ id: string }>()
  const videoId = id ?? ''
  const { data: video, isLoading, error } = useVideoById(videoId)
  const updateVideo = useUpdateVideo()

  const handleSubmit = async (data: UpdateVideoDto) => {
    if (!videoId) return
    await updateVideo.mutateAsync({ id: videoId, data })
  }

  if (!videoId) {
    return <Navigate to="/dashboard/conteudo/videos" replace />
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (error || !video) {
    return <Navigate to="/dashboard/conteudo/videos" replace />
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Editar video</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A editar: <span className="font-medium">{video.title}</span>
        </p>
      </header>

      <Card className="p-6 sm:p-8">
        <VideoForm
          video={video}
          onSubmit={handleSubmit}
          submitText="Atualizar video"
          showDraftOption={false}
          redirectTo="/dashboard/conteudo/videos"
        />
      </Card>
    </div>
  )
}
