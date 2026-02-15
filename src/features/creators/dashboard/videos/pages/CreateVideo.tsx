import { DashboardLayout } from '@/shared/layouts'
import { VideoForm } from '../components/VideoForm'
import { useCreateVideo } from '@/features/hub/videos/hooks/useVideos'
import { Card } from '@/components/ui'
import type { CreateVideoDto } from '@/features/hub/videos/types'

/**
 * Pagina de criacao de video
 */
export function CreateVideo() {
  const createVideo = useCreateVideo()

  const handleSubmit = async (data: CreateVideoDto) => {
    await createVideo.mutateAsync(data)
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Criar Novo Video</h1>
          <p className="mt-1 text-muted-foreground">
            Partilha conteudo em video sobre financas e investimentos
          </p>
        </div>

        <Card className="p-8">
          <VideoForm onSubmit={handleSubmit} submitText="Criar Video" />
        </Card>
      </div>
    </DashboardLayout>
  )
}
