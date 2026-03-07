import { Link } from 'react-router-dom'
import { Card } from '@/components/ui'
import { VideoForm } from '@/features/creators/dashboard/videos/components/VideoForm'
import { useCreateVideo } from '@/features/hub/videos/hooks/useVideos'
import type { CreateVideoDto } from '@/features/hub/videos/types'

export default function CreateVideoPage() {
  const createVideo = useCreateVideo()

  const handleSubmit = async (data: CreateVideoDto) => {
    await createVideo.mutateAsync(data)
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Criar video</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Publica conteudo audiovisual para a tua audiencia.
        </p>
      </header>

      <Card className="p-6 sm:p-8">
        <VideoForm
          onSubmit={handleSubmit}
          submitText="Publicar video"
          redirectTo="/dashboard/conteudo/videos"
        />
      </Card>

      <Card className="border-dashed bg-muted/30 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide">Checklist rapido</h2>
        <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
          <li>URL do video valida e testada.</li>
          <li>Thumbnail legivel em mobile.</li>
          <li>Descricao com pontos principais e contexto.</li>
          <li>
            Se precisares de texto longo, usa{' '}
            <Link to="/dashboard/criar" className="text-primary underline underline-offset-2">
              Criar artigo
            </Link>
            .
          </li>
        </ul>
      </Card>
    </div>
  )
}
