import { DashboardLayout } from '@/shared/layouts'
import { PodcastForm } from '../components/PodcastForm'
import { useCreatePodcast } from '@/features/hub/podcasts/hooks/usePodcasts'
import { Card } from '@/components/ui'
import type { CreatePodcastDto } from '@/features/hub/podcasts/types'

/**
 * Pagina de criacao de podcast
 */
export function CreatePodcast() {
  const createPodcast = useCreatePodcast()

  const handleSubmit = async (data: CreatePodcastDto) => {
    await createPodcast.mutateAsync(data)
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Criar Novo Podcast</h1>
          <p className="mt-1 text-muted-foreground">Partilha conhecimento em formato audio</p>
        </div>

        <Card className="p-8">
          <PodcastForm onSubmit={handleSubmit} submitText="Criar Podcast" />
        </Card>

        <Card className="border-dashed bg-muted/30 p-6">
          <h3 className="mb-2 font-semibold">Dicas para um bom podcast</h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>- Define um tema e formato consistente</li>
            <li>- Mantem uma frequencia regular de publicacao</li>
            <li>- Adiciona links do Spotify e Apple Podcasts</li>
            <li>- Usa uma imagem de capa profissional</li>
            <li>- Inclui notas e transcricoes nos episodios</li>
          </ul>
        </Card>
      </div>
    </DashboardLayout>
  )
}
