import { useParams, Navigate } from 'react-router-dom'
import { DashboardLayout } from '@/shared/layouts'
import { VideoForm } from '../components/VideoForm'
import { useVideo, useUpdateVideo } from '@/features/hub/videos/hooks/useVideos'
import { Card } from '@/components/ui'
import type { UpdateVideoDto } from '@/features/hub/videos/types'

/**
 * Pagina de edicao de video
 */
export function EditVideo() {
  const { id } = useParams<{ id: string }>()
  const { data: video, isLoading, error } = useVideo(id!)
  const updateVideo = useUpdateVideo()

  const handleSubmit = async (data: UpdateVideoDto) => {
    if (!id) return
    await updateVideo.mutateAsync({ id, data })
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </DashboardLayout>
    )
  }

  if (error || !video) {
    return <Navigate to="/creators/dashboard/videos" replace />
  }

  return (
    <DashboardLayout>
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
    </DashboardLayout>
  )
}
